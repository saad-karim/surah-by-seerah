type translations = {
  text: string;
};

export interface QuranServiceConfig {
  clientId: string;
  clientSecret: string;
}

interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export class QuranService {
  private config: QuranServiceConfig;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  private baseUrl = "https://apis.quran.foundation/content/api/v4";

  constructor(config: QuranServiceConfig) {
    this.config = config;
  }

  private async getAccessToken(): Promise<string> {
    // Check if current token is still valid
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Get new token - use pre-live endpoint for testing credentials
    const tokenUrl = "https://oauth2.quran.foundation/oauth2/token";

    // Create Basic Auth header
    const credentials = Buffer.from(
      `${this.config.clientId}:${this.config.clientSecret}`,
    ).toString("base64");

    const formData = new URLSearchParams();
    formData.append("grant_type", "client_credentials");
    formData.append("scope", "content");

    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OAuth2 Error Response:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        throw new Error(
          `Failed to get access token: ${response.statusText} - ${errorText}`,
        );
      }

      const tokenData: AccessTokenResponse = await response.json();
      this.accessToken = tokenData.access_token;

      // Set expiry to 5 minutes before actual expiry for safety
      this.tokenExpiry = new Date(
        Date.now() + (tokenData.expires_in - 300) * 1000,
      );

      return this.accessToken;
    } catch (error) {
      console.error("Failed to obtain access token:", error);
      throw error;
    }
  }

  private async makeAuthenticatedRequest<T>(endpoint: string): Promise<T> {
    const token = await this.getAccessToken();
    const fullUrl = `${this.baseUrl}${endpoint}`;

    // console.log(`🌐 Making API request to: ${fullUrl}`);

    const response = await fetch(fullUrl, {
      headers: {
        "x-auth-token": token,
        "x-client-id": this.config.clientId,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error Details:`, {
        url: fullUrl,
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getAllChapters() {
    try {
      const response = await this.makeAuthenticatedRequest<{ chapters: any[] }>(
        "/chapters",
      );
      return response.chapters;
    } catch (error) {
      console.error(
        "Failed to fetch all chapters:",
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  async getChapter(chapterNumber: number) {
    try {
      const response = await this.makeAuthenticatedRequest<{ chapter: any }>(
        `/chapters/${chapterNumber}`,
      );
      return response.chapter;
    } catch (error) {
      console.error(
        `Failed to fetch chapter ${chapterNumber}:`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  async getChapterInfo(chapterNumber: number) {
    try {
      // First, let's verify the chapter exists by checking all chapters
      const allChapters = await this.getAllChapters();
      const targetChapter = allChapters.find((ch) => ch.id === chapterNumber);

      return targetChapter;
    } catch (error) {
      console.error(
        `Failed to fetch chapter ${chapterNumber}:`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  async getChapterVerses(
    chapterNumber: number,
    options?: { page?: number; perPage?: number },
  ) {
    try {
      const params = new URLSearchParams();
      if (options?.page) params.append("page", options.page.toString());
      if (options?.perPage)
        params.append("per_page", options.perPage.toString());
      params.append("words", "true");
      params.append("fields", "text_uthmani,text_imlaei_simple"); // Get Arabic text fields

      const queryString = params.toString();
      const endpoint = `/verses/by_chapter/${chapterNumber}${queryString ? `?${queryString}` : ""}`;

      const response = await this.makeAuthenticatedRequest<{ verses: any[] }>(
        endpoint,
      );

      // const translations = await this.getSurahTranslations(chapterNumber, 20);
      // console.log("translations:", translations);

      // const trans = await this.makeAuthenticatedRequest<{
      //   translations: any[];
      // }>(`/resources/translations/`);
      //
      // const tmps = trans.translations;
      // for (const t of tmps) {
      //   if (t.language_name === "english") {
      //     console.log("translation:", t);
      //   }
      // }

      return response.verses;
    } catch (error) {
      console.error(
        `Failed to fetch verses for chapter ${chapterNumber}:`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  async getChapterTranslations(surahNumber: number, resourceId: number = 131) {
    try {
      // First get chapter info to know total verse count
      const chapterInfo = await this.getChapterInfo(surahNumber);
      const totalVerses = chapterInfo.versesCount || chapterInfo.verses_count || 50;
      
      let allTranslations: translations[] = [];
      let page = 1;
      let hasMorePages = true;
      const perPage = 50; // API default per page limit

      while (hasMorePages) {
        const response = await this.makeAuthenticatedRequest<{
          translations: translations[];
          pagination?: {
            current_page: number;
            total_pages: number;
            total_records: number;
            per_page: number;
          };
        }>(`/translations/${resourceId}/by_chapter/${surahNumber}?page=${page}&per_page=${perPage}`);
        
        const pageTranslations = response.translations || [];
        allTranslations = allTranslations.concat(pageTranslations);
        
        // Check if we have more pages or have reached total verses
        if (response.pagination) {
          hasMorePages = page < response.pagination.total_pages;
        } else {
          // If no pagination info, check if we have all verses
          hasMorePages = allTranslations.length < totalVerses;
        }
        
        page++;
        
        // Safety break to prevent infinite loop
        if (page > 10) { // Max 10 pages (500 verses) should cover any chapter
          break;
        }
      }

      return allTranslations;
    } catch (error) {
      console.error(
        `Failed to fetch translations for chapter ${surahNumber}:`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  async getAyahTranslations(ayahKey: string, resourceId: number = 131) {
    try {
      const response = await this.makeAuthenticatedRequest<{
        translations: translations[];
      }>(`/translations/${resourceId}/by_ayah/${ayahKey}`);
      return response.translations;
    } catch (error) {
      console.error(
        `Failed to fetch translations for ayah ${ayahKey}:`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }
}

export function createQuranService(config: QuranServiceConfig): QuranService {
  return new QuranService(config);
}
