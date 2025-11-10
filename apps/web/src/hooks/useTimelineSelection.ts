import { useState, useCallback } from 'react';
import type { DetailedTimelineItem } from '../types';

export function useTimelineSelection() {
  const [selectedItem, setSelectedItem] = useState<DetailedTimelineItem | null>(null);

  const selectItem = useCallback((item: DetailedTimelineItem) => {
    setSelectedItem(item);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedItem(null);
  }, []);

  return {
    selectedItem,
    selectItem,
    clearSelection,
  };
}