import { quranApi, type ChapterInfo } from './quranApi';
import type { DetailedSurahItem, DetailedTimelinePayload } from '../types';

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

interface EnrichedTimelinePayload extends Omit<DetailedTimelinePayload, 'stages'> {
  stages: Array<{
    id: string;
    name: string;
    period: string;
    timespan_ce: string;
    description: string;
    items: Array<EnrichedSurahItem | DetailedTimelinePayload['stages'][0]['items'][0]>;
  }>;
}

class SurahEnrichmentService {
  private chapterCache: Map<number, ChapterInfo> = new Map();

  async getChapterInfo(chapterNumber: number): Promise<ChapterInfo> {
    if (this.chapterCache.has(chapterNumber)) {
      return this.chapterCache.get(chapterNumber)!;
    }

    try {
      const chapterInfo = await quranApi.getChapterInfo(chapterNumber);
      this.chapterCache.set(chapterNumber, chapterInfo);
      return chapterInfo;
    } catch (error) {
      console.error(`Failed to fetch chapter ${chapterNumber} info:`, error);
      throw error;
    }
  }

  async enrichSurahItem(surah: DetailedSurahItem): Promise<EnrichedSurahItem> {
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

      // Update name_en if API provides better translation
      if (chapterInfo.translated_name.name && chapterInfo.translated_name.name.trim()) {
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

  async enrichTimelinePayload(payload: DetailedTimelinePayload): Promise<EnrichedTimelinePayload> {
    const enrichedStages = await Promise.all(
      payload.stages.map(async (stage) => {
        const enrichedItems = await Promise.all(
          stage.items.map(async (item) => {
            if (item.type === 'surah') {
              return this.enrichSurahItem(item);
            }
            return item;
          })
        );

        return {
          ...stage,
          items: enrichedItems,
        };
      })
    );

    return {
      ...payload,
      stages: enrichedStages,
    };
  }

  async preloadChapterData(): Promise<void> {
    try {
      console.log('Preloading chapter data from Quran Foundation API...');
      const chapters = await quranApi.getAllChapters();
      
      chapters.forEach(chapter => {
        this.chapterCache.set(chapter.id, chapter);
      });
      
      console.log(`Preloaded ${chapters.length} chapters`);
    } catch (error) {
      console.error('Failed to preload chapter data:', error);
    }
  }

  clearCache(): void {
    this.chapterCache.clear();
  }
}

export const surahEnrichmentService = new SurahEnrichmentService();
export type { EnrichedSurahItem, EnrichedTimelinePayload };