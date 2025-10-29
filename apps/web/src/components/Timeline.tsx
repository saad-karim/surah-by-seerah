import React, { useMemo, useState } from "react";
import type { TimelinePayload, SirahEvent, Revelation } from "../types";

function yearToPosition(yearAH: number, minAH: number, maxAH: number, totalHeight: number) {
  const range = maxAH - minAH;
  return ((yearAH - minAH) / range) * totalHeight;
}

function Marker({
  top,
  color,
  label,
  onClick,
  side,
}: {
  top: number;
  color: string;
  label: string;
  onClick?: () => void;
  side: "left" | "right";
}) {
  return (
    <div className={`marker marker-${side}`} style={{ top: `${top}px` }} onClick={onClick}>
      <div className="dot" style={{ background: color }} />
      <div className="label">{label}</div>
    </div>
  );
}

export default function Timeline({ payload }: { payload: TimelinePayload }) {
  const [selected, setSelected] = useState<{
    type: "event" | "revelation";
    item: SirahEvent | Revelation;
  } | null>(null);

  const minAH = useMemo(
    () =>
      Math.min(
        payload.meccan.startAH,
        ...payload.events.map((e) => e.yearAH),
        ...payload.revelations.map((r) => r.approxYearAH),
      ),
    [payload],
  );
  const maxAH = useMemo(
    () =>
      Math.max(
        payload.medinan.endAH,
        ...payload.events.map((e) => e.yearAH),
        ...payload.revelations.map((r) => r.approxYearAH),
      ),
    [payload],
  );

  // Calculate spacing to avoid overlaps
  const markerSpacing = 60; // Minimum space between markers
  const timelineHeight = (maxAH - minAH + 1) * markerSpacing;

  // Sort all items by year for proper positioning
  const allItems = [
    ...payload.events.map(e => ({ ...e, type: "event" as const })),
    ...payload.revelations.map(r => ({ ...r, type: "revelation" as const }))
  ].sort((a, b) => {
    const yearA = a.type === "event" ? a.yearAH : a.approxYearAH;
    const yearB = b.type === "event" ? b.yearAH : b.approxYearAH;
    return yearA - yearB;
  });

  // Position items to avoid overlaps - events on left, revelations on right
  const positionedItems = useMemo(() => {
    const positioned: Array<{ item: any; position: number; side: "left" | "right" }> = [];
    let lastLeftPosition = 0;
    let lastRightPosition = 0;

    allItems.forEach((item) => {
      const year = item.type === "event" ? item.yearAH : item.approxYearAH;
      const basePosition = yearToPosition(year, minAH, maxAH, timelineHeight);
      
      // Events go on left, revelations go on right
      const side = item.type === "event" ? "left" : "right";
      
      let finalPosition = basePosition;
      const lastPosition = side === "left" ? lastLeftPosition : lastRightPosition;
      
      if (finalPosition - lastPosition < markerSpacing) {
        finalPosition = lastPosition + markerSpacing;
      }
      
      if (side === "left") {
        lastLeftPosition = finalPosition;
      } else {
        lastRightPosition = finalPosition;
      }
      
      positioned.push({ item, position: finalPosition, side });
    });

    return positioned;
  }, [allItems, minAH, maxAH, timelineHeight]);

  const finalHeight = Math.max(timelineHeight, Math.max(...positionedItems.map(p => p.position)) + 100);

  return (
    <div className="vertical-timeline-container">
      <div className="timeline-header">
        <h2>Timeline of Events and Revelations</h2>
      </div>
      
      <div className="vertical-timeline" style={{ height: `${finalHeight}px` }}>
        {/* Vertical timeline line */}
        <div className="timeline-line" />
        
        {/* Period bands */}
        <div
          className="period-band meccan-band"
          style={{
            top: `${yearToPosition(payload.meccan.startAH, minAH, maxAH, timelineHeight)}px`,
            height: `${yearToPosition(payload.meccan.endAH, minAH, maxAH, timelineHeight) - yearToPosition(payload.meccan.startAH, minAH, maxAH, timelineHeight)}px`,
          }}
        >
          <span className="period-label">Meccan Period</span>
        </div>
        <div
          className="period-band medinan-band"
          style={{
            top: `${yearToPosition(payload.medinan.startAH, minAH, maxAH, timelineHeight)}px`,
            height: `${yearToPosition(payload.medinan.endAH, minAH, maxAH, timelineHeight) - yearToPosition(payload.medinan.startAH, minAH, maxAH, timelineHeight)}px`,
          }}
        >
          <span className="period-label">Medinan Period</span>
        </div>

        {/* Year markers */}
        {Array.from({ length: maxAH - minAH + 1 }, (_, i) => {
          const year = minAH + i;
          return (
            <div
              key={year}
              className="year-marker"
              style={{ top: `${yearToPosition(year, minAH, maxAH, timelineHeight)}px` }}
            >
              {year} AH
            </div>
          );
        })}

        {/* Event and Revelation markers */}
        {positionedItems.map(({ item, position, side }, index) => (
          <Marker
            key={`${item.type}-${item.type === "event" ? item.id : item.surahId}-${index}`}
            top={position}
            color={
              item.type === "event" 
                ? "#6b7280" 
                : item.place === "meccan" ? "#1f2937" : "#2563eb"
            }
            label={item.type === "event" ? item.title : item.surahName}
            side={side}
            onClick={() => setSelected({ type: item.type, item })}
          />
        ))}
      </div>

      {selected && (
        <div className="inspector">
          {selected.type === "event" ? (
            <div>
              <h3>{(selected.item as SirahEvent).title}</h3>
              <p>{(selected.item as SirahEvent).summary}</p>
              <div className="meta">
                <span>Year AH: {(selected.item as SirahEvent).yearAH}</span>
                {(selected.item as SirahEvent).location && (
                  <span> • {(selected.item as SirahEvent).location}</span>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h3>{(selected.item as Revelation).surahName}</h3>
              <p>
                Place: {(selected.item as Revelation).place} • Order:{" "}
                {(selected.item as Revelation).revelationOrder}
              </p>
              {(selected.item as Revelation).asbab?.map((a, idx) => (
                <div key={idx} className="asbab">
                  <strong>{a.ayahRange}</strong>
                  <p>{a.summary}</p>
                </div>
              ))}
            </div>
          )}
          <button className="close" onClick={() => setSelected(null)}>
            ×
          </button>
        </div>
      )}
    </div>
  );
}