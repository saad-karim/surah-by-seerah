import React, { useEffect, useState } from "react";
import Timeline from "./components/Timeline";
import type { DetailedTimelinePayload } from "./types";

export default function App() {
  const [data, setData] = useState<DetailedTimelinePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [periodFilter, setPeriodFilter] = useState<string>("All");
  const [themeFilter, setThemeFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetch("/api/detailed-timeline")
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
    <div className="revelation-journey">
      <header className="journey-header">
        <h1>THE REVELATION JOURNEY</h1>
        <p className="journey-subtitle">
          Explore the Qur'an as it was revealed — alongside the life of the Prophet ﷺ
        </p>
        
        <div className="controls">
          <div className="filters">
            <select 
              value={periodFilter} 
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">Period: All</option>
              <option value="Makkah">Makkah</option>
              <option value="Madinah">Madinah</option>
            </select>
            
            <select 
              value={themeFilter} 
              onChange={(e) => setThemeFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">Theme: All</option>
              <option value="Faith">Faith</option>
              <option value="Guidance">Guidance</option>
              <option value="Warning">Warning</option>
              <option value="Patience">Patience</option>
            </select>
          </div>
          
          <div className="search-box">
            <input
              type="text"
              placeholder="Find Surah or Event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </header>
      
      <Timeline 
        payload={data} 
        periodFilter={periodFilter}
        themeFilter={themeFilter}
        searchTerm={searchTerm}
      />
    </div>
  );
}
