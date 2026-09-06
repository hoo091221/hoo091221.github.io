import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

import WebSection from './WebSection';
import PowerPointSection from './PowerPointSection';
import MusicSection from './MusicSection';

const theme = {
  bgBase: '#f0f9ff',
  bgGradStart: '#e0f2fe',
  bgGradEnd: '#bae6fd',
  textPrimary: '#0c4a6e',
  textSecondary: '#075985',
  accentColor: '#0284c7',
  accentGlow: 'rgba(2, 132, 199, 0.25)',
  cardBg: 'rgba(255, 255, 255, 0.85)',
  cardBorder: 'rgba(2, 132, 199, 0.2)',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const styles = {
  global: {
    width: '100vw',
    height: '100vh',
    background: `linear-gradient(135deg, ${theme.bgGradStart} 0%, ${theme.bgBase} 50%, ${theme.bgGradEnd} 100%)`,
    overflow: 'hidden',
    fontFamily: theme.fontFamily,
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    perspective: '2000px',
  },
  lightLeak: {
    position: 'absolute',
    top: '-20%',
    right: '-10%',
    width: '600px',
    height: '600px',
    background: `radial-gradient(circle, rgba(125, 211, 252, 0.4) 0%, transparent 70%)`,
    filter: 'blur(80px)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  dotPattern: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'radial-gradient(rgba(12, 74, 110, 0.05) 1px, transparent 0)',
    backgroundSize: '24px 24px',
    pointerEvents: 'none',
    zIndex: 1,
    opacity: 0.6,
  },
  titleArea: {
    position: 'absolute',
    top: '8vh',
    left: '5vw',
    zIndex: 10,
    pointerEvents: 'none',
  },
  socialLinks: {
    position: 'absolute',
    top: '8vh',
    right: '5vw',
    display: 'flex',
    gap: '1.2rem',
    zIndex: 10,
  },
};

export default function MainStudio() {
  const [activeApp, setActiveApp] = useState(null);
  const [isBooted, setIsBooted] = useState(false);
  const [lockedNotice, setLockedNotice] = useState(null); // 🟢 잠김 안내 토스트 상태

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 55, stiffness: 45 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const motionRotateX = useTransform(cursorY, [-0.5, 0.5], ["1.5deg", "-1.5deg"]);
  const motionRotateY = useTransform(cursorX, [-0.5, 0.5], ["-1.5deg", "1.5deg"]);

  const handleMouseMove = (e) => {
    const { innerWidth, innerHeight } = window;
    mouseX.set((e.clientX / innerWidth) - 0.5);
    mouseY.set((e.clientY / innerHeight) - 0.5);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsBooted(true), 1400);
    return () => clearTimeout(timer);
  }, []);

  const apps = {
    vsc: { 
      title: 'VSC // WEB DEVELOPMENT',
      subtitle: '프론트엔드와 웹 유틸리티 아키텍처', 
      tag: '01. DEVELOPMENT',
      symbol: '</>',
      color: '#0284c7',
      isLocked: false, // 🟢 열려있는 프로젝트
      component: <WebSection onBack={() => setActiveApp(null)} />
    },
    ppt: { 
      title: 'PPT // DESIGN', 
      subtitle: 'VBA 및 학교 세특 발표 PPT', 
      tag: '02. CREATIVE CODING',
      symbol: '3D',
      color: '#0369a1',
      isLocked: true, // 🟢 잠겨있는 프로젝트
      component: <PowerPointSection onBack={() => setActiveApp(null)} />
    },
    fl: { 
      title: 'FL // SOUND LAB', 
      subtitle: '카와이 퓨처 베이스 신스 디자인', 
      tag: '03. AUDIO LAB',
      symbol: '♫',
      color: '#0ea5e9',
      isLocked: true, // 🟢 잠겨있는 프로젝트
    }
  };

  const handleCardClick = (key, app) => {
    if (app.isLocked) {
      // 잠긴 카드를 누르면 흔들림 효과와 함께 안내 문구 표시
      setLockedNotice(key);
      setTimeout(() => setLockedNotice(null), 1500);
      return;
    }
    setActiveApp(key);
  };

  const socials = [
    { name: 'X', url: 'https://x.com', color: '#0284c7' },
    { name: 'INSTAGRAM', url: 'https://instagram.com', color: '#db2777' },
    { name: 'DISCORD', url: 'https://discord.com', color: '#4f46e5' },
  ];

  return (
    <div onMouseMove={handleMouseMove} style={styles.global}>
      <div style={styles.lightLeak} />
      <div style={styles.dotPattern} />

      {/* 부팅 인트로 */}
      <AnimatePresence>
        {!isBooted && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 100, display: 'flex', pointerEvents: 'none' }}>
            <motion.div
              initial={{ x: '0%' }}
              exit={{ x: '-100%', transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] } }}
              style={{ width: '50%', height: '100%', backgroundColor: '#e0f2fe', borderRight: '1px solid rgba(2, 132, 199, 0.1)' }}
            />
            <motion.div
              initial={{ x: '0%' }}
              exit={{ x: '100%', transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] } }}
              style={{ width: '50%', height: '100%', backgroundColor: '#e0f2fe' }}
            />
            <motion.div
              initial={{ opacity: 1, scale: 0.95, filter: 'blur(6px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(0px)', transition: { duration: 0.3 } }}
              style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <div style={{ color: '#0284c7', fontSize: '1.2rem', letterSpacing: '14px', fontWeight: 600 }}>
                LOADING // ARCHIVE
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {!activeApp && (
        <motion.div
          initial={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
          animate={isBooted ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={styles.titleArea}
        >
          <h1 style={{ color: theme.textPrimary, fontSize: '1.4rem', margin: 0, fontWeight: 700, letterSpacing: '4px' }}>ARCHIVE</h1>
          <p style={{ color: theme.textSecondary, marginTop: '6px', fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 500 }}>PROJECT PORTFOLIO</p>
        </motion.div>
      )}

      {!activeApp && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isBooted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={styles.socialLinks}
        >
          {socials.map((soc) => (
            <motion.a
              key={soc.name}
              href={soc.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.08, y: -2 }}
              style={{
                color: theme.textSecondary, fontSize: '0.8rem', letterSpacing: '1px',
                textDecoration: 'none', fontWeight: 600,
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = soc.color}
              onMouseLeave={(e) => e.currentTarget.style.color = theme.textSecondary}
            >
              {soc.name}
            </motion.a>
          ))}
        </motion.div>
      )}

      {/* 잠금 안내 알림 토스트 (잠긴 카드를 클릭했을 때만 표시) */}
      <AnimatePresence>
        {lockedNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            style={{
              position: 'absolute',
              top: '18vh',
              zIndex: 200,
              backgroundColor: '#0284c7',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '30px',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '1px',
              boxShadow: '0 10px 25px rgba(2, 132, 199, 0.4)',
            }}
          >
            🔒 현재 준비 중인 프로젝트입니다 (Locked)
          </motion.div>
        )}
      </AnimatePresence>

      {/* 메인 선택 카드 리스트 */}
      {!activeApp && (
        <motion.div
          style={{
            display: 'flex', gap: '2.5rem', alignItems: 'center', zIndex: 3,
            rotateX: motionRotateX,
            rotateY: motionRotateY,
            transformStyle: 'preserve-3d',
          }}
          initial={{ opacity: 0, scale: 0.92, y: 30, filter: 'blur(10px)' }}
          animate={isBooted ? { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' } : {}}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {Object.entries(apps).map(([key, app]) => (
            <motion.div
              key={key}
              layoutId={!app.isLocked ? `card-${key}` : undefined}
              animate={lockedNotice === key ? { x: [-10, 10, -10, 10, 0] } : {}} // 🟢 잠겼을 때 좌우로 흔들리는 모션
              transition={{ duration: 0.4 }}
              whileHover={!app.isLocked ? { scale: 1.03, y: -8, backgroundColor: 'rgba(255, 255, 255, 0.98)', borderColor: theme.accentColor, boxShadow: `0 25px 50px ${theme.accentGlow}` } : { scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick(key, app)}
              style={{
                width: '280px', height: '380px',
                backgroundColor: app.isLocked ? 'rgba(255, 255, 255, 0.65)' : theme.cardBg, // 잠긴 카드는 살짝 투명하게
                borderRadius: '24px',
                border: `1px solid ${theme.cardBorder}`,
                cursor: app.isLocked ? 'not-allowed' : 'pointer',
                overflow: 'hidden',
                boxShadow: '0 15px 35px rgba(12, 74, 110, 0.08), inset 0 1px 0 rgba(255,255,255,1)',
                backdropFilter: 'blur(20px)',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: app.isLocked ? 0.75 : 1, // 잠긴 카드 시각적 비활성화 느낌
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: app.color, fontSize: '0.7rem', letterSpacing: '2px', fontWeight: 700 }}>{app.tag}</span>
                <div style={{
                  width: '52px', height: '52px',
                  borderRadius: '14px',
                  backgroundColor: 'white',
                  border: `1px solid ${theme.cardBorder}`,
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  fontSize: '1.4rem', fontWeight: 700, fontFamily: 'monospace',
                  color: app.color,
                  boxShadow: '0 4px 10px rgba(12, 74, 110, 0.05)'
                }}>
                  {app.isLocked ? '🔒' : app.symbol} {/* 🟢 잠긴 카드는 자물쇠 아이콘 표시 */}
                </div>
              </div>

              <div>
                <h3 style={{ color: theme.textPrimary, fontSize: '1.6rem', margin: '0 0 10px 0', fontWeight: 700, lineHeight: '1.3' }}>
                  {app.title.split(' // ')[0]}<br/>
                  <span style={{ color: app.color }}>{app.title.split(' // ')[1]}</span>
                </h3>
                <p style={{ color: theme.textSecondary, fontSize: '0.9rem', margin: 0, fontWeight: 400, lineHeight: '1.5' }}>{app.subtitle}</p>
              </div>

              <div style={{ color: app.isLocked ? '#94a3b8' : app.color, fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, letterSpacing: '1px', borderTop: `1px solid ${theme.cardBorder}`, paddingTop: '1.5rem' }}>
                <span>{app.isLocked ? 'LOCKED PROJECT' : 'VIEW PROJECT'}</span>
                <span>{app.isLocked ? '✕' : '→'}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* 선택된 하위 컴포넌트 뷰 */}
      <AnimatePresence>
        {activeApp && (
          <motion.div
            layoutId={`card-${activeApp}`}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 50,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {apps[activeApp].component}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}