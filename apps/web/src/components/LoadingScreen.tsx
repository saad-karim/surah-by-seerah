import React from "react";

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-container">
        <div className="simple-spinner"></div>
        <p className="loading-message">Loading...</p>
      </div>
    </div>
  );
}

