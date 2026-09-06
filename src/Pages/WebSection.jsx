import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const webCards = [
  { title: "오늘의 급식", desc: "거제중학교 급식 API 테스트하기.", url: "https://hoo091221.github.io/lunch" },
  { title: "AVOID!", desc: "수행평가용으로 만든 간단한 게임.", url: "https://hoo091221.github.io/avoid" },
  { title: "진법변환기", desc: "공식을 활용한 진법변환 도구.", url: "https://hoo091221.github.io/binary" },
  { title: "빛의 삼원색 조명", desc: "RGB 및 헥스 코드 값 추출 도구.", url: "https://hoo091221.github.io/light" },
  { title: "원주율 페이지", desc: "원주율에 대한 다양한 기능 제공.", url: "https://hoo091221.github.io/pi" },
  { title: "이차방정식 계산기", desc: "근의 공식을 활용한 연산기.", url: "https://hoo091221.github.io/root" },
  { title: "파동 중첩 시뮬레이션", desc: "사인파의 간섭 시뮬레이터.", url: "https://hoo091221.github.io/Wave" }
];

export default function WebSection({ onBack }) {
  const [isExiting, setIsExiting] = useState(false);
  const [typedText, setTypedText] = useState("");
  const targetText = "const projectList = await fetch('./repository/utilities.json');";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + targetText.charAt(index));
      index++;
      if (index >= targetText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const handleAnimateBack = () => {
    setIsExiting(true);
    setTimeout(() => {
      onBack();
    }, 500); 
  };

  return (
    <>
      <style>{`
        .sub-panel.vsc-theme {
          width: 90vw;
          height: 88vh;
          display: flex;
          flex-direction: column;
          background-color: #1e1e1e;
          font-family: Consolas, 'Courier New', monospace;
          color: #d4d4d4;
          overflow: hidden;
          border-radius: 12px;
          border: 1px solid #333333;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7);
          opacity: 1;
          transform: scale(1);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }

        .sub-panel.vsc-theme.hidden {
          opacity: 0;
          transform: scale(0.95);
          pointer-events: none;
        }

        /* 상단 윈도우 컨트롤바 */
        .vsc-top-navbar {
          height: 38px;
          background-color: #323233;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          border-bottom: 1px solid #222222;
          user-select: none;
          flex-shrink: 0;
        }

        .window-controls {
          display: flex;
          gap: 8px;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          cursor: pointer;
        }
        .dot.red { background-color: #ff5f56; }
        .dot.yellow { background-color: #ffbd2e; }
        .dot.green { background-color: #27c93f; }

        .window-address-bar {
          background-color: #1e1e1e;
          padding: 3px 24px;
          border-radius: 4px;
          font-size: 11px;
          color: #858585;
          border: 1px solid #3c3c3c;
          letter-spacing: 0.5px;
        }

        .navbar-close-btn {
          background-color: #2d2d2d;
          border: 1px solid #454545;
          color: #ce9178;
          font-family: inherit;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .navbar-close-btn:hover {
          background-color: #f14c4c;
          color: #ffffff;
          border-color: #f14c4c;
        }

        .vsc-window-body {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .vsc-sidebar {
          width: 240px;
          background-color: #252526;
          border-right: 1px solid #333333;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          user-select: none;
          flex-shrink: 0;
        }

        .folder-title {
          padding: 12px 16px;
          font-size: 11px;
          font-weight: 700;
          color: #858585;
          letter-spacing: 1px;
        }

        .file-item {
          padding: 6px 16px;
          font-size: 13px;
          color: #d4d4d4;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .file-item.indent {
          padding-left: 28px;
          background-color: #2a2d2e;
          color: #4ec9b0;
        }

        .vsc-back-btn {
          margin: 16px;
          padding: 8px 12px;
          background-color: #333333;
          border: 1px solid #454545;
          color: #ce9178;
          font-family: inherit;
          font-size: 11px;
          font-weight: 700;
          border-radius: 4px;
          cursor: pointer;
          text-align: left;
        }

        .vsc-back-btn:hover {
          background-color: #3f3f46;
        }

        .vsc-editor {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-color: #1e1e1e;
          overflow: hidden;
        }

        .vsc-tabs {
          height: 35px;
          background-color: #2d2d2d;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #333333;
          user-select: none;
          flex-shrink: 0;
        }

        .tab {
          height: 100%;
          padding: 0 20px;
          background-color: #1e1e1e;
          color: #d4d4d4;
          font-size: 12px;
          display: flex;
          align-items: center;
          border-right: 1px solid #333333;
          border-top: 2px solid #007acc;
        }

        .vsc-terminal-line {
          padding: 14px 24px;
          font-size: 13px;
          border-bottom: 1px solid #333333;
          background-color: #1e1e1e;
          line-height: 1.5;
          flex-shrink: 0;
        }

        .code-blue { color: #c586c0; }
        .code-yellow { color: #4ec9b0; }
        .code-orange { color: #ce9178; }
        .code-green { color: #9cdcfe; }

        .cursor-blink {
          animation: blink 1s infinite;
          color: #d4d4d4;
          font-weight: bold;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .vsc-grid-cards {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
          align-content: start;
        }

        .vsc-card {
          background-color: #252526;
          border: 1px solid #333333;
          border-radius: 6px;
          padding: 20px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 180px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
        }

        .vsc-card:hover {
          transform: translateY(-4px);
          border-color: #007acc;
          background-color: #2a2d2e;
        }

        .vsc-card-tag {
          align-self: flex-start;
          font-size: 10px;
          background-color: #333333;
          color: #858585;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .vsc-card-title {
          color: #9cdcfe;
          font-size: 15px;
          margin: 0 0 8px 0;
          font-weight: 700;
        }

        .vsc-card-desc {
          color: #858585;
          font-size: 12px;
          margin: 0 0 16px 0;
          line-height: 1.4;
        }

        .vsc-card-link {
          color: #ce9178;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }
      `}</style>

      <motion.div 
        initial={{ opacity: 0, scale: 0.94 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className={`sub-panel vsc-theme ${isExiting ? "hidden" : ""}`}
      >
        {/* 상단 내비바 영역 */}
        <div className="vsc-top-navbar">
          <div className="window-controls">
            <span className="dot red" onClick={handleAnimateBack} title="닫기"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <div className="window-address-bar">
            <span>https://hoo091221.github.io/portfolio/projects</span>
          </div>
          <button className="navbar-close-btn" onClick={handleAnimateBack}>
            CLOSE ✕
          </button>
        </div>

        <div className="vsc-window-body">
          {/* 가상 사이드바 에디터 패널 */}
          <div className="vsc-sidebar">
            <div>
              <div className="folder-title">EXPLORER</div>
              <div className="file-item active">📁 src/projects</div>
              <div className="file-item indent">📄 web_apps.json</div>
            </div>
            <button className="vsc-back-btn" onClick={handleAnimateBack}>↩ TERMINAL EXIT</button>
          </div>

          {/* 메인 에디터 영역 */}
          <div className="vsc-editor">
            <div className="vsc-tabs">
              <div className="tab active">web_apps.json ×</div>
            </div>
            
            <div className="vsc-terminal-line">
              <span className="code-blue">import</span> <span className="code-yellow">{"{ WebApplications }"}</span> <span className="code-blue">from</span> <span className="code-orange">'@/portfolio'</span>;
              <br />
              <span className="code-green">{typedText}</span><span className="cursor-blink">|</span>
            </div>

            {/* 유틸리티 카드 목록 격자 배치 */}
            <div className="vsc-grid-cards">
              {webCards.map((card, i) => (
                <motion.div 
                  key={i} className="vsc-card"
                  initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  onClick={() => window.open(card.url, '_blank')}
                >
                  <div className="vsc-card-tag">JSON</div>
                  <h3 className="vsc-card-title">"{card.title}"</h3>
                  <p className="vsc-card-desc">: "{card.desc}"</p>
                  <span className="vsc-card-link">"click_to_open_url" ➔</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}