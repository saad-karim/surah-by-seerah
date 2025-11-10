import { useMemo } from 'react';
import type { DetailedTimelinePayload, DetailedSurahItem, DetailedEventItem } from '../types';

interface TimelineSection {
  event?: DetailedEventItem & { stageId: string };
  surahs: (DetailedSurahItem & { stageId: string })[];
  year: number;
}

export function useTimelineFiltering(
  payload: DetailedTimelinePayload | null,
  periodFilter: string,
  themeFilter: string,
  searchTerm: string
) {
  // Organize all items chronologically with events and related surahs
  const timelineData = useMemo(() => {
    if (!payload) return [];

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
    const timelineSections: TimelineSection[] = [];

    // Process events and assign related surahs
    sortedEvents.forEach((event, eventIndex) => {
      const eventYear = event.year_ce;

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
    if (!payload) return [];

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
  }, [timelineData, periodFilter, themeFilter, searchTerm, payload]);

  return filteredTimelineData;
}