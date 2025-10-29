import express from "express";
import cors from "cors";
import { PAYLOAD } from "./data";

const app = express();
app.use(cors());
app.get("/api/timeline", (_req, res) => res.json(PAYLOAD));
app.get("/api/health", (_req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT) || 4000;
app.listen(port, () =>
  console.log(`API listening on http://localhost:${port}`),
);
