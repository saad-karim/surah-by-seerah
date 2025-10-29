import React from "react";
import type { SirahEvent } from "../types";

export default function EventCard({ e }: { e: SirahEvent }) {
  return (
    <div className="card">
      <h4>{e.title}</h4>
      <p>{e.summary}</p>
      <small>
        {e.location ? `${e.location} • ` : ""}AH {e.yearAH}
      </small>
    </div>
  );
}
