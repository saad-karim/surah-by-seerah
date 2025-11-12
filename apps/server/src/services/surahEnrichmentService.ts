import { QuranService } from "./quranClient.js";
import type {
  DetailedSurahItem,
  DetailedEventItem,
  DetailedTimelinePayload,
} from "../types.js";

interface ChapterInfo {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: number[];
  translated_name: {
    language_name: string;
    name: string;
  };
}

interface EnrichedSurahItem extends DetailedSurahItem {
  api_data?: {
    verses_count: number;
    pages: number[];
    bismillah_pre: boolean;
    name_simple: string;
    name_complex: string;
    translated_name: string;
  };
}

interface EnrichedTimelinePayload
  extends Omit<DetailedTimelinePayload, "stages"> {
  stages: Array<{
    id: string;
    name: string;
    period: string;
    timespan_ce: string;
    description: string;
    items: Array<EnrichedSurahItem | DetailedEventItem>;
  }>;
}

export class SurahEnrichmentService {
  private chapterCache: Map<number, ChapterInfo> = new Map();
  private isApiAvailable: boolean = true;
  private quranService: QuranService;

  constructor(quranService: QuranService) {
    this.quranService = quranService;
  }

  async getChapterInfo(chapterNumber: number): Promise<ChapterInfo> {
    if (this.chapterCache.has(chapterNumber)) {
      return this.chapterCache.get(chapterNumber)!;
    }

    try {
      const chapterInfo = await this.quranService.getChapterInfo(chapterNumber);

      // Map the QuranJS response to our expected format
      const mappedChapter: ChapterInfo = {
        id: chapterInfo.id,
        revelation_place: chapterInfo.revelationPlace,
        revelation_order: chapterInfo.revelationOrder,
        bismillah_pre: chapterInfo.bismillahPre,
        name_simple: chapterInfo.nameSimple,
        name_complex: chapterInfo.nameComplex,
        name_arabic: chapterInfo.nameArabic,
        verses_count: chapterInfo.versesCount,
        pages: chapterInfo.pages || [],
        translated_name: {
          language_name: chapterInfo.translatedName?.languageName || "english",
          name: chapterInfo.translatedName?.name || chapterInfo.nameSimple,
        },
      };

      this.chapterCache.set(chapterNumber, mappedChapter);
      return mappedChapter;
    } catch (error) {
      console.error(`Failed to fetch chapter ${chapterNumber} info:`, error);
      throw error;
    }
  }

  async enrichSurahItem(surah: DetailedSurahItem): Promise<EnrichedSurahItem> {
    if (!this.isApiAvailable) {
      return surah;
    }

    try {
      // Handle both single chapter numbers and arrays
      const chapterNumbers = Array.isArray(surah.chapter_number)
        ? surah.chapter_number
        : [surah.chapter_number];

      // For now, enrich with data from the first chapter if multiple
      const primaryChapterNumber = chapterNumbers[0];
      const chapterInfo = await this.getChapterInfo(primaryChapterNumber);

      const enrichedSurah: EnrichedSurahItem = {
        ...surah,
        api_data: {
          verses_count: chapterInfo.verses_count,
          pages: chapterInfo.pages,
          bismillah_pre: chapterInfo.bismillah_pre,
          name_simple: chapterInfo.name_simple,
          name_complex: chapterInfo.name_complex,
          translated_name: chapterInfo.translated_name.name,
        },
      };

      // Update name_en if API provides better translation AND it's in English
      if (
        chapterInfo.translated_name.name &&
        chapterInfo.translated_name.name.trim() &&
        !/[\u0600-\u06FF]/.test(chapterInfo.translated_name.name) // Check if it doesn't contain Arabic characters
      ) {
        enrichedSurah.name_en = chapterInfo.translated_name.name;
      }

      // Update name_ar with API data if available
      if (chapterInfo.name_arabic) {
        enrichedSurah.name_ar = chapterInfo.name_arabic;
      }

      // Add verses range if not present
      if (!enrichedSurah.verses_range && chapterInfo.verses_count) {
        enrichedSurah.verses_range = `1-${chapterInfo.verses_count}`;
      }

      return enrichedSurah;
    } catch (error) {
      console.warn(`Failed to enrich surah ${surah.name_en}:`, error);
      // Return original surah if enrichment fails
      return surah;
    }
  }

  async enrichTimelinePayload(
    payload: DetailedTimelinePayload,
  ): Promise<EnrichedTimelinePayload> {
    try {
      const enrichedStages = await Promise.all(
        payload.stages.map(async (stage) => {
          const enrichedItems = await Promise.all(
            stage.items.map(async (item) => {
              if (item.type === "surah") {
                return this.enrichSurahItem(item);
              }
              return item;
            }),
          );

          return {
            ...stage,
            items: enrichedItems,
          };
        }),
      );

      return {
        ...payload,
        stages: enrichedStages,
      };
    } catch (error) {
      console.error(
        "Failed to enrich timeline payload:",
        error instanceof Error ? error.message : String(error),
      );
      // Return original payload if enrichment completely fails
      return payload as EnrichedTimelinePayload;
    }
  }

  async preloadChapterData(): Promise<void> {
    if (!this.isApiAvailable) {
      return;
    }

    try {
      console.log("Preloading chapter data from Quran Foundation API...");
      const chapters = await this.quranService.getAllChapters();

      chapters.forEach((chapter: any) => {
        const mappedChapter: ChapterInfo = {
          id: chapter.id,
          revelation_place: chapter.revelation_place,
          revelation_order: chapter.revelation_order,
          bismillah_pre: chapter.bismillah_pre,
          name_simple: chapter.name_simple,
          name_complex: chapter.name_complex,
          name_arabic: chapter.name_arabic,
          verses_count: chapter.verses_count,
          pages: chapter.pages || [],
          translated_name: {
            language_name: chapter.translated_name?.language_name || "english",
            name: chapter.translated_name?.name || chapter.name_simple,
          },
        };
        this.chapterCache.set(chapter.id, mappedChapter);
      });

      console.log(`Preloaded ${chapters.length} chapters`);
    } catch (error) {
      console.error("Failed to preload chapter data:", error);
      this.isApiAvailable = false;
    }
  }

  clearCache(): void {
    this.chapterCache.clear();
  }
}

export type { EnrichedSurahItem, EnrichedTimelinePayload };
