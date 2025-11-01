import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { PAYLOAD } from "./data.js";
import { PAYLOAD as DETAILED_PAYLOAD } from "./data-detailed.js";
import { SurahEnrichmentService } from "./services/surahEnrichmentService.js";
import { QuranApiService } from "./services/quranApi.js";

// Load environment variables from .env file in project root
dotenv.config({ path: "../../.env" });

// Debug logging for environment variables
console.log("Environment variables loaded:");
console.log("QURAN_CLIENT_ID:", process.env.QURAN_CLIENT_ID);
console.log("QURAN_CLIENT_SECRET:", process.env.QURAN_CLIENT_SECRET);

const app = express();
app.use(cors());

const quranApiService = new QuranApiService({
  baseUrl: "https://apis-prelive.quran.foundation/content/api/v4",
  clientId: process.env.QURAN_CLIENT_ID || "",
  clientSecret: process.env.QURAN_CLIENT_SECRET || "",
});
const surahEnrichmentService = new SurahEnrichmentService(quranApiService);
// Preload chapter data on startup
surahEnrichmentService.preloadChapterData();

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

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT) || 4000;
app.listen(port, () =>
  console.log(`API listening on http://localhost:${port}`),
);
