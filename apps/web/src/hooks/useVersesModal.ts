import { useState, useCallback } from 'react';
import type { DetailedSurahItem } from '../types';

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

interface VersesModalState {
  surah: DetailedSurahItem;
  allVerses: Verse[];
  chapterInfo: VersesResponse['chapterInfo'];
  loading: boolean;
  error: string | null;
  currentPage: number;
  versesPerPage: number;
}

export function useVersesModal() {
  const [versesModal, setVersesModal] = useState<VersesModalState | null>(null);

  const openVersesModal = useCallback(async (surah: DetailedSurahItem) => {
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
  }, []);

  const closeVersesModal = useCallback(() => {
    setVersesModal(null); // This clears all the preloaded verses from memory
  }, []);

  const goToPage = useCallback((page: number) => {
    setVersesModal((prev) => (prev ? { ...prev, currentPage: page } : null));
  }, []);

  // Compute current page verses from all verses
  const getCurrentPageVerses = useCallback(() => {
    if (!versesModal || !versesModal.allVerses) return [];

    const startIndex = (versesModal.currentPage - 1) * versesModal.versesPerPage;
    const endIndex = startIndex + versesModal.versesPerPage;
    return versesModal.allVerses.slice(startIndex, endIndex);
  }, [versesModal]);

  const getTotalPages = useCallback(() => {
    if (!versesModal || !versesModal.allVerses) return 1;
    return Math.ceil(versesModal.allVerses.length / versesModal.versesPerPage);
  }, [versesModal]);

  return {
    versesModal,
    openVersesModal,
    closeVersesModal,
    goToPage,
    getCurrentPageVerses,
    getTotalPages,
  };
}