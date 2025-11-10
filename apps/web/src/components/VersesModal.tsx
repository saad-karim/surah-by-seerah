import React from "react";

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

interface VersesModalState {
  surah: any;
  allVerses: Verse[];
  chapterInfo: {
    id: number;
    name: string;
    arabicName: string;
    totalVerses: number;
    revelationPlace: string;
  };
  loading: boolean;
  error: string | null;
  currentPage: number;
  versesPerPage: number;
}

interface VersesModalProps {
  versesModal: VersesModalState;
  getCurrentPageVerses: () => Verse[];
  getTotalPages: () => number;
  goToPage: (page: number) => void;
  onClose: () => void;
}

export default function VersesModal({
  versesModal,
  getCurrentPageVerses,
  getTotalPages,
  goToPage,
  onClose,
}: VersesModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="verses-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-content">
            <h2>
              {versesModal.chapterInfo.name} ({versesModal.chapterInfo.arabicName})
            </h2>
            <div className="modal-subtitle">
              {versesModal.chapterInfo.totalVerses} verses •{" "}
              {versesModal.chapterInfo.revelationPlace}
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
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
                    {verse.translations && verse.translations.length > 0 && (
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
  );
}