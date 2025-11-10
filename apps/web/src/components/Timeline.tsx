import React, { useMemo, useState } from "react";
import type {
  DetailedTimelinePayload,
  DetailedTimelineItem,
  DetailedSurahItem,
  DetailedEventItem,
} from "../types";

interface TimelineProps {
  payload: DetailedTimelinePayload;
  periodFilter: string;
  themeFilter: string;
  searchTerm: string;
}

interface Verse {
  id: number;
  verseNumber: number;
  verseKey: string;
  textUthmani?: string;
  translations?: Array<{
    text: string;
    resource_name: string;
  }>;
}

interface VersesResponse {
  verses: Verse[];
  chapterInfo: {
    id: number;
    name: string;
    arabicName: string;
    totalVerses: number;
    revelationPlace: string;
  };
}

function TimelineCard({
  item,
  index,
  onSurahClick,
}: {
  item: DetailedTimelineItem;
  index: number;
  onSurahClick?: (surah: DetailedSurahItem) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  if (item.type === "surah") {
    return (
      <div
        className="timeline-card surah-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onSurahClick?.(item)}
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

export default function Timeline({
  payload,
  periodFilter,
  themeFilter,
  searchTerm,
}: TimelineProps) {
  const [selectedItem, setSelectedItem] = useState<DetailedTimelineItem | null>(
    null,
  );
  const [versesModal, setVersesModal] = useState<{
    surah: DetailedSurahItem;
    allVerses: Verse[];
    chapterInfo: VersesResponse["chapterInfo"];
    loading: boolean;
    error: string | null;
    currentPage: number;
    versesPerPage: number;
  } | null>(null);

  const handleSurahClick = async (surah: DetailedSurahItem) => {
    const chapterNumber = Array.isArray(surah.chapter_number)
      ? surah.chapter_number[0]
      : surah.chapter_number;

    setVersesModal({
      surah,
      allVerses: [],
      chapterInfo: {
        id: chapterNumber,
        name: surah.name_en,
        arabicName: surah.name_ar,
        totalVerses: 0,
        revelationPlace: surah.location,
      },
      loading: true,
      error: null,
      currentPage: 1,
      versesPerPage: 10,
    });

    try {
      // Fetch ALL verses at once
      const response = await fetch(`/api/chapters/${chapterNumber}/verses/all`);
      if (!response.ok) {
        throw new Error(`Failed to fetch verses: ${response.statusText}`);
      }

      const data: VersesResponse = await response.json();

      setVersesModal((prev) =>
        prev
          ? {
              ...prev,
              allVerses: data.verses || [],
              chapterInfo: data.chapterInfo,
              loading: false,
            }
          : null,
      );
    } catch (error) {
      console.error("Failed to fetch verses:", error);
      setVersesModal((prev) =>
        prev
          ? {
              ...prev,
              loading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to load verses",
            }
          : null,
      );
    }
  };

  // Client-side pagination - no API calls needed
  const goToPage = (page: number) => {
    if (!versesModal) return;
    setVersesModal((prev) => (prev ? { ...prev, currentPage: page } : null));
  };

  // Compute current page verses from all verses
  const getCurrentPageVerses = () => {
    if (!versesModal || !versesModal.allVerses) return [];

    const startIndex =
      (versesModal.currentPage - 1) * versesModal.versesPerPage;
    const endIndex = startIndex + versesModal.versesPerPage;
    return versesModal.allVerses.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    if (!versesModal || !versesModal.allVerses) return 1;
    return Math.ceil(versesModal.allVerses.length / versesModal.versesPerPage);
  };

  // Clear modal data when closing
  const closeModal = () => {
    setVersesModal(null); // This clears all the preloaded verses from memory
  };

  // Organize all items chronologically with events and related surahs
  const timelineData = useMemo(() => {
    // Extract all events and surahs from all stages
    const allEvents: (DetailedEventItem & { stageId: string })[] = [];
    const allSurahs: (DetailedSurahItem & { stageId: string })[] = [];

    payload.stages.forEach((stage) => {
      stage.items.forEach((item) => {
        if (item.type === "event") {
          allEvents.push({ ...item, stageId: stage.id });
        } else {
          allSurahs.push({ ...item, stageId: stage.id });
        }
      });
    });

    // Sort events chronologically
    const sortedEvents = allEvents.sort((a, b) => a.year_ce - b.year_ce);

    // Group surahs by revelation order for chronological placement
    const sortedSurahs = allSurahs.sort(
      (a, b) => a.revelation_order - b.revelation_order,
    );

    // Create timeline sections with proper spacing
    const timelineSections: Array<{
      event?: DetailedEventItem & { stageId: string };
      surahs: (DetailedSurahItem & { stageId: string })[];
      year: number;
    }> = [];

    // Process events and assign related surahs
    sortedEvents.forEach((event, eventIndex) => {
      const eventYear = event.year_ce;
      const nextEventYear =
        sortedEvents[eventIndex + 1]?.year_ce || eventYear + 10;

      // Find surahs that should be grouped with this event
      // For now, we'll distribute surahs evenly between events based on revelation order
      const surahsPerEvent = Math.ceil(
        sortedSurahs.length / sortedEvents.length,
      );
      const startIndex = eventIndex * surahsPerEvent;
      const endIndex = Math.min(
        startIndex + surahsPerEvent,
        sortedSurahs.length,
      );
      const relatedSurahs = sortedSurahs.slice(startIndex, endIndex);

      timelineSections.push({
        event,
        surahs: relatedSurahs,
        year: eventYear,
      });
    });

    // Add remaining surahs if any
    const assignedSurahCount =
      sortedEvents.length *
      Math.ceil(sortedSurahs.length / sortedEvents.length);
    if (assignedSurahCount < sortedSurahs.length) {
      const remainingSurahs = sortedSurahs.slice(assignedSurahCount);
      if (remainingSurahs.length > 0) {
        timelineSections.push({
          surahs: remainingSurahs,
          year:
            (timelineSections[timelineSections.length - 1]?.year || 622) + 1,
        });
      }
    }

    return timelineSections;
  }, [payload]);

  // Apply filters
  const filteredTimelineData = useMemo(() => {
    return timelineData
      .map((section) => ({
        ...section,
        event:
          section.event &&
          (() => {
            // Period filter for events
            if (periodFilter !== "All") {
              const stage = payload.stages.find(
                (s) => s.id === section.event!.stageId,
              );
              if (
                stage &&
                !stage.period.toLowerCase().includes(periodFilter.toLowerCase())
              ) {
                return undefined;
              }
            }

            // Search filter for events
            if (searchTerm) {
              const term = searchTerm.toLowerCase();
              if (
                !section.event!.name.toLowerCase().includes(term) &&
                !section.event!.location.toLowerCase().includes(term)
              ) {
                return undefined;
              }
            }

            return section.event;
          })(),
        surahs: section.surahs.filter((surah) => {
          // Period filter for surahs
          if (periodFilter !== "All") {
            const stage = payload.stages.find((s) => s.id === surah.stageId);
            if (
              stage &&
              !stage.period.toLowerCase().includes(periodFilter.toLowerCase())
            ) {
              return false;
            }
          }

          // Theme filter for surahs
          if (themeFilter !== "All" && !surah.themes.includes(themeFilter)) {
            return false;
          }

          // Search filter for surahs
          if (searchTerm) {
            const term = searchTerm.toLowerCase();
            if (
              !surah.name_en.toLowerCase().includes(term) &&
              !surah.name_ar.includes(term) &&
              !surah.themes.some((theme) => theme.toLowerCase().includes(term))
            ) {
              return false;
            }
          }

          return true;
        }),
      }))
      .filter((section) => section.event || section.surahs.length > 0);
  }, [timelineData, periodFilter, themeFilter, searchTerm, payload.stages]);

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
                      onSurahClick={handleSurahClick}
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
                      onSurahClick={handleSurahClick}
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
        <div className="info-panel">
          <button className="close-btn" onClick={() => setSelectedItem(null)}>
            ×
          </button>
          {selectedItem.type === "surah" ? (
            <div>
              <h2>{selectedItem.name_en}</h2>
              <h3>{selectedItem.name_ar}</h3>
              <div className="panel-details">
                <p>
                  <strong>Revelation Order:</strong> #
                  {selectedItem.revelation_order}
                </p>
                <p>
                  <strong>Chapter:</strong>{" "}
                  {Array.isArray(selectedItem.chapter_number)
                    ? selectedItem.chapter_number.join(", ")
                    : selectedItem.chapter_number}
                </p>
                <p>
                  <strong>Location:</strong> {selectedItem.location}
                </p>
                {selectedItem.verses_range && (
                  <p>
                    <strong>Verses:</strong> {selectedItem.verses_range}
                  </p>
                )}
                {(selectedItem as any).api_data?.verses_count && (
                  <p>
                    <strong>Total Verses:</strong>{" "}
                    {(selectedItem as any).api_data.verses_count}
                  </p>
                )}
                {(selectedItem as any).api_data?.pages && (
                  <p>
                    <strong>Pages:</strong>{" "}
                    {(selectedItem as any).api_data.pages.join(", ")}
                  </p>
                )}
                {(selectedItem as any).api_data?.translated_name && (
                  <p>
                    <strong>Translation:</strong>{" "}
                    {(selectedItem as any).api_data.translated_name}
                  </p>
                )}
                <div className="themes-panel">
                  <strong>Themes:</strong>
                  {selectedItem.themes.map((theme) => (
                    <span key={theme} className="theme-tag-panel">
                      {theme}
                    </span>
                  ))}
                </div>
                {selectedItem.notes && (
                  <p className="notes">{selectedItem.notes}</p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h2>{selectedItem.name}</h2>
              <div className="panel-details">
                <p>
                  <strong>Year:</strong> {selectedItem.year_ce} CE
                </p>
                <p>
                  <strong>Location:</strong> {selectedItem.location}
                </p>
                {selectedItem.linked_surahs.length > 0 && (
                  <p>
                    <strong>Related Surahs:</strong>{" "}
                    {selectedItem.linked_surahs.join(", ")}
                  </p>
                )}
                {selectedItem.notes && (
                  <p className="notes">{selectedItem.notes}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Verses Modal */}
      {versesModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="verses-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-content">
                <h2>
                  {versesModal.chapterInfo.name} (
                  {versesModal.chapterInfo.arabicName})
                </h2>
                <div className="modal-subtitle">
                  {versesModal.chapterInfo.totalVerses} verses •{" "}
                  {versesModal.chapterInfo.revelationPlace}
                </div>
              </div>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="modal-content">
              {versesModal.loading && (
                <div className="loading">Loading verses...</div>
              )}

              {versesModal.error && (
                <div className="error">Error: {versesModal.error}</div>
              )}

              {!versesModal.loading && !versesModal.error && (
                <div className="verses-list">
                  {getCurrentPageVerses().map((verse) => (
                    <div key={verse.id} className="verse-item">
                      <div className="verse-number">{verse.verseNumber}</div>
                      <div className="verse-content">
                        <div className="verse-arabic">
                          {verse.textUthmani ||
                            `Verse ${verse.verseNumber} (${verse.verseKey})`}
                        </div>
                        {verse.translations &&
                          verse.translations.length > 0 && (
                            <div className="verse-translation">
                              {verse.translations[0].text}
                            </div>
                          )}
                      </div>
                    </div>
                  ))}

                  {getTotalPages() > 1 && (
                    <div className="pagination">
                      <div className="pagination-controls">
                        <button
                          className="pagination-btn"
                          onClick={() => goToPage(versesModal.currentPage - 1)}
                          disabled={versesModal.currentPage === 1}
                        >
                          Previous
                        </button>

                        <span className="pagination-info">
                          Page {versesModal.currentPage} of {getTotalPages()}
                          {/* <span className="verses-info"> */}
                          {/*   ({getCurrentPageVerses().length} of {versesModal.allVerses.length} verses) */}
                          {/* </span> */}
                        </span>

                        <button
                          className="pagination-btn"
                          onClick={() => goToPage(versesModal.currentPage + 1)}
                          disabled={versesModal.currentPage === getTotalPages()}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

