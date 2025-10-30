export type HijriSpan = { startAH: number; endAH: number };
export type SirahEvent = {
  id: string;
  title: string;
  type: "revelation" | "migration" | "treaty" | "battle" | "milestone";
  yearAH: number; // approximate (negative = pre-Hijrah)
  month?: string;
  location?: string;
  summary?: string;
  links?: string[];
};
export type AsbabLink = {
  ayahRange: string;
  summary: string;
  sources: string[];
  confidence: "variant" | "supported" | "weak";
};
export type Revelation = {
  surahId: number;
  surahName: string;
  place: "meccan" | "medinan";
  revelationOrder: number;
  approxYearAH: number;
  linkedEventIds?: string[];
  asbab?: AsbabLink[];
};
export type TimelinePayload = {
  meccan: HijriSpan;
  medinan: HijriSpan;
  events: SirahEvent[];
  revelations: Revelation[];
};

export type DetailedSurahItem = {
  type: "surah";
  revelation_order: number;
  name_en: string;
  name_ar: string;
  chapter_number: number | number[];
  verses_range?: string;
  location: string;
  themes: string[];
  notes?: string;
};

export type DetailedEventItem = {
  type: "event";
  name: string;
  year_ce: number;
  location: string;
  linked_surahs: number[];
  notes?: string;
};

export type DetailedTimelineItem = DetailedSurahItem | DetailedEventItem;

export type DetailedTimelineStage = {
  id: string;
  name: string;
  period: string;
  timespan_ce: string;
  description: string;
  items: DetailedTimelineItem[];
};

export type DetailedTimelinePayload = {
  version: string;
  stages: DetailedTimelineStage[];
  metadata: {
    generated_at: string;
    notes: string;
  };
};
