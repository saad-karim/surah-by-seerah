import { DetailedTimelinePayload } from "./types";

export const PAYLOAD: DetailedTimelinePayload = {
  version: "1.0.2",
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
          notes:
            "The first revealed verses, commanding the Prophet ﷺ to read in the name of his Lord who created mankind from a clinging clot. It introduces themes of knowledge, the pen, and divine teaching, marking the start of revelation and establishing that guidance begins with recognizing the Creator and seeking knowledge from Him.",
        },
      ],
    },
  ],
  metadata: {
    generated_at: "2025-10-29T00:00:00Z",
    notes:
      "Sequence reflects commonly cited early-revelation ordering and themes; precise chronology among some Makkan surahs can vary by source. Notes for both surahs and events are expanded to provide richer seerah context and educational detail.",
  },
};
