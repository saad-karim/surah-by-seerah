import { useState, useEffect } from 'react';
import type { DetailedTimelinePayload } from '../types';

export function useTimelineData() {
  const [data, setData] = useState<DetailedTimelinePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        setLoading(true);
        // Try enriched endpoint first, fallback to regular if it fails
        const response = await fetch("/api/detailed-timeline-enriched");
        
        if (!response.ok) {
          throw new Error("Enriched timeline failed");
        }
        
        const timelineData = await response.json();
        setData(timelineData);
      } catch (enrichedError) {
        console.warn("Enriched timeline failed, falling back to regular timeline:", enrichedError);
        
        try {
          // Fallback to regular endpoint
          const response = await fetch("/api/detailed-timeline");
          if (!response.ok) {
            throw new Error(`Failed to fetch timeline: ${response.statusText}`);
          }
          
          const timelineData = await response.json();
          setData(timelineData);
        } catch (fallbackError) {
          setError(fallbackError instanceof Error ? fallbackError.message : 'Failed to load timeline data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineData();
  }, []);

  return { data, error, loading };
}