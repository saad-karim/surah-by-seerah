import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { PAYLOAD } from "./data.js";
import { PAYLOAD as DETAILED_PAYLOAD } from "./data-detailed-minimal";
import { SurahEnrichmentService } from "./services/surahEnrichmentService.js";
import { createQuranService } from "./services/quranClient.js";

// Load environment variables from .env file in project root
dotenv.config({ path: "../../.env" });

// Debug logging for environment variables
console.log("Environment variables loaded:");
console.log("QURAN_CLIENT_ID:", process.env.QURAN_CLIENT_ID);
console.log("QURAN_CLIENT_SECRET:", process.env.QURAN_CLIENT_SECRET);

const app = express();
app.use(cors());

const quranService = createQuranService({
  clientId: process.env.QURAN_CLIENT_ID || "",
  clientSecret: process.env.QURAN_CLIENT_SECRET || "",
});
const surahEnrichmentService = new SurahEnrichmentService(quranService);
// Preload chapter data on startup
// surahEnrichmentService.preloadChapterData();

app.get("/api/timeline", (_req, res) => res.json(PAYLOAD));
app.get("/api/detailed-timeline", (_req, res) => res.json(DETAILED_PAYLOAD));

// New enriched endpoint that includes Quran Foundation API data
app.get("/api/detailed-timeline-enriched", async (_req, res) => {
  try {
    const enrichedPayload =
      await surahEnrichmentService.enrichTimelinePayload(DETAILED_PAYLOAD);
    res.json(enrichedPayload);
  } catch (error) {
    console.error("Error serving enriched timeline:", error);
    // Fallback to original data if enrichment fails
    res.json(DETAILED_PAYLOAD);
  }
});

// New endpoint to get chapter verses
app.get("/api/chapters/:chapterNumber/verses", async (req, res) => {
  try {
    const chapterNumber = parseInt(req.params.chapterNumber);
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 10;

    if (isNaN(chapterNumber) || chapterNumber < 1 || chapterNumber > 114) {
      return res.status(400).json({ error: "Invalid chapter number" });
    }

    const verses = await quranService.getChapterVerses(chapterNumber, { page, perPage });
    
    // Format the response to match what the frontend expects
    const formattedVerses = (verses || []).map((verse: any) => ({
      ...verse,
      textUthmani: verse.textUthmani || verse.textImlaeiSimple || (verse.words 
        ? verse.words
            .filter((word: any) => word.charTypeName === 'word')
            .map((word: any) => word.text || word.codeV1)
            .join(' ')
        : `Verse ${verse.verseNumber}`),
      translations: verse.translations || []
    }));

    const response = {
      verses: formattedVerses,
      pagination: {
        current_page: page,
        total_pages: Math.ceil((verses?.length || 0) / perPage) || 1,
        total_records: verses?.length || 0
      }
    };
    
    res.json(response);
  } catch (error) {
    console.error(`Error fetching verses for chapter ${req.params.chapterNumber}:`, error);
    res.status(500).json({ error: "Failed to fetch chapter verses" });
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT) || 4000;
app.listen(port, () =>
  console.log(`API listening on http://localhost:${port}`),
);
