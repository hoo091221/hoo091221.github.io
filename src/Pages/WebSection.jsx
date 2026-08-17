import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
// 💡 useNavigate는 사용하지 않으므로 임포트하지 않아도 됩니다.

const webCards = [
  // { title: "NOMO", desc: "중학교 1학년 전범위의 교육과정.", url: "https://hoo091221.github.io/nomo" },
  { title: "오늘의 급식", desc: "오직 거제중학교의 급식만.", url: "https://hoo091221.github.io/lunch" },
  { title: "AVOID!", desc: "수행평가용으로 만든 간단한 게임.", url: "https://hoo091221.github.io/avoid" },
  { title: "진법변환기", desc: "공식을 활용한 진법변환 도구.", url: "https://hoo091221.github.io/binary" },
  { title: "빛의 삼원색 조명", desc: "RGB 및 헥스 코드 값 추출 도구.", url: "https://hoo091221.github.io/light" },
  { title: "원주율 페이지", desc: "원주율에 대한 다양한 기능 제공.", url: "https://hoo091221.github.io/pi" },
  { title: "이차방정식 계산기", desc: "근의 공식을 활용한 연산기.", url: "https://hoo091221.github.io/root" },
  { title: "파동 중첩 시뮬레이션", desc: "사인파의 간섭 시뮬레이터.", url: "https://hoo091221.github.io/Wave" }
];

export default function WebSection({ onBack }) {
  // 🟢 해결: 훅(Hooks)들은 반드시 컴포넌트 함수 바디 안쪽 최상단에 선언해야 합니다!
  const [isExiting, setIsExiting] = useState(false);
  const [typedText, setTypedText] = useState("");
  const targetText = "const projectList = await fetch('./repository/utilities.json');";

  // ⏱ 타이핑 효과 루프
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText((prev) => prev + targetText.charAt(index));
      index++;
      if (index >= targetText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // ⚡ 부드러운 페이드아웃 애니메이션을 먼저 보여준 후 안전하게 복귀하는 핸들러
  const handleAnimateBack = () => {
    setIsExiting(true); // .hidden 클래스를 트리거해서 0.5초간 흐려지며 작아지게 만듦
    setTimeout(() => {
      onBack(); // CSS 트랜지션이 끝난 뒤 부모 컴포넌트의 close 동작 실행
    }, 500); 
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      // 💡 `isExiting`가 참이 되면 'hidden' 클래스가 붙어 배경과 함께 스무스하게 소멸합니다.
      className={`sub-panel vsc-theme ${isExiting ? "hidden" : ""}`}
    >
      {/* 가상 사이드바 에디터 패널 */}
      <div className="vsc-sidebar">
        <div className="folder-title">EXPLORER</div>
        <div className="file-item active">📁 src/projects</div>
        <div className="file-item indent">📄 web_apps.json</div>
        {/* 고쳐진 부드러운 탈출 핸들러 연결 */}
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
    </motion.div>
  );
}