import { DetailedTimelinePayload } from "./types";

export const PAYLOAD: DetailedTimelinePayload = {
  version: "1.0.0",
  stages: [
    {
      id: "stage-1",
      name: "The Awakening — Private Revelation",
      period: "Makkah",
      timespan_ce: "610–613",
      description:
        "Spiritual preparation and the earliest private revelations in Makkah before public preaching.",
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
          notes: "First verses revealed; marks the beginning of Prophethood.",
        },
        {
          type: "surah",
          revelation_order: 2,
          name_en: "Al-Qalam",
          name_ar: "القلم",
          chapter_number: 68,
          verses_range: "1–52",
          location: "Makkah",
          themes: ["Morality", "Patience", "Truthfulness"],
          notes:
            "Encouragement and reassurance to the Prophet; defense against accusations of madness.",
        },
        {
          type: "surah",
          revelation_order: 3,
          name_en: "Al-Muzzammil",
          name_ar: "المزمل",
          chapter_number: 73,
          verses_range: "1–20",
          location: "Makkah",
          themes: ["Night Prayer", "Spiritual Discipline", "Preparation"],
          notes:
            "Commands night prayer and patience; spiritual training before public call.",
        },
        {
          type: "surah",
          revelation_order: 4,
          name_en: "Al-Muddaththir",
          name_ar: "المدثر",
          chapter_number: 74,
          verses_range: "1–56",
          location: "Makkah",
          themes: ["Call to Preach", "Warning", "Accountability"],
          notes:
            "Direct command to rise and warn; marks the start of public mission.",
        },
      ],
    },
    {
      id: "stage-2",
      name: "The Early Call — Secret Preaching",
      period: "Makkah",
      timespan_ce: "613–615",
      description:
        "Prophet invites close family and friends to Islam quietly; small circle of early believers.",
      items: [
        {
          type: "surah",
          revelation_order: 5,
          name_en: "Al-Fatihah",
          name_ar: "الفاتحة",
          chapter_number: 1,
          verses_range: "1–7",
          location: "Makkah",
          themes: ["Guidance", "Mercy", "Monotheism"],
          notes:
            "Opening chapter of the Qur’an; foundational prayer summarizing faith.",
        },
        {
          type: "surah",
          revelation_order: 6,
          name_en: "Al-Lahab",
          name_ar: "المسد",
          chapter_number: 111,
          verses_range: "1–5",
          location: "Makkah",
          themes: ["Rejection", "Divine Justice"],
          notes:
            "Condemnation of Abu Lahab after his opposition to the Prophet’s public call.",
        },
      ],
    },
    {
      id: "stage-3",
      name: "Public Preaching and Persecution",
      period: "Makkah",
      timespan_ce: "615–617",
      description:
        "Open proclamation of Islam; Quraysh opposition intensifies; message of tawheed (oneness of God) emphasized.",
      items: [
        {
          type: "surah",
          revelation_order: 7,
          name_en: "At-Takwir",
          name_ar: "التكوير",
          chapter_number: 81,
          verses_range: "1–29",
          location: "Makkah",
          themes: ["Day of Judgment", "Accountability"],
          notes: "Powerful imagery of cosmic events signaling resurrection.",
        },
        {
          type: "surah",
          revelation_order: 9,
          name_en: "Al-Layl",
          name_ar: "الليل",
          chapter_number: 92,
          verses_range: "1–21",
          location: "Makkah",
          themes: ["Charity", "Faith vs. Rejection"],
          notes:
            "Encouragement to strive for good deeds; contrasts believers and rejectors.",
        },
      ],
    },
    {
      id: "stage-4",
      name: "The Boycott Years",
      period: "Makkah",
      timespan_ce: "617–619",
      description:
        "Muslims and Banu Hashim clans face social and economic boycott in Shi‘b Abi Talib.",
      items: [
        {
          type: "surah",
          revelation_order: 26,
          name_en: "Ash-Shu‘ara",
          name_ar: "الشعراء",
          chapter_number: 26,
          verses_range: "1–227",
          location: "Makkah",
          themes: ["Prophets’ Stories", "Divine Support"],
          notes:
            "Highlights prophets’ struggles and divine help; strengthens the believers’ resolve.",
        },
        {
          type: "surah",
          revelation_order: 36,
          name_en: "Ya-Sin",
          name_ar: "يس",
          chapter_number: 36,
          verses_range: "1–83",
          location: "Makkah",
          themes: ["Resurrection", "Message Rejection", "Signs of God"],
          notes: "Reinforces the truth of the message amid persecution.",
        },
      ],
    },
    {
      id: "stage-5",
      name: "Year of Sorrow and Ta’if Journey",
      period: "Makkah",
      timespan_ce: "619–620",
      description:
        "Death of Khadijah and Abu Talib; rejection at Ta’if; spiritual solace through revelation and Isra’ & Mi‘raj.",
      items: [
        {
          type: "surah",
          revelation_order: 50,
          name_en: "Al-Isra (Bani Isra’il)",
          name_ar: "الإسراء",
          chapter_number: 17,
          verses_range: "1–111",
          location: "Makkah",
          themes: ["Night Journey", "Moral Law", "Faith"],
          notes:
            "Mentions the Isra’ and Mi‘raj; emphasizes ethics and accountability.",
        },
      ],
    },
    {
      id: "stage-6",
      name: "Pledge of Aqabah and Migration Preparation",
      period: "Makkah → Yathrib",
      timespan_ce: "620–622",
      description:
        "Delegations from Yathrib (Medina) accept Islam; pledge allegiance; groundwork for migration.",
      items: [
        {
          type: "surah",
          revelation_order: 73,
          name_en: "Al-Ankabut",
          name_ar: "العنكبوت",
          chapter_number: 29,
          verses_range: "1–69",
          location: "Makkah",
          themes: ["Trials", "Faith Under Persecution"],
          notes: "Encourages perseverance during hardship; reassures migrants.",
        },
      ],
    },
    {
      id: "stage-7",
      name: "Hijrah and Establishment in Medina",
      period: "Medinah",
      timespan_ce: "622–624",
      description:
        "Migration to Medina; building the first mosque; brotherhood between Ansar and Muhajirun.",
      items: [
        {
          type: "surah",
          revelation_order: 87,
          name_en: "Al-Baqarah",
          name_ar: "البقرة",
          chapter_number: 2,
          verses_range: "1–286",
          location: "Medinah",
          themes: ["Law", "Faith Community", "Covenant"],
          notes:
            "Longest surah; outlines new community laws, qiblah change, and fasting.",
        },
      ],
    },
    {
      id: "stage-8",
      name: "Battle of Badr",
      period: "Medinah",
      timespan_ce: "624",
      description:
        "First major battle between Muslims and Quraysh; decisive Muslim victory.",
      items: [
        {
          type: "surah",
          revelation_order: 88,
          name_en: "Al-Anfal",
          name_ar: "الأنفال",
          chapter_number: 8,
          verses_range: "1–75",
          location: "Medinah",
          themes: ["War Ethics", "Victory", "Unity"],
          notes: "Addresses distribution of spoils and unity after Badr.",
        },
      ],
    },
    {
      id: "stage-9",
      name: "Battle of Uhud",
      period: "Medinah",
      timespan_ce: "625",
      description:
        "Muslims face setback at Uhud; lessons of obedience and patience.",
      items: [
        {
          type: "surah",
          revelation_order: 89,
          name_en: "Al-Imran",
          name_ar: "آل عمران",
          chapter_number: 3,
          verses_range: "1–200",
          location: "Medinah",
          themes: ["Faith", "Obedience", "Perseverance"],
          notes:
            "Reflects on lessons from Uhud and interfaith dialogue with Christians.",
        },
      ],
    },
    {
      id: "stage-10",
      name: "Battle of the Trench (Ahzab)",
      period: "Medinah",
      timespan_ce: "627",
      description:
        "Coalition siege of Medina; Muslims’ perseverance and divine aid.",
      items: [
        {
          type: "surah",
          revelation_order: 90,
          name_en: "Al-Ahzab",
          name_ar: "الأحزاب",
          chapter_number: 33,
          verses_range: "1–73",
          location: "Medinah",
          themes: ["Social Law", "Trust in Allah", "Prophetic Example"],
          notes:
            "Revealed during Battle of the Trench; strengthens faith and family ethics.",
        },
      ],
    },
    {
      id: "stage-11",
      name: "Treaty of Hudaybiyyah and Truce",
      period: "Medinah",
      timespan_ce: "628",
      description: "Peace treaty with Quraysh opens path for dawah expansion.",
      items: [
        {
          type: "surah",
          revelation_order: 111,
          name_en: "Al-Fath",
          name_ar: "الفتح",
          chapter_number: 48,
          verses_range: "1–29",
          location: "Medinah",
          themes: ["Victory", "Peace", "Trust"],
          notes: "Describes Treaty of Hudaybiyyah as a manifest victory.",
        },
      ],
    },
    {
      id: "stage-12",
      name: "Letters to Kings & Dawah Expansion",
      period: "Medinah",
      timespan_ce: "628–629",
      description:
        "Prophet sends letters inviting rulers (Heraclius, Muqawqis, Kisra) to Islam.",
      items: [
        {
          type: "surah",
          revelation_order: 112,
          name_en: "Al-Hujurat",
          name_ar: "الحجرات",
          chapter_number: 49,
          verses_range: "1–18",
          location: "Medinah",
          themes: ["Community Ethics", "Unity", "Respect"],
          notes: "Emphasizes manners, brotherhood, and social harmony.",
        },
      ],
    },
    {
      id: "stage-13",
      name: "Battle of Mu’tah & Tabuk",
      period: "Medinah",
      timespan_ce: "629–630",
      description:
        "First encounters with Byzantine forces; tests of obedience and faith.",
      items: [
        {
          type: "surah",
          revelation_order: 113,
          name_en: "At-Tawbah",
          name_ar: "التوبة",
          chapter_number: 9,
          verses_range: "1–129",
          location: "Medinah",
          themes: ["Repentance", "Hypocrisy", "Jihad Ethics"],
          notes:
            "No Basmala; revealed after Tabuk; addresses hypocrisy and loyalty.",
        },
      ],
    },
    {
      id: "stage-14",
      name: "Conquest of Makkah",
      period: "Medinah → Makkah",
      timespan_ce: "630",
      description: "Peaceful entry and liberation of Makkah; idols destroyed.",
      items: [
        {
          type: "surah",
          revelation_order: 114,
          name_en: "An-Nasr",
          name_ar: "النصر",
          chapter_number: 110,
          verses_range: "1–3",
          location: "Makkah",
          themes: ["Victory", "Gratitude", "Completion"],
          notes:
            "Signals completion of the Prophet’s mission and nearing of his life’s end.",
        },
      ],
    },
    {
      id: "stage-15",
      name: "Farewell Pilgrimage and Final Sermon",
      period: "Medinah",
      timespan_ce: "632",
      description:
        "Prophet delivers Farewell Sermon during Hajj; seals message of Islam.",
      items: [
        {
          type: "surah",
          revelation_order: 115,
          name_en: "Al-Ma’idah",
          name_ar: "المائدة",
          chapter_number: 5,
          verses_range: "1–120",
          location: "Medinah",
          themes: ["Law", "Completion", "Faith"],
          notes:
            "Verse 5:3 revealed during Farewell Pilgrimage: 'Today I have perfected your religion for you...'",
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
