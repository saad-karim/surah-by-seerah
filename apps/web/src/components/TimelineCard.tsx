import React, { useState } from "react";
import type { DetailedTimelineItem, DetailedSurahItem } from "../types";

interface TimelineCardProps {
  item: DetailedTimelineItem;
  index: number;
  onSurahClick?: (surah: DetailedSurahItem) => void;
  onItemClick?: (item: DetailedTimelineItem) => void;
}

export default function TimelineCard({ item, index, onSurahClick, onItemClick }: TimelineCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (item.type === "surah" && onSurahClick) {
      onSurahClick(item);
    } else if (onItemClick) {
      onItemClick(item);
    }
  };

  if (item.type === "surah") {
    return (
      <div
        className="timeline-card surah-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <div className="card-icon">📖</div>
        <div className="card-content">
          <h3 className="surah-name-en">{item.name_en}</h3>
          <p className="surah-name-ar">{item.name_ar}</p>
          <div className="card-meta">
            <span className="revelation-order">#{item.revelation_order}</span>
            <span className="chapter-number">
              Chapter{" "}
              {Array.isArray(item.chapter_number)
                ? item.chapter_number.join(", ")
                : item.chapter_number}
            </span>
          </div>
          {item.verses_range && (
            <p className="verses-range">{item.verses_range}</p>
          )}
          {(item as any).api_data?.verses_count && (
            <p className="verses-count">
              {(item as any).api_data.verses_count} verses
            </p>
          )}
          <div className="themes">
            {item.themes.slice(0, 2).map((theme) => (
              <span key={theme} className="theme-tag">
                {theme}
              </span>
            ))}
          </div>
        </div>
        {isHovered && item.notes && (
          <div className="card-tooltip">{item.notes}</div>
        )}
      </div>
    );
  } else {
    return (
      <div
        className="timeline-card event-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        style={{ cursor: onItemClick ? "pointer" : "default" }}
      >
        <div className="card-icon">⭐</div>
        <div className="card-content">
          <h3 className="event-name">{item.name}</h3>
          <div className="card-meta">
            <span className="event-year">{item.year_ce} CE</span>
          </div>
          <p className="event-location">{item.location}</p>
        </div>
        {isHovered && item.notes && (
          <div className="card-tooltip">{item.notes}</div>
        )}
      </div>
    );
  }
}