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
        {
          type: "surah",
          revelation_order: 2,
          name_en: "Al-Qalam",
          name_ar: "القلم",
          chapter_number: 68,
          location: "Makkah",
          themes: ["Character", "Patience", "Consolation"],
          notes:
            "Begins with the oath by the pen, affirming the Prophet’s noble character and rejecting accusations of madness. It comforts him against mockery, warns the arrogant rejectors, and presents the parable of the people of the garden who lost their harvest due to greed, teaching moral responsibility and patience in the face of hostility.",
        },
        {
          type: "surah",
          revelation_order: 3,
          name_en: "Al-Muzzammil",
          name_ar: "المزمل",
          chapter_number: 73,
          location: "Makkah",
          themes: ["Night Prayer", "Discipline", "Preparation"],
          notes:
            "Addresses the Prophet ﷺ lovingly as 'the one wrapped up in garments' and commands him to stand in night prayer, reciting the Qur’an calmly and reflectively. It frames qiyam al-layl as spiritual training to bear the weight of revelation, urging patience with the hurtful words of opponents and reliance on Allah’s support.",
        },
        {
          type: "surah",
          revelation_order: 4,
          name_en: "Al-Muddaththir",
          name_ar: "المدثر",
          chapter_number: 74,
          location: "Makkah",
          themes: ["Warning", "Purification", "Patience"],
          notes:
            "Calls the Prophet ﷺ, 'O you who is wrapped up,' and commands him to arise and warn, magnify his Lord, purify himself, and avoid all forms of idols and ostentation. It marks the transition from private preparation to active public da‘wah, describing the seriousness of the message and the reality of Hell for those who reject the truth knowingly.",
        },
        {
          type: "surah",
          revelation_order: 5,
          name_en: "Al-Fatihah",
          name_ar: "الفاتحة",
          chapter_number: 1,
          location: "Makkah",
          themes: ["Guidance", "Supplication", "Mercy"],
          notes:
            "Known as the Opening and the Mother of the Book, it is the essential prayer recited in every unit of salah. It praises Allah as Lord of the worlds, Most Merciful, Master of the Day of Judgment, and teaches believers to seek only His help and guidance upon the straight path, away from the paths of those who earned anger or went astray.",
        },
        {
          type: "event",
          name: "First Revelation",
          year_ce: 610,
          location: "Cave of Hira, Jabal al-Nour",
          linked_surahs: [96],
          notes:
            "In the month of Ramadan, while meditating in the Cave of Hira, the Prophet ﷺ received the first revelation through Angel Jibril. The angel commanded, 'Iqra' – Read/Recite, initiating the Prophetic mission. Overwhelmed, the Prophet returned to Khadijah (RA), who comforted him and sought counsel from her cousin Waraqah ibn Nawfal, affirming his Prophethood. This event marks the birth of revelation and the beginning of Islam’s message to humanity.",
        },
      ],
    },
    {
      id: "stage-2",
      name: "Early Public Call",
      period: "Makkah",
      timespan_ce: "613–616",
      description: "Beginning of open preaching; emphasis on faith and morals.",
      items: [
        {
          type: "surah",
          revelation_order: 6,
          name_en: "Al-Lahab",
          name_ar: "المسد",
          chapter_number: 111,
          location: "Makkah",
          themes: ["Opposition", "Accountability"],
          notes:
            "Revealed about Abu Lahab and his wife, who led fierce opposition to the Prophet ﷺ. It foretells their ruin and the punishment awaiting them, demonstrating that lineage and status cannot save one from Allah’s justice. The surah also serves as a sign of the truth of the Prophet’s message, as Abu Lahab never embraced Islam despite having decades to refute this prophecy.",
        },
        {
          type: "surah",
          revelation_order: 7,
          name_en: "At-Takwir",
          name_ar: "التكوير",
          chapter_number: 81,
          location: "Makkah",
          themes: ["Judgment Day", "Cosmic Signs"],
          notes:
            "Depicts the dramatic unraveling of the cosmos on the Day of Judgment: the sun wrapped up, stars falling, mountains set in motion, and buried girls being questioned. It emphasizes personal accountability and confirms that the Qur’an is a revelation conveyed by a noble, trustworthy angel, refuting claims that the Prophet ﷺ is a soothsayer or madman.",
        },
        {
          type: "surah",
          revelation_order: 8,
          name_en: "Al-A‘la",
          name_ar: "الأعلى",
          chapter_number: 87,
          location: "Makkah",
          themes: ["Remembrance", "Purification", "Divine Order"],
          notes:
            "Opens with the command to glorify the name of the Most High, who creates, proportionates, and guides. It encourages purification of the soul and prioritizing the Hereafter over the fleeting pleasures of this world. Widely recited in Jumu‘ah and Eid prayers, it reinforces the rhythm of remembrance and trust in Allah’s wisdom and decree.",
        },
        {
          type: "surah",
          revelation_order: 9,
          name_en: "Al-Layl",
          name_ar: "الليل",
          chapter_number: 92,
          location: "Makkah",
          themes: ["Generosity vs. Miserliness", "Moral Choice"],
          notes:
            "Contrasts two types of people: those who give, are mindful of Allah, and affirm goodness versus those who are miserly, self-sufficient, and deny the truth. Each person is shown a path made easy according to their chosen direction. The surah teaches that spending in Allah’s way and fearing Him leads to ease, while greed and denial lead to hardship and loss.",
        },
        {
          type: "surah",
          revelation_order: 10,
          name_en: "Ad-Duhaa & Ash-Sharh",
          name_ar: "الضحى • الشرح",
          chapter_number: [93, 94],
          location: "Makkah",
          themes: ["Consolation", "Hope", "Divine Care"],
          notes:
            "Revealed after a pause in revelation that caused the Prophet ﷺ deep concern, Surah Ad-Duhaa assures him that his Lord has neither forsaken nor hated him and that his future will be better than his past. Surah Ash-Sharh complements it by reminding him of how Allah expanded his chest, removed his burden, and elevated his mention. Together, they console him amidst early rejection and command him to channel gratitude into continued effort and remembrance.",
        },
        {
          type: "event",
          name: "Public Call Begins",
          year_ce: 613,
          location: "Makkah",
          linked_surahs: [74],
          notes:
            "Following the command in Surah Al-Muddaththir, the Prophet ﷺ ascended Mount Safa and called his people publicly to worship Allah alone. This marked the shift from a private to a public mission. Quraysh leaders reacted with mockery and hostility, including his uncle Abu Lahab. Despite this, early converts such as Abu Bakr, Bilal, and Ali spread the message quietly and courageously under persecution.",
        },
      ],
    },
    {
      id: "stage-3",
      name: "Opposition & Perseverance",
      period: "Makkah",
      timespan_ce: "616–620",
      description: "Persecution intensifies; revelation strengthens resolve.",
      items: [
        {
          type: "surah",
          revelation_order: 11,
          name_en: "Al-An‘am",
          name_ar: "الأنعام",
          chapter_number: 6,
          location: "Makkah",
          themes: ["Monotheism", "Signs of God", "Refutation of Idolatry"],
          notes:
            "A long Makkan surah that strongly affirms tawhid and dismantles the superstitious practices of idolaters, including their invented taboos around animals and crops. It calls people to reflect on the signs in creation, exposes the futility of setting up partners with Allah, and highlights the legacy of Ibrahim as a pure monotheist. Often cited as having been revealed in one continuous portion, it provided a powerful theological foundation during intense opposition.",
        },
        {
          type: "surah",
          revelation_order: 12,
          name_en: "Al-Kahf",
          name_ar: "الكهف",
          chapter_number: 18,
          location: "Makkah",
          themes: ["Trials of Faith", "Patience", "Reliance on God"],
          notes:
            "Addresses several narratives: the People of the Cave who fled persecution for their faith, the owner of two gardens tested by wealth, Musa’s journey with the wise servant, and Dhul-Qarnayn’s just leadership. Each story illustrates a different trial—faith, wealth, knowledge, and power—and how reliance on Allah and humility lead to success. The surah also answered questions posed to Quraysh by Jewish scholars, reinforcing the divine origin of the Qur’an.",
        },
        {
          type: "surah",
          revelation_order: 13,
          name_en: "Maryam",
          name_ar: "مريم",
          chapter_number: 19,
          location: "Makkah",
          themes: ["Prophetic Stories", "Mercy", "Resurrection"],
          notes:
            "Beautifully narrates the stories of Zakariyya, Maryam, Yahya, and ‘Isa, emphasizing Allah’s mercy and power to give life in seemingly impossible circumstances. It affirms the human servitude of ‘Isa while refuting exaggerated claims about him, and then transitions to mention other prophets. The emotional tone comforts the early Muslims and strengthens their conviction in resurrection and divine mercy in the midst of hardship.",
        },
        {
          type: "surah",
          revelation_order: 14,
          name_en: "Ta-Ha",
          name_ar: "طه",
          chapter_number: 20,
          location: "Makkah",
          themes: ["Story of Musa", "Consolation", "Steadfastness"],
          notes:
            "Begins by stating that the Qur’an was not sent to cause distress but as a reminder. It then relates the story of Musa at length—from his calling at the burning bush to his confrontation with Pharaoh—which closely parallels the Prophet’s own mission against a powerful, stubborn elite. The surah comforts the Prophet ﷺ, urging him to be patient and steadfast. Parts of this surah famously played a role in the conversion of ‘Umar ibn al-Khattab (RA).",
        },
        {
          type: "event",
          name: "Social & Economic Boycott",
          year_ce: 616,
          location: "Makkah",
          linked_surahs: [6, 18, 19, 20],
          notes:
            "In retaliation for the growing number of Muslims, Quraysh imposed a harsh boycott against Banu Hashim and Banu al-Muttalib—tribes protecting the Prophet ﷺ. Muslims were confined in Shi‘b Abi Talib for about three years, suffering severe deprivation. During this time, revelations like Surah Maryam and Surah Ta-Ha offered spiritual nourishment, recounting prophets who endured trials with faith. The boycott ended when sympathetic Meccans, moved by injustice, intervened to annul the pact.",
        },
      ],
    },
    {
      id: "stage-4",
      name: "Hope and Transition",
      period: "Late Makkah → Pre-Hijrah",
      timespan_ce: "620–622",
      description: "Renewed hope; preparation for migration to Madinah.",
      items: [
        {
          type: "surah",
          revelation_order: 15,
          name_en: "Al-Isra’ (Bani Isra’il)",
          name_ar: "الإسراء",
          chapter_number: 17,
          location: "Makkah",
          themes: ["Night Journey", "Ethics", "Discipline"],
          notes:
            "Opens with mention of the Night Journey from al-Masjid al-Haram to al-Masjid al-Aqsa, honoring the Prophet ﷺ and linking his mission to that of earlier prophets. Often called Bani Isra’il, it critiques the behavior of the Children of Israel while laying out a clear moral code: kindness to parents, fulfilling promises, justice in trade, humility, and avoidance of arrogance. It emphasizes that the Qur’an is a healing and mercy for believers and a source of loss only to the unjust.",
        },
        {
          type: "surah",
          revelation_order: 16,
          name_en: "Ya-Sin",
          name_ar: "يس",
          chapter_number: 36,
          location: "Makkah",
          themes: ["Warning & Mercy", "Centrality of the Qur’an"],
          notes:
            "Frequently referred to as the 'heart of the Qur’an' in later tradition, it re-centers the message around the Qur’an itself and the prophethood of Muhammad ﷺ. It recounts the story of a town that rejected messengers except for a believing man who supported them, highlighting courage in faith. Through vivid imagery of life, death, and resurrection, the surah appeals to the hearts of the Meccans, showing the signs of Allah in nature and human life while warning those who persist in denial.",
        },
        {
          type: "surah",
          revelation_order: 17,
          name_en: "Az-Zumar",
          name_ar: "الزمر",
          chapter_number: 39,
          location: "Makkah",
          themes: ["Sincerity", "Tawhid", "Resurrection"],
          notes:
            "Centers on the idea of worship done purely and sincerely for Allah alone, condemning associating partners with Him. It contrasts the fate of those who submit wholeheartedly with those divided between many false gods. The famous verse calling despairing sinners not to lose hope in Allah’s mercy appears here, offering deep comfort to believers. The surah closes with a powerful description of the final gathering: people entering Hell in crowds and the righteous being welcomed into Paradise in honor.",
        },
        {
          type: "event",
          name: "Isra’ and Mi‘raj (Night Journey & Ascension)",
          year_ce: 620,
          location: "From Makkah to Jerusalem; then Heavens",
          linked_surahs: [17],
          notes:
            "During one of the most challenging periods in his life—the 'Year of Sorrow' after the deaths of Khadijah (RA) and Abu Talib—the Prophet ﷺ was honored with a miraculous night journey. He traveled from Makkah to Jerusalem (Al-Isra’) and then ascended through the heavens (Al-Mi‘raj), meeting earlier prophets and witnessing divine signs. It was during this ascension that the five daily prayers were prescribed, serving as a direct link between Allah and believers. The event brought solace and reaffirmed his divine mission.",
        },
        {
          type: "event",
          name: "Hijrah (Migration to Madinah)",
          year_ce: 622,
          location: "Makkah → Madinah",
          linked_surahs: [],
          notes:
            "Facing continuous persecution, the Prophet ﷺ instructed his followers to migrate to Yathrib (later named Madinah). After the second Pledge of Aqabah, where the Ansar pledged to protect him, the Prophet and Abu Bakr set out secretly. They hid in the Cave of Thawr for three nights before continuing north. The Hijrah marks the turning point in Islamic history—the beginning of the Islamic calendar and the transformation of Islam from a persecuted movement into a community-state founded on faith, brotherhood, and justice.",
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
