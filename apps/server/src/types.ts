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
