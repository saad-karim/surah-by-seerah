import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { PAYLOAD } from "./data.js";
import { PAYLOAD as DETAILED_PAYLOAD } from "./data-detailed-backup.js";
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

// Get directory paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the React build
const staticPath = path.join(__dirname, "../../web/dist");
app.use(express.static(staticPath));

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
    console.error("Error serving enriched timeline:", error instanceof Error ? error.message : String(error));
    // Fallback to original data if enrichment fails
    res.json(DETAILED_PAYLOAD);
  }
});

// New endpoint to get ALL verses for a chapter at once
app.get("/api/chapters/:chapterNumber/verses/all", async (req, res) => {
  try {
    const chapterNumber = parseInt(req.params.chapterNumber);

    if (isNaN(chapterNumber) || chapterNumber < 1 || chapterNumber > 114) {
      return res.status(400).json({ error: "Invalid chapter number" });
    }

    // Get chapter info first
    const chapterInfo = await quranService.getChapterInfo(chapterNumber);
    const totalVerses = chapterInfo.versesCount;

    // Get ALL verses at once by setting perPage to total verses
    const verses = await quranService.getChapterVerses(chapterNumber, {
      page: 1,
      perPage: totalVerses,
    });

    // Helper function to clean HTML from translation text
    const cleanHtmlTags = (text: string): string => {
      return text
        .replace(/<sup[^>]*>.*?<\/sup>/g, "") // Remove footnote references
        .replace(/<[^>]*>/g, "") // Remove any remaining HTML tags
        .trim();
    };

    // Format the response to match what the frontend expects
    const formattedVerses = (verses || []).map((verse: any) => ({
      ...verse,
      textUthmani:
        verse.textUthmani ||
        verse.textImlaeiSimple ||
        (verse.words
          ? verse.words
              .filter((word: any) => word.charTypeName === "word")
              .map((word: any) => word.text || word.codeV1)
              .join(" ")
          : `Verse ${verse.verseNumber}`),
      translations: (verse.translations || []).map((translation: any) => ({
        ...translation,
        text: cleanHtmlTags(translation.text),
      })),
    }));

    const response = {
      verses: formattedVerses,
      chapterInfo: {
        id: chapterInfo.id,
        name: chapterInfo.nameSimple,
        arabicName: chapterInfo.nameArabic,
        totalVerses: totalVerses,
        revelationPlace: chapterInfo.revelationPlace,
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

// Legacy endpoint for paginated verses (keeping for backward compatibility)
app.get("/api/chapters/:chapterNumber/verses", async (req, res) => {
  try {
    const chapterNumber = parseInt(req.params.chapterNumber);
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 10;

    if (isNaN(chapterNumber) || chapterNumber < 1 || chapterNumber > 114) {
      return res.status(400).json({ error: "Invalid chapter number" });
    }

    // Get chapter info to know total verses count
    const chapterInfo = await quranService.getChapterInfo(chapterNumber);
    const totalVerses = chapterInfo.versesCount;
    const totalPages = Math.ceil(totalVerses / perPage);

    const verses = await quranService.getChapterVerses(chapterNumber, {
      page,
      perPage,
    });

    // Helper function to clean HTML from translation text
    const cleanHtmlTags = (text: string): string => {
      return text
        .replace(/<sup[^>]*>.*?<\/sup>/g, "") // Remove footnote references
        .replace(/<[^>]*>/g, "") // Remove any remaining HTML tags
        .trim();
    };

    // Format the response to match what the frontend expects
    const formattedVerses = (verses || []).map((verse: any) => ({
      ...verse,
      textUthmani:
        verse.textUthmani ||
        verse.textImlaeiSimple ||
        (verse.words
          ? verse.words
              .filter((word: any) => word.charTypeName === "word")
              .map((word: any) => word.text || word.codeV1)
              .join(" ")
          : `Verse ${verse.verseNumber}`),
      translations: (verse.translations || []).map((translation: any) => ({
        ...translation,
        text: cleanHtmlTags(translation.text),
      })),
    }));

    const response = {
      verses: formattedVerses,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_records: totalVerses,
        per_page: perPage,
      },
    };

    res.json(response);
  } catch (error) {
    console.error(
      `Error fetching verses for chapter ${req.params.chapterNumber}:`,
      error,
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
