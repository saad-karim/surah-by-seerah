import React, { useMemo, useState } from "react";
import type { DetailedTimelinePayload, DetailedTimelineItem, DetailedSurahItem, DetailedEventItem } from "../types";

interface TimelineProps {
  payload: DetailedTimelinePayload;
  periodFilter: string;
  themeFilter: string;
  searchTerm: string;
}

function TimelineCard({ item, index }: { item: DetailedTimelineItem; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  
  if (item.type === "surah") {
    return (
      <div 
        className="timeline-card surah-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="card-icon">📖</div>
        <div className="card-content">
          <h3 className="surah-name-en">{item.name_en}</h3>
          <p className="surah-name-ar">{item.name_ar}</p>
          <div className="card-meta">
            <span className="revelation-order">#{item.revelation_order}</span>
            <span className="chapter-number">Chapter {Array.isArray(item.chapter_number) ? item.chapter_number.join(', ') : item.chapter_number}</span>
          </div>
          {item.verses_range && <p className="verses-range">{item.verses_range}</p>}
          <div className="themes">
            {item.themes.slice(0, 2).map(theme => (
              <span key={theme} className="theme-tag">{theme}</span>
            ))}
          </div>
        </div>
        {isHovered && item.notes && (
          <div className="card-tooltip">
            {item.notes}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div 
        className="timeline-card event-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
          <div className="card-tooltip">
            {item.notes}
          </div>
        )}
      </div>
    );
  }
}

export default function Timeline({ payload, periodFilter, themeFilter, searchTerm }: TimelineProps) {
  const [selectedItem, setSelectedItem] = useState<DetailedTimelineItem | null>(null);

  // Filter and search logic
  const filteredStages = useMemo(() => {
    return payload.stages.map(stage => ({
      ...stage,
      items: stage.items.filter(item => {
        // Period filter
        if (periodFilter !== "All" && !stage.period.toLowerCase().includes(periodFilter.toLowerCase())) {
          return false;
        }
        
        // Theme filter
        if (themeFilter !== "All" && item.type === "surah") {
          const surahItem = item as DetailedSurahItem;
          if (!surahItem.themes.includes(themeFilter)) {
            return false;
          }
        }
        
        // Search filter
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          if (item.type === "surah") {
            const surahItem = item as DetailedSurahItem;
            return surahItem.name_en.toLowerCase().includes(term) ||
                   surahItem.name_ar.includes(term) ||
                   surahItem.themes.some(theme => theme.toLowerCase().includes(term));
          } else {
            const eventItem = item as DetailedEventItem;
            return eventItem.name.toLowerCase().includes(term) ||
                   eventItem.location.toLowerCase().includes(term);
          }
        }
        
        return true;
      })
    })).filter(stage => stage.items.length > 0);
  }, [payload, periodFilter, themeFilter, searchTerm]);

  return (
    <div className="horizontal-timeline">
      {/* Period Labels */}
      <div className="period-labels">
        <div className="period-section makkah-section">
          <h2>MAKKAH</h2>
          <p>Private Revelation & Early Preaching</p>
        </div>
        <div className="period-section madinah-section">
          <h2>MADINAH</h2>
          <p>Community Building & Legislation</p>
        </div>
      </div>

      {/* Timeline Line and Content */}
      <div className="timeline-content">
        <div className="timeline-line-horizontal"></div>
        
        {/* Stage Markers */}
        <div className="stages-container">
          {filteredStages.map((stage, stageIndex) => (
            <div key={stage.id} className="stage-section">
              <div className="stage-marker">
                <div className="stage-dot"></div>
                <div className="stage-info">
                  <h3>{stage.name}</h3>
                  <p>{stage.timespan_ce}</p>
                  <small>{stage.description}</small>
                </div>
              </div>
              
              {/* Items in this stage */}
              <div className="stage-items">
                {stage.items.map((item, itemIndex) => (
                  <div key={`${stage.id}-${itemIndex}`} className="timeline-item">
                    <div className="item-connector"></div>
                    <TimelineCard item={item} index={itemIndex} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Info Panel */}
      {selectedItem && (
        <div className="info-panel">
          <button className="close-btn" onClick={() => setSelectedItem(null)}>×</button>
          {selectedItem.type === "surah" ? (
            <div>
              <h2>{selectedItem.name_en}</h2>
              <h3>{selectedItem.name_ar}</h3>
              <div className="panel-details">
                <p><strong>Revelation Order:</strong> #{selectedItem.revelation_order}</p>
                <p><strong>Chapter:</strong> {Array.isArray(selectedItem.chapter_number) ? selectedItem.chapter_number.join(', ') : selectedItem.chapter_number}</p>
                <p><strong>Location:</strong> {selectedItem.location}</p>
                {selectedItem.verses_range && <p><strong>Verses:</strong> {selectedItem.verses_range}</p>}
                <div className="themes-panel">
                  <strong>Themes:</strong>
                  {selectedItem.themes.map(theme => (
                    <span key={theme} className="theme-tag-panel">{theme}</span>
                  ))}
                </div>
                {selectedItem.notes && <p className="notes">{selectedItem.notes}</p>}
              </div>
            </div>
          ) : (
            <div>
              <h2>{selectedItem.name}</h2>
              <div className="panel-details">
                <p><strong>Year:</strong> {selectedItem.year_ce} CE</p>
                <p><strong>Location:</strong> {selectedItem.location}</p>
                {selectedItem.linked_surahs.length > 0 && (
                  <p><strong>Related Surahs:</strong> {selectedItem.linked_surahs.join(', ')}</p>
                )}
                {selectedItem.notes && <p className="notes">{selectedItem.notes}</p>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}