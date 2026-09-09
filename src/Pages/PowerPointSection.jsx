import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const presentations = [
  {
    id: "1-1-english",
    title: "1-1. 공통영어1 세특 발표",
    date: "2025-07-15",
    thumbnail: "./../PowerPoint/1-1-english/슬라이드1.png",
    videoSrc: "./../PowerPoint/1-1-english/video.mp4",
    slides: [
      { id: 1, title: "슬라이드 1", startTime: 0, thumb: "./../PowerPoint/1-1-english/슬라이드1.png" },
      { id: 2, title: "슬라이드 2", startTime: 2, thumb: "./../PowerPoint/1-1-english/슬라이드2.png" },
      { id: 3, title: "슬라이드 3", startTime: 6, thumb: "./../PowerPoint/1-1-english/슬라이드3.png" },
      { id: 4, title: "슬라이드 4", startTime: 12, thumb: "./../PowerPoint/1-1-english/슬라이드4.png" },
      { id: 5, title: "슬라이드 5", startTime: 17, thumb: "./../PowerPoint/1-1-english/슬라이드5.png" },
      { id: 6, title: "슬라이드 6", startTime: 22, thumb: "./../PowerPoint/1-1-english/슬라이드6.png" },
      { id: 7, title: "슬라이드 7", startTime: 26, thumb: "./../PowerPoint/1-1-english/슬라이드7.png" },
      { id: 8, title: "슬라이드 8", startTime: 29, thumb: "./../PowerPoint/1-1-english/슬라이드8.png" },
      { id: 9, title: "슬라이드 9", startTime: 33, thumb: "./../PowerPoint/1-1-english/슬라이드9.png" },
      { id: 10, title: "슬라이드 10", startTime: 36, thumb: "./../PowerPoint/1-1-english/슬라이드10.png" },
      { id: 11, title: "슬라이드 11", startTime: 41, thumb: "./../PowerPoint/1-1-english/슬라이드11.png" },
      { id: 12, title: "슬라이드 12", startTime: 50, thumb: "./../PowerPoint/1-1-english/슬라이드12.png" },
      { id: 13, title: "슬라이드 13", startTime: 59, thumb: "./../PowerPoint/1-1-english/슬라이드13.png" },
      { id: 14, title: "슬라이드 14", startTime: 68, thumb: "./../PowerPoint/1-1-english/슬라이드14.png" },
      { id: 15, title: "슬라이드 15", startTime: 72, thumb: "./../PowerPoint/1-1-english/슬라이드15.png" },
      { id: 16, title: "슬라이드 16", startTime: 77, thumb: "./../PowerPoint/1-1-english/슬라이드16.png" },
      { id: 17, title: "슬라이드 17", startTime: 80, thumb: "./../PowerPoint/1-1-english/슬라이드17.png" },
      { id: 18, title: "슬라이드 18", startTime: 83, thumb: "./../PowerPoint/1-1-english/슬라이드18.png" },
      { id: 19, title: "슬라이드 19", startTime: 87, thumb: "./../PowerPoint/1-1-english/슬라이드19.png" },
      { id: 20, title: "슬라이드 20", startTime: 90, thumb: "./../PowerPoint/1-1-english/슬라이드20.png" },
      { id: 21, title: "슬라이드 21", startTime: 100, thumb: "./../PowerPoint/1-1-english/슬라이드23.png" }
    ]
  },
  {
    id: "1-1-korean",
    title: "1-1. 공통국어1 세특 발표",
    date: "2025-06-08",
    thumbnail: "./../PowerPoint/1-1-korean/슬라이드1.png",
    videoSrc: "./../PowerPoint/1-1-korean/video.mp4",
    slides: [
      { id: 1, title: "슬라이드 1", startTime: 0, thumb: "./../PowerPoint/1-1-korean/슬라이드1.png" },
      { id: 2, title: "슬라이드 2", startTime: 2, thumb: "./../PowerPoint/1-1-korean/슬라이드2.png" },
      { id: 3, title: "슬라이드 3", startTime: 4, thumb: "./../PowerPoint/1-1-korean/슬라이드3.png" },
      { id: 4, title: "슬라이드 4", startTime: 6, thumb: "./../PowerPoint/1-1-korean/슬라이드4.png" },
      { id: 5, title: "슬라이드 5", startTime: 7, thumb: "./../PowerPoint/1-1-korean/슬라이드5.png" },
      { id: 6, title: "슬라이드 6", startTime: 11, thumb: "./../PowerPoint/1-1-korean/슬라이드6.png" },
      { id: 7, title: "슬라이드 7", startTime: 12, thumb: "./../PowerPoint/1-1-korean/슬라이드7.png" },
      { id: 8, title: "슬라이드 8", startTime: 15, thumb: "./../PowerPoint/1-1-korean/슬라이드8.png" },
      { id: 9, title: "슬라이드 9", startTime: 19, thumb: "./../PowerPoint/1-1-korean/슬라이드9.png" },
      { id: 10, title: "슬라이드 10", startTime: 21, thumb: "./../PowerPoint/1-1-korean/슬라이드10.png" },
      { id: 11, title: "슬라이드 11", startTime: 25, thumb: "./../PowerPoint/1-1-korean/슬라이드11.png" },
      { id: 12, title: "슬라이드 12", startTime: 29, thumb: "./../PowerPoint/1-1-korean/슬라이드12.png" },
      { id: 13, title: "슬라이드 13", startTime: 32, thumb: "./../PowerPoint/1-1-korean/슬라이드13.png" },
      { id: 14, title: "슬라이드 14", startTime: 35, thumb: "./../PowerPoint/1-1-korean/슬라이드14.png" },
      { id: 15, title: "슬라이드 15", startTime: 38, thumb: "./../PowerPoint/1-1-korean/슬라이드15.png" },
      { id: 16, title: "슬라이드 16", startTime: 40, thumb: "./../PowerPoint/1-1-korean/슬라이드16.png" },
      { id: 17, title: "슬라이드 17", startTime: 43, thumb: "./../PowerPoint/1-1-korean/슬라이드17.png" },
      { id: 18, title: "슬라이드 18", startTime: 45, thumb: "./../PowerPoint/1-1-korean/슬라이드18.png" },
      { id: 19, title: "슬라이드 19", startTime: 55, thumb: "./../PowerPoint/1-1-korean/슬라이드19.png" },
      { id: 20, title: "슬라이드 20", startTime: 59, thumb: "./../PowerPoint/1-1-korean/슬라이드20.png" }
    ]
  },
  {
    id: "1-1-social",
    title: "1-1. 통합사회1 세특 발표",
    date: "2025-05-31",
    thumbnail: "./../PowerPoint/1-1-social/슬라이드1.png",
    videoSrc: "./../PowerPoint/1-1-social/video.mp4",
    slides: [
      { id: 1, title: "슬라이드 1", startTime: 0, thumb: "./../PowerPoint/1-1-social/슬라이드1.png" },
      { id: 2, title: "슬라이드 2", startTime: 2, thumb: "./../PowerPoint/1-1-social/슬라이드2.png" },
      { id: 3, title: "슬라이드 3", startTime: 9, thumb: "./../PowerPoint/1-1-social/슬라이드3.png" },
      { id: 4, title: "슬라이드 4", startTime: 11, thumb: "./../PowerPoint/1-1-social/슬라이드4.png" },
      { id: 5, title: "슬라이드 5", startTime: 14, thumb: "./../PowerPoint/1-1-social/슬라이드5.png" },
      { id: 6, title: "슬라이드 6", startTime: 17, thumb: "./../PowerPoint/1-1-social/슬라이드6.png" },
      { id: 7, title: "슬라이드 7", startTime: 19, thumb: "./../PowerPoint/1-1-social/슬라이드7.png" },
      { id: 8, title: "슬라이드 8", startTime: 21, thumb: "./../PowerPoint/1-1-social/슬라이드8.png" },
      { id: 9, title: "슬라이드 9", startTime: 44, thumb: "./../PowerPoint/1-1-social/슬라이드9.png" },
      { id: 10, title: "슬라이드 10", startTime: 47, thumb: "./../PowerPoint/1-1-social/슬라이드10.png" },
      { id: 11, title: "슬라이드 11", startTime: 50, thumb: "./../PowerPoint/1-1-social/슬라이드11.png" },
      { id: 12, title: "슬라이드 12", startTime: 52, thumb: "./../PowerPoint/1-1-social/슬라이드12.png" },
      { id: 13, title: "슬라이드 13", startTime: 55, thumb: "./../PowerPoint/1-1-social/슬라이드13.png" },
      { id: 14, title: "슬라이드 14", startTime: 57, thumb: "./../PowerPoint/1-1-social/슬라이드14.png" },
      { id: 15, title: "슬라이드 15", startTime: 60, thumb: "./../PowerPoint/1-1-social/슬라이드15.png" },
      { id: 16, title: "슬라이드 16", startTime: 62, thumb: "./../PowerPoint/1-1-social/슬라이드16.png" }
      // { id: 4, title: "슬라이드 17", startTime: 105, thumb: "./../PowerPoint/1-1-social/슬라이드17.png" }
    ]
  }
];

