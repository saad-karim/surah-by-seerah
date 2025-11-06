import { quran, ChapterId } from "@quranjs/api";

export interface QuranServiceConfig {
  clientId: string;
  clientSecret: string;
}

export class QuranService {
  constructor(config: QuranServiceConfig) {
    // this.client = new QuranClient({
    //   clientId: config.clientId,
    //   clientSecret: config.clientSecret,
    //   defaults: {
    //     language: Language.ENGLISH,
    //   },
    // });
  }

  async getAllChapters() {
    try {
      const response = await quran.v4.chapters.findAll();
      return response;
    } catch (error) {
      console.error("Failed to fetch all chapters:", error);
      throw error;
    }
  }

  async getChapter(chapterNumber: number) {
    try {
      const response = await quran.v4.chapters.findById(
        chapterNumber as ChapterId,
      );
      return response;
    } catch (error) {
      console.error(`Failed to fetch chapter ${chapterNumber}:`, error);
      throw error;
    }
  }

  async getChapterInfo(chapterNumber: number) {
    try {
      const response = await quran.v4.chapters.findById(
        chapterNumber as ChapterId,
      );
      return response;
    } catch (error) {
      console.error(`Failed to fetch chapter ${chapterNumber}:`, error);
      throw error;
    }
  }

  async getChapterVerses(
    chapterNumber: number,
    options?: { page?: number; perPage?: number },
  ) {
    try {
      const response = await quran.v4.verses.findByChapter(
        chapterNumber as ChapterId,
        {
          page: options?.page || 1,
          perPage: options?.perPage || 50,
          words: true,
          translations: [20], // English translation
          fields: { textUthmani: true, textImlaeiSimple: true },
        },
      );
      return response;
    } catch (error) {
      console.error(
        `Failed to fetch verses for chapter ${chapterNumber}:`,
        error,
      );
      throw error;
    }
  }
}

export function createQuranService(config: QuranServiceConfig): QuranService {
  return new QuranService(config);
}
