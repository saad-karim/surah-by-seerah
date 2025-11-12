import { useState, useEffect } from "react";
import type { DetailedTimelinePayload } from "../types";

export function useTimelineData() {
  const [data, setData] = useState<DetailedTimelinePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        setLoading(true);
        // Try enriched endpoint first, fallback to regular if it fails
        const response = await fetch("/api/timeline");

        if (!response.ok) {
          throw new Error("Enriched timeline failed");
        }

        const timelineData = await response.json();
        setData(timelineData);
      } catch (enrichedError) {
        console.warn(
          "Enriched timeline failed, falling back to regular timeline:",
          enrichedError,
        );
        setError(
          enrichedError instanceof Error
            ? enrichedError.message
            : "Failed to load timeline data",
        ); // Clear previous error before fallback
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineData();
  }, []);

  return { data, error, loading };
}

