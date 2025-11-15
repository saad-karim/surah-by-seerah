import React from "react";

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-container">
        <div className="loading-header">
          <h1 className="loading-title">THE REVELATION JOURNEY</h1>
          <div className="loading-subtitle">
            Preparing the Qur'an timeline alongside the life of the Prophet ﷺ
          </div>
        </div>
        
        <div className="loading-animation">
          <div className="mosque-silhouette">
            <div className="minaret minaret-1"></div>
            <div className="dome"></div>
            <div className="minaret minaret-2"></div>
          </div>
          
          <div className="loading-dots">
            <div className="dot dot-1"></div>
            <div className="dot dot-2"></div>
            <div className="dot dot-3"></div>
          </div>
        </div>
        
        <div className="loading-text">
          <span className="arabic-text">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</span>
          <span className="english-text">In the name of Allah, the Most Gracious, the Most Merciful</span>
        </div>
      </div>
    </div>
  );
}