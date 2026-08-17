import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import MusicSection from './MusicSection';
import WebSection from './WebSection';
import '../CSS/style.css';

export default function Background() {
  const gridControls = useAnimation();
  const textControls = useAnimation();

  const [activeSection, setActiveSection] = useState('main');
  // 버튼 마운트 게이트를 제거하고, Framer Motion 자체 변수(animate 속성 제어)로 즉시 제어합니다.
  const [startBtnAnimation, setStartBtnAnimation] = useState(false);

  const a = 60;
  const cols = 22; 
  const rows = 18; 

  const gridWidth = cols * a;
  const gridHeight = (rows - 1) * a + a / 2;

  const horizontalLines = [];
  let currentY = 0;
  horizontalLines.push(currentY); 
  currentY += a / 2; 
  for (let i = 1; i <= rows; i++) {
    horizontalLines.push(currentY);
    currentY += a;
  }

  const verticalLines = [];
  for (let i = 0; i <= cols; i++) {
    verticalLines.push(i * a);
  }

  useEffect(() => {
    if (activeSection === 'main') {
      setStartBtnAnimation(false);

      const sequence = async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));

        // 1. 격자판 회전 및 확대 연출 (0.3초 후 시작)
        gridControls.start({
          rotate: 0,
          scale: 2.0,
          transition: {
            duration: 3.2,
            ease: [0.25, 1, 0.5, 1],
            delay: 0.3,
          },
        });

        // 2. 글씨 타이핑 드로잉 시작 (1.5초 후 시작)
        await textControls.start({
          strokeDashoffset: 0,
          transition: { duration: 2.0, ease: "easeInOut", delay: 1.5 }
        });
        
        // ⚡ [속도 극대화]: 글자 획이 다 그어지자마자 '0초' 딜레이로 바로 버튼 애니메이션을 켭니다.
        setStartBtnAnimation(true);

        // 3. 내부 색상 채우기는 버튼 등장과 동시에 부드럽게 배경으로 깔리게 처리
        textControls.start({
          fill: "rgba(0, 0, 0, 0.05)",
          transition: { duration: 0.4 }
        });
      };

      sequence();
    }
  }, [activeSection, gridControls, textControls]);

  // 더 스피디하고 리드미컬하게 통-통-통 튀어나오도록 간격 및 탄성(Spring) 조정
  const containerVariants = {
    initial: {},
    animate: {
      transition: { 
        staggerChildren: 0.08 // 0.12초에서 0.08초로 단축하여 연속 배치 속도감 업
      }
    }
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 160, damping: 13 } 
    }
  };

  return (
    <div className={`archive-container theme-${activeSection}`}>
      <motion.div
        initial={{ rotate: -30, scale: 1.2 }}
        animate={gridControls}
        className="grid-wrapper"
        style={{ 
          width: gridWidth, 
          height: gridHeight,
          display: activeSection === 'main' ? 'flex' : 'none' 
        }}
      >
        <svg className="grid-svg-board" viewBox={`0 0 ${gridWidth} ${gridHeight}`} width={gridWidth} height={gridHeight}>
          {horizontalLines.map((y, index) => (
            <motion.line
              key={`h-${index}`} x1="0" y1={y} x2={gridWidth} y2={y}
              stroke="rgba(220, 38, 38, 0.65)" strokeWidth="1" strokeDasharray={gridWidth}
              initial={{ strokeDashoffset: gridWidth }} animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1.5, delay: index * 0.06, ease: "easeInOut" }}
            />
          ))}
          {verticalLines.map((x, index) => (
            <motion.line
              key={`v-${index}`} x1={x} y1="0" x2={x} y2={gridHeight}
              stroke="rgba(220, 38, 38, 0.65)" strokeWidth="1" strokeDasharray={gridHeight}
              initial={{ strokeDashoffset: gridHeight }} animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1.5, delay: index * 0.05, ease: "easeInOut" }}
            />
          ))}
        </svg>

        {/* 메인 레이아웃 센터 보존 레이어 */}
        <div className="content-overlay-layer">
          {/* 고정 틀 영역 내부 배치로 글씨가 수직 이동하는 버그 원천 봉쇄 */}
          <div className="title-fixed-zone">
            <svg className="title-svg" viewBox="0 0 400 120" fill="none">
              <motion.text
                x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="svg-text"
                strokeDasharray="600" initial={{ strokeDashoffset: 600, fill: "rgba(0, 0, 0, 0)" }}
                animate={textControls}
              >
                Archive
              </motion.text>
            </svg>
          </div>

          {/* 버튼 구역 배치 */}
          <motion.div 
            className="menu-button-group" 
            variants={containerVariants}
            initial="initial"
            animate={startBtnAnimation ? "animate" : "initial"}
          >
            <motion.button className="menu-btn" variants={buttonVariants} onClick={() => setActiveSection('web')}>
              웹 프로젝트 보기
            </motion.button>
            <motion.button className="menu-btn" variants={buttonVariants} onClick={() => setActiveSection('music')}>
              작곡 노트 보기
            </motion.button>
            <motion.button className="menu-btn" variants={buttonVariants} onClick={() => setActiveSection('sketch')}>
              PPT 작업물 보기
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* 라우팅 컴포넌트 */}
      {activeSection === 'music' && <MusicSection onBack={() => setActiveSection('main')} />}
      {activeSection === 'web' && <WebSection onBack={() => setActiveSection('main')} />}
    </div>
  );
}