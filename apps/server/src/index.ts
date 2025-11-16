import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { PAYLOAD } from "./data.js";
import { SurahEnrichmentService } from "./services/surahEnrichmentService.js";
import { createQuranService } from "./services/quranClient.js";

// Get directory paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from project root
const envPath = path.join(__dirname, "../../../.env");
dotenv.config({ path: envPath });

const app = express();
app.use(cors());

// Serve static files from the React build
const staticPath = path.join(__dirname, "../../web/dist");

app.use(express.static(staticPath));

const quranService = createQuranService({
  clientId: process.env.QURAN_CLIENT_ID || "",
  clientSecret: process.env.QURAN_CLIENT_SECRET || "",
});
const surahEnrichmentService = new SurahEnrichmentService(quranService);

// New enriched endpoint that includes Quran Foundation API data
app.get("/api/timeline", async (_req, res) => {
  res.json(PAYLOAD);
});

// New endpoint to get ALL verses for a chapter at once
app.get("/api/chapters/:chapterNumber/verses", async (req, res) => {
  try {
    const chapterNumber = parseInt(req.params.chapterNumber);

    if (isNaN(chapterNumber) || chapterNumber < 1 || chapterNumber > 114) {
      return res.status(400).json({ error: "Invalid chapter number" });
    }

    // Get chapter info first
    const chapterInfo = await quranService.getChapterInfo(chapterNumber);
    const totalVerses =
      chapterInfo.versesCount || chapterInfo.verses_count || 50; // fallback to 50 if not available

    // Get ALL verses at once by setting perPage to total verses
    const verses = await quranService.getChapterVerses(chapterNumber, {
      page: 1,
      perPage: totalVerses,
    });

    // Fetch translations for all verses in the chapter
    const translations = await quranService.getChapterTranslations(
      chapterNumber,
      20, // Saheedh International
    );

    // Map verses with translations by array index
    const formattedVerses = (verses || []).map((verse: any, index: number) => {
      const verseKey = verse.verse_key;
      const translation = translations[index]; // Map by array index

      // Prepare translations array for this verse
      let verseTranslations: Array<{ text: string; resource_name: string }> =
        [];

      if (translation && translation.text) {
        verseTranslations = [
          {
            text: translation.text,
            resource_name: "Dr. Mustafa Khattab, the Clear Quran",
          },
        ];
      }

      return {
        id: verse.id,
        verseNumber: verse.verse_number || verse.verseNumber,
        verseKey: verseKey,
        textUthmani:
          verse.text_uthmani ||
          verse.textUthmani ||
          verse.text_imlaei_simple ||
          verse.textImlaeiSimple ||
          (verse.words
            ? verse.words
                .filter(
                  (word: any) =>
                    word.char_type_name === "word" ||
                    word.charTypeName === "word",
                )
                .map(
                  (word: any) => word.text_uthmani || word.text || word.codeV1,
                )
                .join(" ")
            : `Verse ${verse.verse_number || verse.verseNumber || "Unknown"}`),
        translations: verseTranslations,
      };
    });

    const response = {
      verses: formattedVerses,
      chapterInfo: {
        id: chapterInfo.id,
        name:
          chapterInfo.nameSimple || chapterInfo.name_simple || chapterInfo.name,
        arabicName:
          chapterInfo.nameArabic ||
          chapterInfo.name_arabic ||
          chapterInfo.arabic_name,
        totalVerses: formattedVerses.length || totalVerses,
        revelationPlace:
          chapterInfo.revelationPlace || chapterInfo.revelation_place,
      },
    };

    res.json(response);
  } catch (error) {
    console.error(
      `Error fetching all verses for chapter ${req.params.chapterNumber}:`,
      error instanceof Error ? error.message : String(error),
    );
    res.status(500).json({ error: "Failed to fetch chapter verses" });
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Catch-all handler: send back React's index.html file for any non-API routes
app.get("*", (_req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`),
);
