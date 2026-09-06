import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 📌 발표했던 PPT 슬라이드 데이터 (원하시는 이미지나 텍스트로 수정 가능합니다)
const slides = [
  {
    id: 1,
    title: "11th Grade Chemistry: Chemical Bonds & Enthalpy",
    subtitle: "2022 개정 교육과정 화학 과제 발표 자료",
    content: "화학 결합 에너지와 반응열의 관계 분석. 공유 결합과 이온 결합에서의 에너지 출입 메커니즘 고찰.",
    type: "title"
  },
  {
    id: 2,
    title: "Electronegativity & Bond Energy",
    subtitle: "전기음성도와 결합 에너지",
    content: "• H-F, H-I, F-F 결합 에너지 비교 분석\n• 결합 길이와 극성에 따른 해리 에너지 차이 계산\n• 흡열 반응과 발열 반응의 엔탈피 변화량 측정값",
    type: "content"
  },
  {
    id: 3,
    title: "VBA & Creative Coding Integration",
    subtitle: "파워포인트 내 실시간 그래픽스 구동 실험",
    content: "• PowerPoint VBA를 활용한 3D 레이캐스팅 엔진 구동\n• ADODB.Stream을 이용한 실시간 에디터 동기화 매크로 구현\n• 렌더링 최적화 및 WASD 입력 처리 방식",
    type: "content"
  },
  {
    id: 4,
    title: "Conclusion & Future Works",
    subtitle: "결론 및 향후 확장 계획",
    content: "웹 표준 기술 및 파워포인트 자동화 환경의 융합 가능성 확인. 추가적인 유틸리티 아키텍처 확장 예정.",
    type: "conclusion"
  }
];

