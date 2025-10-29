import React, { useEffect, useState } from "react";
import Timeline from "./components/Timeline";
import type { TimelinePayload } from "./types";

export default function App() {
  const [data, setData] = useState<TimelinePayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/timeline")
      .then((r) => r.json())
      .then(setData)
      .catch((e) => setError(String(e)));
  }, []);

  if (error)
    return (
      <div className="container">
        <h2>Failed to load</h2>
        <pre>{error}</pre>
      </div>
    );
  if (!data)
    return (
      <div className="container">
        <p>Loading…</p>
      </div>
    );

  return (
    <div className="container">
      <header className="header">
        <h1>Qur'an Context Timeline</h1>
        <p className="sub">
          Meccan → Medinan periods, sīrah events, and revelation pins.
        </p>
      </header>
      <Timeline payload={data} />
    </div>
  );
}
