import { DetailedTimelinePayload } from "./types";

export const PAYLOAD: DetailedTimelinePayload = {
  version: "1.0.0",
  stages: [
    {
      id: "stage-1",
      name: "The Awakening — Private Revelation",
      period: "Makkah",
      timespan_ce: "610–613",
      description: "Spiritual preparation before public preaching.",
      items: [
        {
          type: "surah",
          revelation_order: 1,
          name_en: "Al-‘Alaq",
          name_ar: "العلق",
          chapter_number: 96,
          verses_range: "1–5 (initial)",
          location: "Cave of Hira, Makkah",
          themes: ["Knowledge", "Creation", "Faith"],
          notes: "First verses revealed; beginning of Prophethood.",
        },
        {
          type: "event",
          name: "First Revelation",
          year_ce: 610,
          location: "Cave of Hira, Jabal al-Nour",
          linked_surahs: [96],
          notes: "Angel Jibril commands “Read/Recite.”",
        },
      ],
    },
  ],
  metadata: {
    generated_at: "2025-10-29T00:00:00Z",
    notes:
      "Sequence reflects commonly cited early-revelation ordering and themes; precise chronology among some Makkan surahs can vary by source.",
  },
};
