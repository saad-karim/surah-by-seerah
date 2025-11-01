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

interface VerseWord {
  id: number;
  position: number;
  audio_url: string | null;
  char_type_name: string;
  text_imlaei: string;
  text_uthmani: string;
  translation: {
    text: string;
    language_name: string;
  };
}

interface Verse {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  text_imlaei: string;
  text_imlaei_simple: string;
  juz_number: number;
  hizb_number: number;
  rub_number: number;
  page_number: number;
  words: VerseWord[];
  translations?: Array<{
    id: number;
    language_name: string;
    text: string;
    resource_name: string;
  }>;
}

interface ChapterVersesResponse {
  verses: Verse[];
  pagination: {
    per_page: number;
    current_page: number;
    next_page: number | null;
    total_pages: number;
    total_records: number;
  };
}

class QuranApiService {
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

    // Get new token
    const tokenUrl = this.config.baseUrl.includes('prelive') 
      ? 'https://prelive-oauth2.quran.foundation/oauth2/token'
      : 'https://oauth2.quran.foundation/oauth2/token';

    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', this.config.clientId);
    formData.append('client_secret', this.config.clientSecret);
    formData.append('scope', 'content');

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    const tokenData: AccessTokenResponse = await response.json();
    this.accessToken = tokenData.access_token;
    
    // Set expiry to 5 minutes before actual expiry for safety
    this.tokenExpiry = new Date(Date.now() + (tokenData.expires_in - 300) * 1000);
    
    return this.accessToken;
  }

  private async makeAuthenticatedRequest<T>(endpoint: string): Promise<T> {
    const token = await this.getAccessToken();
    
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      headers: {
        'x-auth-token': token,
        'x-client-id': this.config.clientId,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getAllChapters(): Promise<ChapterInfo[]> {
    const response = await this.makeAuthenticatedRequest<ChaptersResponse>('/chapters');
    return response.chapters;
  }

  async getChapterVerses(
    chapterNumber: number, 
    options: {
      language?: string;
      words?: boolean;
      translations?: string;
      page?: number;
      perPage?: number;
    } = {}
  ): Promise<ChapterVersesResponse> {
    const params = new URLSearchParams();
    
    if (options.language) params.append('language', options.language);
    if (options.words !== undefined) params.append('words', options.words.toString());
    if (options.translations) params.append('translations', options.translations);
    if (options.page) params.append('page', options.page.toString());
    if (options.perPage) params.append('per_page', options.perPage.toString());

    const queryString = params.toString();
    const endpoint = `/chapters/${chapterNumber}/verses${queryString ? `?${queryString}` : ''}`;
    
    return this.makeAuthenticatedRequest<ChapterVersesResponse>(endpoint);
  }

  async getChapterInfo(chapterNumber: number): Promise<ChapterInfo> {
    const chapters = await this.getAllChapters();
    const chapter = chapters.find(ch => ch.id === chapterNumber);
    
    if (!chapter) {
      throw new Error(`Chapter ${chapterNumber} not found`);
    }
    
    return chapter;
  }
}

// Export configured instance
export const quranApi = new QuranApiService({
  baseUrl: 'https://apis-prelive.quran.foundation/content/api/v4',
  clientId: process.env.VITE_QURAN_CLIENT_ID || '',
  clientSecret: process.env.VITE_QURAN_CLIENT_SECRET || '',
});

export type { ChapterInfo, ChapterVersesResponse, Verse, VerseWord };