export default function RaycasterSection({ onBack }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isSlideShow, setIsSlideShow] = useState(false);

  const handleAnimateBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      onBack();
    }, 500);
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(prev => prev + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(prev => prev - 1);
  };

  return (
    <>
      <style>{`
        .ppt-panel {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 92vw;
          height: 90vh;
          max-width: 1400px;
          max-height: 900px;
          display: flex;
          flex-direction: column;
          background-color: #f3f3f3;
          font-family: 'Segoe UI', -apple-system, sans-serif;
          color: #333333;
          overflow: hidden;
          border-radius: 10px;
          border: 1px solid #d4d4d4;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
          z-index: 100;
        }

        .ppt-panel.hidden {
          opacity: 0;
          pointer-events: none;
        }

        /* 파워포인트 상단 리본 메뉴 바 */
        .ppt-top-bar {
          height: 40px;
          background-color: #b71c1c;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          font-size: 13px;
          font-weight: 600;
          user-select: none;
          flex-shrink: 0;
        }

        .ppt-ribbon {
          height: 75px;
          background-color: #f8f9fa;
          border-bottom: 1px solid #dcdcdc;
          display: flex;
          align-items: center;
          padding: 0 20px;
          gap: 24px;
          flex-shrink: 0;
        }

        .ribbon-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          border-right: 1px solid #dcdcdc;
          padding-right: 20px;
        }

        .ribbon-title {
          font-size: 11px;
          color: #666;
          font-weight: 500;
        }

        .ribbon-btns {
          display: flex;
          gap: 8px;
        }

        .ppt-btn {
          background: white;
          border: 1px solid #ccc;
          padding: 6px 14px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.2s, border-color 0.2s;
        }

        .ppt-btn:hover {
          background: #e6f2ff;
          border-color: #0078d4;
          color: #0078d4;
        }

        .ppt-btn.primary {
          background: #107c41;
          color: white;
          border: none;
        }
        .ppt-btn.primary:hover {
          background: #0e6b38;
          color: white;
        }

        /* 메인 작업 영역 */
        .ppt-body {
          flex: 1;
          display: flex;
          overflow: hidden;
          background-color: #e9ecef;
        }

        .ppt-thumbnails {
          width: 220px;
          background-color: #ffffff;
          border-right: 1px solid #dcdcdc;
          overflow-y: auto;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex-shrink: 0;
        }

        .thumbnail-card {
          background: #fdfdfd;
          border: 2px solid #ddd;
          border-radius: 4px;
          height: 100px;
          padding: 8px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-size: 10px;
          color: #555;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .thumbnail-card.active {
          border-color: #b71c1c;
          box-shadow: 0 0 0 2px rgba(183, 28, 28, 0.2);
        }

        .thumbnail-preview-title {
          font-weight: bold;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .ppt-canvas-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 30px;
          position: relative;
        }

        .ppt-slide {
          width: 100%;
          max-width: 860px;
          height: 480px;
          background: white;
          border-radius: 4px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          padding: 50px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          box-sizing: border-box;
          border: 1px solid #ccc;
        }

        .slide-header h2 {
          font-size: 24px;
          color: #111;
          margin: 0 0 8px 0;
        }

        .slide-header h4 {
          font-size: 14px;
          color: #b71c1c;
          margin: 0;
          font-weight: 600;
        }

        .slide-body {
          font-size: 16px;
          color: #444;
          line-height: 1.6;
          white-space: pre-line;
          flex: 1;
          display: flex;
          align-items: center;
        }

        .slide-footer {
          font-size: 12px;
          color: #888;
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #eee;
          padding-top: 12px;
        }

        .slideshow-overlay {
          position: absolute;
          inset: 0;
          background: #111;
          z-index: 200;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 40px;
        }

        .slideshow-slide {
          width: 85vw;
          height: 80vh;
          background: white;
          border-radius: 8px;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
          box-shadow: 0 20px 50px rgba(0,0,0,0.8);
        }

        .slideshow-controls {
          position: absolute;
          bottom: 20px;
          display: flex;
          gap: 16px;
        }

        .slideshow-btn {
          background: rgba(255,255,255,0.2);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        .slideshow-btn:hover {
          background: rgba(255,255,255,0.4);
        }
      `}</style>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className={`ppt-panel ${isExiting ? "hidden" : ""}`}
      >
        <div className="ppt-top-bar">
          <span>📊 PowerPoint - Project_Presentation_Archive.pptx</span>
          <button 
            onClick={handleAnimateBack} 
            style={{ background: 'transparent', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
          >
            ✕ 닫기
          </button>
        </div>

        <div className="ppt-ribbon">
          <div className="ribbon-group">
            <span className="ribbon-title">슬라이드 쇼</span>
            <div className="ribbon-btns">
              <button className="ppt-btn primary" onClick={() => setIsSlideShow(true)}>
                ▶ 처음부터 슬라이드 쇼
              </button>
            </div>
          </div>

          <div className="ribbon-group">
            <span className="ribbon-title">페이지 탐색</span>
            <div className="ribbon-btns">
              <button className="ppt-btn" onClick={prevSlide} disabled={currentSlide === 0}>◀ 이전</button>
              <button className="ppt-btn" onClick={nextSlide} disabled={currentSlide === slides.length - 1}>다음 ▶</button>
            </div>
          </div>

          <div className="ribbon-group" style={{ border: 'none' }}>
            <span className="ribbon-title">시스템</span>
            <div className="ribbon-btns">
              <button className="ppt-btn" onClick={handleAnimateBack} style={{ color: '#b71c1c', borderColor: '#b71c1c' }}>
                메인으로 나가기
              </button>
            </div>
          </div>
        </div>

        <div className="ppt-body">
          <div className="ppt-thumbnails">
            {slides.map((slide, idx) => (
              <div 
                key={slide.id}
                className={`thumbnail-card ${currentSlide === idx ? "active" : ""}`}
                onClick={() => setCurrentSlide(idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>{idx + 1}</span>
                  <span>PPT</span>
                </div>
                <div className="thumbnail-preview-title">{slide.title}</div>
              </div>
            ))}
          </div>

          <div className="ppt-canvas-container">
            <div className="ppt-slide">
              <div className="slide-header">
                <h2>{slides[currentSlide].title}</h2>
                <h4>{slides[currentSlide].subtitle}</h4>
              </div>
              <div className="slide-body">
                {slides[currentSlide].content}
              </div>
              <div className="slide-footer">
                <span>Presentation Archive</span>
                <span>{currentSlide + 1} / {slides.length}</span>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isSlideShow && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="slideshow-overlay"
            >
              <div className="slideshow-slide">
                <div className="slide-header">
                  <h2 style={{ fontSize: '32px' }}>{slides[currentSlide].title}</h2>
                  <h4 style={{ fontSize: '18px', color: '#b71c1c' }}>{slides[currentSlide].subtitle}</h4>
                </div>
                <div className="slide-body" style={{ fontSize: '22px' }}>
                  {slides[currentSlide].content}
                </div>
                <div className="slide-footer" style={{ fontSize: '16px' }}>
                  <span>PowerPoint Fullscreen Slide Show</span>
                  <span>{currentSlide + 1} / {slides.length}</span>
                </div>
              </div>

              <div className="slideshow-controls">
                <button className="slideshow-btn" onClick={prevSlide} disabled={currentSlide === 0}>◀ 이전</button>
                <button className="slideshow-btn" onClick={() => setIsSlideShow(false)}>✕ 슬라이드 쇼 종료 (ESC)</button>
                <button className="slideshow-btn" onClick={nextSlide} disabled={currentSlide === slides.length - 1}>다음 ▶</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}