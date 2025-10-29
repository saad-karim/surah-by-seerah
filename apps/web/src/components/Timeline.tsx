import React, { useMemo, useState } from "react";
import type { TimelinePayload, SirahEvent, Revelation } from "../types";

function yearToPct(yearAH: number, minAH: number, maxAH: number) {
  const range = maxAH - minAH;
  return ((yearAH - minAH) / range) * 100;
}

function Marker({
  left,
  color,
  label,
  onClick,
}: {
  left: number;
  color: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <div className="marker" style={{ left: `${left}%` }} onClick={onClick}>
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

  return (
    <div className="timelines-container">
      {/* Events Timeline */}
      <div className="timeline-section">
        <h3 className="timeline-title">Historical Events</h3>
        <div className="timeline events-timeline">
          <div
            className="band meccan"
            style={{
              left: `${yearToPct(payload.meccan.startAH, minAH, maxAH)}%`,
              width: `${yearToPct(payload.meccan.endAH, minAH, maxAH) - yearToPct(payload.meccan.startAH, minAH, maxAH)}%`,
            }}
          >
            Meccan Period
          </div>
          <div
            className="band medinan"
            style={{
              left: `${yearToPct(payload.medinan.startAH, minAH, maxAH)}%`,
              width: `${yearToPct(payload.medinan.endAH, minAH, maxAH) - yearToPct(payload.medinan.startAH, minAH, maxAH)}%`,
            }}
          >
            Medinan Period
          </div>

          <div className="events-markers">
            {payload.events.map((ev) => (
              <Marker
                key={ev.id}
                left={yearToPct(ev.yearAH, minAH, maxAH)}
                color="#6b7280"
                label={ev.title}
                onClick={() => setSelected({ type: "event", item: ev })}
              />
            ))}
          </div>

          <div className="revelations-markers">
            {payload.revelations.map((rv, i) => (
              <Marker
                key={`r-${i}`}
                left={yearToPct(rv.approxYearAH, minAH, maxAH)}
                color={rv.place === "meccan" ? "#1f2937" : "#2563eb"}
                label={`${rv.surahName}`}
                onClick={() => setSelected({ type: "revelation", item: rv })}
              />
            ))}
          </div>
        </div>
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
