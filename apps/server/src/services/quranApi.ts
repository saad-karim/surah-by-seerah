import fetch from "node-fetch";

interface QuranApiConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
}

interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

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

interface ChaptersResponse {
  chapters: ChapterInfo[];
}

export class QuranApiService {
  private config: QuranApiConfig;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(config: QuranApiConfig) {
    this.config = config;
  }

  private async getAccessToken(): Promise<string> {
    // Check if current token is still valid
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Get new token using Basic auth as per Quran Foundation docs
    const tokenUrl = "https://prelive-oauth2.quran.foundation/oauth2/token";

    // Create Basic auth header
    const auth = Buffer.from(
      `${this.config.clientId}:${this.config.clientSecret}`,
    ).toString("base64");

    console.log(
      "Debug - Client ID:",
      this.config.clientId ? "Present" : "Missing",
    );
    console.log(
      "Debug - Client Secret:",
      this.config.clientSecret ? "Present" : "Missing",
    );
    console.log("Debug - Auth header:", `Basic ${auth}`);

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials&scope=content",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to get access token: ${response.statusText} - ${errorText}`,
      );
    }

    const tokenData = (await response.json()) as AccessTokenResponse;
    this.accessToken = tokenData.access_token;

    // Set expiry to 5 minutes before actual expiry for safety
    this.tokenExpiry = new Date(
      Date.now() + (tokenData.expires_in - 300) * 1000,
    );

    return this.accessToken;
  }

  private async makeAuthenticatedRequest<T>(endpoint: string): Promise<T> {
    const token = await this.getAccessToken();

    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      headers: {
        "x-auth-token": token,
        "x-client-id": this.config.clientId,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json() as T;
  }

  async getAllChapters(): Promise<ChapterInfo[]> {
    const response =
      await this.makeAuthenticatedRequest<ChaptersResponse>("/chapters");
    return response.chapters;
  }

  async getChapterInfo(chapterNumber: number): Promise<ChapterInfo> {
    const chapters = await this.getAllChapters();
    const chapter = chapters.find((ch) => ch.id === chapterNumber);

    if (!chapter) {
      throw new Error(`Chapter ${chapterNumber} not found`);
    }

    return chapter;
  }
}

// Export factory function instead of pre-configured instance
export function createQuranApi() {
  return new QuranApiService({
    baseUrl: "https://apis-prelive.quran.foundation/content/api/v4",
    clientId: process.env.QURAN_CLIENT_ID || "",
    clientSecret: process.env.QURAN_CLIENT_SECRET || "",
  });
}

export type { ChapterInfo };