export default function PowerPointSection({ onBack }) {
  const [selectedPpt, setSelectedPpt] = useState(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (selectedPpt && videoRef.current) {
      const targetTime = selectedPpt.slides[activeSlideIndex].startTime;
      videoRef.current.currentTime = targetTime;
      videoRef.current.play();
    }
  }, [activeSlideIndex, selectedPpt]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (selectedPpt !== null) {
          setSelectedPpt(null);
        } else {
          handleAnimateBack();
        }
      } else if (selectedPpt !== null) {
        if (e.key === "ArrowRight" || e.key === "PageDown") {
          setActiveSlideIndex(prev => Math.min(selectedPpt.slides.length - 1, prev + 1));
        } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
          setActiveSlideIndex(prev => Math.max(0, prev - 1));
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPpt]);

  const handleAnimateBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      onBack();
    }, 400);
  };

  const handleSelectPpt = (ppt) => {
    setSelectedPpt(ppt);
    setActiveSlideIndex(0);
  };

  return (
    <>
      <style>{`
        .ppt-workspace {
          width: 94vw;
          height: 90vh;
          display: flex;
          flex-direction: column;
          background-color: #f3f3f3;
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #333;
          border-radius: 8px;
          border: 1px solid #d1d1d1;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          position: relative;
        }
        .ppt-workspace.hidden {
          opacity: 0;
          transform: scale(0.95);
          pointer-events: none;
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        /* PowerPoint Ribbon Header 스타일 */
        .ppt-app-header {
          background-color: #f8f8f8;
          border-bottom: 1px solid #e1e1e1;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
        }
        .ppt-titlebar {
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          background-color: #b7472a; /* 파워포인트 주황색 포인트 */
          color: #fff;
        }
        .ppt-back-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.4);
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 3px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .ppt-back-btn:hover {
          background: rgba(255, 255, 255, 0.35);
        }
        .ppt-ribbon {
          height: 46px;
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 20px;
          background: #fdfdfd;
          border-bottom: 1px solid #e5e5e5;
          font-size: 12px;
          color: #555;
        }
        .ppt-ribbon-tab {
          font-weight: 600;
          color: #b7472a;
          border-bottom: 2px solid #b7472a;
          height: 100%;
          display: flex;
          align-items: center;
          padding: 0 4px;
        }
        .ppt-body {
          flex: 1;
          background: #e9ecef;
          overflow: hidden;
          position: relative;
        }
        /* PPT 목록 화면 그리드 스타일 */
        .ppt-list-container {
          width: 100%;
          height: 100%;
          padding: 30px;
          overflow-y: auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          align-content: start;
        }
        .ppt-card {
          background: #ffffff;
          border: 1px solid #dcdcdc;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .ppt-card:hover {
          border-color: #b7472a;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(183, 71, 42, 0.15);
        }
        .ppt-card-thumb {
          width: 100%;
          height: 150px;
          background: #f0f0f0;
          object-fit: cover;
          border-bottom: 1px solid #e8e8e8;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
          font-size: 12px;
        }
        .ppt-card-info {
          padding: 16px;
        }
        .ppt-card-title {
          font-size: 14px;
          font-weight: bold;
          color: #222;
          margin-bottom: 6px;
        }
        .ppt-card-date {
          font-size: 11px;
          color: #666;
        }
        /* 재생 뷰 내부 파워포인트 레이아웃 (좌측 썸네일 사이드바 + 우측 캔버스) */
        .ppt-editor-layout {
          display: flex;
          width: 100%;
          height: 100%;
        }
        .ppt-sidebar {
          width: 240px;
          background: #f1f3f5;
          border-right: 1px solid #dcdcdc;
          overflow-y: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex-shrink: 0;
        }
        .sidebar-slide-thumb {
          background: #fff;
          border: 2px solid #ddd;
          border-radius: 4px;
          padding: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .sidebar-slide-thumb:hover {
          border-color: #b7472a;
        }
        .sidebar-slide-thumb.active {
          border-color: #b7472a;
          box-shadow: 0 0 0 1px #b7472a;
          background: #fff5f2;
        }
        .sidebar-thumb-screen {
          width: 100%;
          height: 110px;
          background: #222;
          border-radius: 2px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .sidebar-thumb-screen img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .sidebar-slide-title {
          font-size: 11px;
          font-weight: 600;
          color: #444;
          margin-top: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        /* 우측 메인 비디오 스테이지 */
        .ppt-stage {
          flex: 1;
          background: #e2e6ea;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 20px;
        }
        .ppt-video-wrapper {
          background: #000;
          border-radius: 4px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          overflow: hidden;
          max-width: 100%;
          max-height: calc(100% - 50px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ppt-video-element {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .ppt-footer-bar {
          height: 40px;
          width: 100%;
          background: #f8f9fa;
          border-top: 1px solid #dcdcdc;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          position: absolute;
          bottom: 0;
          font-size: 12px;
          color: #555;
        }
        .ppt-nav-btn {
          background: #fff;
          border: 1px solid #ccc;
          padding: 4px 10px;
          border-radius: 3px;
          cursor: pointer;
          font-weight: 600;
          color: #333;
        }
        .ppt-nav-btn:hover:not(:disabled) {
          background: #f1f1f1;
          border-color: #b7472a;
          color: #b7472a;
        }
        .ppt-nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>

      <div className={`sub-panel ppt-workspace ${isExiting ? "hidden" : ""}`}>
        {/* 파워포인트 앱 스타일 상단 타이틀 및 리본 메뉴 */}
        <header className="ppt-app-header">
          <div className="ppt-titlebar">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button className="ppt-back-btn" onClick={() => {
                if (selectedPpt !== null) setSelectedPpt(null);
                else handleAnimateBack();
              }}>
                ◀ {selectedPpt !== null ? "All Presentations" : "나가기"}
              </button>
              <span style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.5px" }}>
                {selectedPpt ? `${selectedPpt.title} - PowerPoint Viewer` : "Microsoft PowerPoint - PPT 프레젠테이션"}
              </span>
            </div>
            <span style={{ fontSize: "11px", opacity: 0.8 }}>Archive</span>
          </div>

          <div className="ppt-ribbon">
            <div className="ppt-ribbon-tab">홈</div>
            <div>삽입</div>
            <div>디자인</div>
            <div>전환</div>
            <div>슬라이드 쇼</div>
            <div style={{ marginLeft: "auto", color: "#888", fontSize: "11px" }}>
              {selectedPpt ? `현재 슬라이드: ${activeSlideIndex + 1} / ${selectedPpt.slides.length}` : `${presentations.length}개의 프로젝트 파일`}
            </div>
          </div>
        </header>

        {/* 본문 영역 */}
        <div className="ppt-body">
          <AnimatePresence mode="wait">
            {selectedPpt === null && (
              <motion.div 
                key="ppt-list"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="ppt-list-container"
              >
                {presentations.map((ppt) => (
                  <div key={ppt.id} className="ppt-card" onClick={() => handleSelectPpt(ppt)}>
                    <div className="ppt-card-thumb">
                      {ppt.thumbnail ? (
                        <img src={ppt.thumbnail} alt={ppt.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span>PPT 썸네일</span>
                      )}
                    </div>
                    <div className="ppt-card-info">
                      <div className="ppt-card-title">{ppt.title}</div>
                      <div className="ppt-card-date">제작일: {ppt.date} | 슬라이드 수: {ppt.slides.length}장</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {selectedPpt !== null && (
              <motion.div 
                key="editor-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="ppt-editor-layout"
              >
                {/* 왼쪽 슬라이드 썸네일 탐색기 사이드바 */}
                <div className="ppt-sidebar">
                  <div style={{ fontSize: "11px", fontWeight: "bold", color: "#666", marginBottom: "4px" }}>슬라이드 목차</div>
                  {selectedPpt.slides.map((slide, idx) => (
                    <div 
                      key={slide.id} 
                      className={`sidebar-slide-thumb ${activeSlideIndex === idx ? "active" : ""}`}
                      onClick={() => setActiveSlideIndex(idx)}
                    >
                      <div className="sidebar-thumb-screen">
                        {slide.thumb ? (
                          <img src={slide.thumb} alt={slide.title} />
                        ) : (
                          <span style={{ color: "#888", fontSize: "10px" }}>Slide {idx + 1}</span>
                        )}
                        <span style={{ position: "absolute", top: "2px", left: "4px", fontSize: "9px", background: "rgba(0,0,0,0.6)", color: "#fff", padding: "1px 3px", borderRadius: "2px" }}>
                          {idx + 1}
                        </span>
                      </div>
                      <div className="sidebar-slide-title" title={slide.title}>{slide.title}</div>
                    </div>
                  ))}
                </div>

                {/* 우측 비디오 재생 스테이지 */}
                <div className="ppt-stage">
                  <div className="ppt-video-wrapper">
                    <video 
                      key={selectedPpt.id}
                      ref={videoRef}
                      src={selectedPpt.videoSrc}
                      className="ppt-video-element"
                      controls
                      autoPlay
                    />
                  </div>

                  <footer className="ppt-footer-bar">
                    <button 
                      className="ppt-nav-btn" 
                      onClick={() => setActiveSlideIndex(prev => Math.max(0, prev - 1))}
                      disabled={activeSlideIndex === 0}
                    >
                      ◀ 이전 슬라이드
                    </button>

                    <span style={{ fontWeight: "600", color: "#333" }}>
                      {activeSlideIndex + 1}. {selectedPpt.slides[activeSlideIndex].title}
                    </span>

                    <button 
                      className="ppt-nav-btn" 
                      onClick={() => setActiveSlideIndex(prev => Math.min(selectedPpt.slides.length - 1, prev + 1))}
                      disabled={activeSlideIndex === selectedPpt.slides.length - 1}
                    >
                      다음 슬라이드 ▶
                    </button>
                  </footer>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}