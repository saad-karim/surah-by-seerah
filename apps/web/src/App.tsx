import React, { useState } from "react";
import Timeline from "./components/Timeline";
import { useTimelineData } from "./hooks/useTimelineData";

export default function App() {
  const { data, error, loading } = useTimelineData();
  const [themeFilter, setThemeFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  if (error)
    return (
      <div className="container">
        <h2>Failed to load</h2>
        <pre>{error}</pre>
      </div>
    );
  if (loading || !data)
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
        themeFilter={themeFilter}
        searchTerm={searchTerm}
      />
    </div>
  );
}
