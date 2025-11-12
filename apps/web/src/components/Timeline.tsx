import React from "react";
import type { DetailedTimelinePayload } from "../types";
import { useTimelineFiltering } from "../hooks/useTimelineFiltering";
import { useTimelineSelection } from "../hooks/useTimelineSelection";
import { useVersesModal } from "../hooks/useVersesModal";
import TimelineCard from "./TimelineCard";
import VersesModal from "./VersesModal";
import InfoPanel from "./InfoPanel";

interface TimelineProps {
  payload: DetailedTimelinePayload;
  themeFilter: string;
  searchTerm: string;
}

export default function Timeline({
  payload,
  themeFilter,
  searchTerm,
}: TimelineProps) {
  const { selectedItem, selectItem, clearSelection } = useTimelineSelection();
  const {
    versesModal,
    openVersesModal,
    closeVersesModal,
    goToPage,
    getCurrentPageVerses,
    getTotalPages,
  } = useVersesModal();

  const filteredTimelineData = useTimelineFiltering(
    payload,
    "All", // Always show all periods
    themeFilter,
    searchTerm,
  );

  return (
    <div className="vertical-timeline">
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
        <div className="timeline-line-vertical"></div>

        {/* Timeline Sections */}
        <div className="timeline-sections">
          {filteredTimelineData.map((section, sectionIndex) => (
            <div key={sectionIndex} className="timeline-section">
              {/* Event on the left */}
              <div className="events-column">
                {section.event && (
                  <div className="timeline-item event-item">
                    <div className="item-connector left-connector"></div>
                    <TimelineCard
                      item={section.event}
                      index={sectionIndex}
                      onSurahClick={openVersesModal}
                      onItemClick={selectItem}
                    />
                  </div>
                )}
              </div>

              {/* Timeline marker */}
              <div className="timeline-marker">
                <div className="timeline-dot"></div>
                <div className="year-label">{section.year} CE</div>
              </div>

              {/* Surahs on the right */}
              <div className="surahs-column">
                {section.surahs.map((surah, surahIndex) => (
                  <div
                    key={`${sectionIndex}-${surahIndex}`}
                    className="timeline-item surah-item"
                  >
                    <div className="item-connector right-connector"></div>
                    <TimelineCard
                      item={surah}
                      index={surahIndex}
                      onSurahClick={openVersesModal}
                      onItemClick={selectItem}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Info Panel */}
      {selectedItem && (
        <InfoPanel selectedItem={selectedItem} onClose={clearSelection} />
      )}

      {/* Verses Modal */}
      {versesModal && (
        <VersesModal
          versesModal={versesModal}
          getCurrentPageVerses={getCurrentPageVerses}
          getTotalPages={getTotalPages}
          goToPage={goToPage}
          onClose={closeVersesModal}
        />
      )}
    </div>
  );
}

