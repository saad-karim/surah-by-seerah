import React from "react";
import type { DetailedTimelineItem } from "../types";

interface InfoPanelProps {
  selectedItem: DetailedTimelineItem;
  onClose: () => void;
}

export default function InfoPanel({ selectedItem, onClose }: InfoPanelProps) {
  return (
    <div className="info-panel">
      <button className="close-btn" onClick={onClose}>
        ×
      </button>
      {selectedItem.type === "surah" ? (
        <div>
          <h2>{selectedItem.name_en}</h2>
          <h3>{selectedItem.name_ar}</h3>
          <div className="panel-details">
            <p>
              <strong>Revelation Order:</strong> #{selectedItem.revelation_order}
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
  );
}