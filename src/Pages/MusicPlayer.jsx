import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// 💡 Vite가 빌드 시 경로를 완벽하게 잡아주도록 import 방식을 사용합니다.
import bgmFile from './background.mp3'; // MusicPlayer.jsx와 같은 폴더(src/Pages/)에 있다고 가정

export default function MusicPlayer({ isPlaying, setIsPlaying, shouldMute }) {
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);

  useEffect(() => {
    // import한 변수를 전달
    audioRef.current = new Audio(bgmFile);
    audioRef.current.loop = true;
    audioRef.current.volume = 0; // 초기 볼륨 0에서 시작

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, []);

  // 💡 부드러운 페이드인 / 페이드아웃 볼륨 조절 함수
  const fadeAudio = (targetVolume, onComplete) => {
    if (!audioRef.current) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    const audio = audioRef.current;
    const stepTime = 30; // 30ms 간격
    const totalDuration = 600; // 0.6초 동안 전환
    const steps = totalDuration / stepTime;
    const volumeStep = (targetVolume - audio.volume) / steps;

    let currentStep = 0;

    if (targetVolume > 0 && audio.paused && isPlaying) {
      audio.play().catch((err) => console.log("오디오 재생 오류:", err));
    }

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      let newVol = audio.volume + volumeStep;

      if (currentStep >= steps) {
        newVol = targetVolume;
        audio.volume = newVol;
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;

        if (targetVolume === 0) {
          audio.pause();
        }
        if (onComplete) onComplete();
      } else {
        audio.volume = Math.max(0, Math.min(1, newVol));
      }
    }, stepTime);
  };

  // FL 스튜디오 진입(shouldMute) 또는 플레이어 토글에 따른 볼륨 변화 연동
  useEffect(() => {
    if (!audioRef.current) return;

    if (shouldMute) {
      // FL 스튜디오로 들어갈 때 페이드아웃 후 일시정지
      fadeAudio(0);
    } else if (isPlaying) {
      // 메인 화면으로 돌아왔고 재생 중일 때 페이드인
      fadeAudio(0.4);
    }
  }, [shouldMute, isPlaying]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      fadeAudio(0, () => setIsPlaying(false));
    } else {
      setIsPlaying(true);
      fadeAudio(0.4);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      style={{
        // 💡 내부 고정 위치(fixed, bottom, right)를 제거하고 외부 래퍼가 위치를 제어하도록 변경
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(2, 132, 199, 0.2)',
        padding: '8px 16px',
        borderRadius: '30px',
        boxShadow: '0 10px 30px rgba(12, 74, 110, 0.15)',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onClick={togglePlay}
      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.98)' }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={isPlaying && !shouldMute ? { rotate: 360 } : { rotate: 0 }}
        transition={isPlaying && !shouldMute ? { duration: 3, repeat: Infinity, ease: "linear" } : {}}
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#0284c7',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#ffffff',
          fontSize: '0.9rem',
          boxShadow: '0 0 10px rgba(2, 132, 199, 0.4)',
        }}
      >
        ♫
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0c4a6e', letterSpacing: '1px' }}>
          {shouldMute ? 'FL STUDIO LAB' : isPlaying ? 'NOW PLAYING' : 'SOUND LAB'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '10px' }}>
          {[1, 2, 3, 4].map((bar) => (
            <motion.div
              key={bar}
              animate={isPlaying && !shouldMute ? { height: ['4px', '12px', '4px'] } : { height: '4px' }}
              transition={{
                duration: 0.4,
                repeat: Infinity,
                repeatType: "reverse",
                delay: bar * 0.15,
              }}
              style={{
                width: '3px',
                backgroundColor: isPlaying && !shouldMute ? '#38bdf8' : '#cbd5e1',
                borderRadius: '2px',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}