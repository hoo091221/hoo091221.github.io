import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function FluidGlowCursor({ isMobile }) {
  if (isMobile) return null;

  const [particles, setParticles] = useState([]);
  const [ripples, setRipples] = useState([]);

  // 마우스 기본 좌표
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // 💡 끈기 있고 부드럽게 따라오는 스프링 설정 (이 부분이 핵심입니다!)
  const springConfig = { damping: 35, stiffness: 120, mass: 0.8 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const lastSpawnTime = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // 마우스가 이동할 때 은은한 잔상 파티클 생성
      const now = Date.now();
      if (now - lastSpawnTime.current > 50) {
        lastSpawnTime.current = now;
        const newParticle = {
          id: Math.random(),
          x: e.clientX + (Math.random() * 30 - 15),
          y: e.clientY + (Math.random() * 30 - 15),
          size: Math.random() * 10 + 6,
        };
        setParticles((prev) => [...prev.slice(-12), newParticle]);
      }
    };

    const handleClick = (e) => {
      // 클릭 시 퍼져나가는 감성적인 링 이펙트
      const newRipple = {
        id: Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      setRipples((prev) => [...prev, newRipple]);

      // 클릭 시 사방으로 튀기는 스타 파티클
      const burst = Array.from({ length: 10 }).map(() => {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 80 + 30;
        return {
          id: Math.random(),
          x: e.clientX,
          y: e.clientY,
          destX: e.clientX + Math.cos(angle) * dist,
          destY: e.clientY + Math.sin(angle) * dist,
          size: Math.random() * 8 + 4,
        };
      });
      setParticles((prev) => [...prev, ...burst]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* 1. 마우스를 따라다니는 메인 빛 번짐 (Glow Aura) */}
      {/* <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          backgroundColor: 'rgba(56, 189, 248, 0.18)',
          boxShadow: '0 0 40px rgba(56, 189, 248, 0.3), inset 0 0 20px rgba(186, 230, 253, 0.4)',
          filter: 'blur(12px)',
          pointerEvents: 'none',
          zIndex: 9997,
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      /> */}

      {/* 2. 정중앙을 잡아주는 선명한 코어 포인트 */}
      {/* <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          boxShadow: '0 0 10px #38bdf8, 0 0 20px #0284c7',
          pointerEvents: 'none',
          zIndex: 10000,
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      /> */}

      {/* 3. 잔상 및 클릭 시 흩뿌려지는 파티클 */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0.8, scale: 1, x: p.x, y: p.y }}
          animate={{
            opacity: 0,
            scale: p.destX ? 0.3 : 0.2,
            x: p.destX || p.x,
            y: p.destY || p.y,
          }}
          transition={{ duration: p.destX ? 0.7 : 0.5, ease: "easeOut" }}
          onAnimationComplete={() => {
            setParticles((prev) => prev.filter((item) => item.id !== p.id));
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: '#e0f2fe',
            boxShadow: '0 0 10px #38bdf8',
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            pointerEvents: 'none',
            zIndex: 9998,
            translateX: '-50%',
            translateY: '-50%',
          }}
        />
      ))}

      {/* 4. 클릭 시 부드럽게 퍼지는 물결/빛 링 */}
      {ripples.map((r) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0.9, scale: 0.2 }}
          animate={{ opacity: 0, scale: 2.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onAnimationComplete={() => {
            setRipples((prev) => prev.filter((item) => item.id !== r.id));
          }}
          style={{
            position: 'fixed',
            top: r.y,
            left: r.x,
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '1.5px solid rgba(186, 230, 253, 0.8)',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            boxShadow: '0 0 25px rgba(56, 189, 248, 0.5)',
            pointerEvents: 'none',
            zIndex: 9999,
            translateX: '-50%',
            translateY: '-50%',
          }}
        />
      ))}
    </>
  );
}