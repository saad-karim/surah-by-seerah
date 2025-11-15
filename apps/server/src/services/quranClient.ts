import { quran } from "@quranjs/api";

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
      params.append("translations", "131"); // Dr. Mustafa Khattab, the Clear Quran
      params.append("fields", "text_uthmani,text_imlaei_simple");

      const queryString = params.toString();
      // const endpoint = `/chapters/${chapterNumber}/verses${queryString ? `?${queryString}` : ""}`;
      const endpoint = `/verses/by_chapter/${chapterNumber}${queryString ? `?${queryString}` : ""}`;

      const response = await this.makeAuthenticatedRequest<{ verses: any[] }>(
        endpoint,
      );
      return response.verses;
    } catch (error) {
      console.error(
        `Failed to fetch verses for chapter ${chapterNumber}:`,
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

}

export function createQuranService(config: QuranServiceConfig): QuranService {
  return new QuranService(config);
}
