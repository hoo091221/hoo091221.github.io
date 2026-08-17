import React, { useState, useRef, useEffect } from "react";

import kawaiiBass1Src from "../sounds/Kawaii_Bass_1.mp3";
import kawaiiBass2Src from "../sounds/Kawaii_Bass_2.mp3";
import anime1Src from "../sounds/Anime_1.mp3";
import project51Src from "../sounds/Project_5_1.mp3";

const playlistTracks = [
  { id: "Kawaii_Bass_1", name: "🎹 Kawaii_Bass_1", file: kawaiiBass1Src, color: "#00ff66", defaultBpm: 190 },
  // { id: "Kawaii_Bass_2", name: "⚡ Kawaii_Bass_2", file: kawaiiBass2Src, color: "#00ccff", defaultBpm: 170 },
  // { id: "Anime_1", name: "✨ Anime_1 (Synth Lead)", file: anime1Src, color: "#ff007f", defaultBpm: 160 },
  // { id: "Project_5_1", name: "⭐ Project_5_1 (Original)", file: project51Src, color: "#ffaa00", defaultBpm: 170 },
];

const TOTAL_BARS = 16;
const VISUALIZER_BARS_COUNT = 10; 

export default function MusicSection({ onBack }) {
  const [isBooting, setIsBooting] = useState(true); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(playlistTracks[0].defaultBpm); 
  const [currentBar, setCurrentBar] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState(playlistTracks[0]);
  const [spectrogramHeights, setSpectrogramHeights] = useState(Array(VISUALIZER_BARS_COUNT).fill(15));
  const [isExiting, setIsExiting] = useState(false);

  // 🎯 노래 전체 진행도 추적 상태 파츠 추가
  const [audioProgress, setAudioProgress] = useState(0); // 0 ~ 100 (%)
  const [timeDisplay, setTimeDisplay] = useState("0:00");

  const [mixerMeters, setMixerMeters] = useState({
    MASTER: 10, Kawaii_Bass_1: 5, Kawaii_Bass_2: 5, Anime_1: 5, Project_5_1: 5
  });

  const [playlistGrid, setPlaylistGrid] = useState({
    Kawaii_Bass_1: [true, false, true, false, true, false, true, true, false, true, true, false, true, false, true, true],
    Kawaii_Bass_2: [false, true, false, true, false, true, false, false, true, false, false, true, false, true, false, false],
    Anime_1:       [true, true, false, false, true, true, false, false, true, true, false, false, true, true, true, true],
    Project_5_1:   [false, false, false, false, true, true, true, true, false, false, false, false, true, true, true, true],
  });

  const mainAudioRef = useRef(null);
  const specIntervalRef = useRef(null);

  // 🎬 1. 화려한 최초 프로그램 부팅 연출 타이머 (모션을 감상할 수 있게 1.1초로 넉넉히 설정)
  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setIsBooting(false);
    }, 1100);
    return () => clearTimeout(bootTimer);
  }, []);

  // 🔄 2. 음원 스위칭 및 상태 세팅 엔진
  useEffect(() => {
    if (mainAudioRef.current) {
      mainAudioRef.current.pause();
    }
    
    mainAudioRef.current = new Audio(selectedTrack.file);
    
    // 🛑 [요청 반영 핵심]: 무한 반복(loop = true) 해제 ➡️ 단 한 번만 재생되도록 설정!
    mainAudioRef.current.loop = false; 
    
    setBpm(selectedTrack.defaultBpm);
    setAudioProgress(0);
    setTimeDisplay("0:00");

    // 🎧 실시간 오디오 이벤트 리스너 바인딩 구역
    const audio = mainAudioRef.current;

    const handleTimeUpdate = () => {
      if (!audio.duration) return;
      // 1. 상단 바 전체 길이에 맞춰 백분율 계산 연산
      const progress = (audio.currentTime / audio.duration) * 100;
      setAudioProgress(progress);

      // 2. 타이머 라벨 텍스트 가공 (분:초)
      const mins = Math.floor(audio.currentTime / 60);
      const secs = Math.floor(audio.currentTime % 60);
      setTimeDisplay(`${mins}:${String(secs).padStart(2, "0")}`);

      // 3. 현재 재생 시점을 마디 격자(0~15)와 유기적 싱크 매핑
      const barRatio = audio.currentTime / audio.duration;
      const calculatedBar = Math.floor(barRatio * TOTAL_BARS) % TOTAL_BARS;
      setCurrentBar(calculatedBar);
    };

    // 🛑 [요청 반영 핵심]: 노래가 끝나면 무한 루프 돌지 않고 알아서 멈추는 리스너 트리거
    const handleAudioEnded = () => {
      setIsPlaying(false);
      setCurrentBar(0);
      setAudioProgress(0);
      setTimeDisplay("0:00");
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleAudioEnded);

    if (isPlaying) {
      audio.play().catch(() => {});
    }

    document.body.style.backgroundColor = "#16171b";

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleAudioEnded);
      audio.pause();
    };
  }, [selectedTrack]);

  // ⏱️ 3. 오디오 믹서 미터 및 스펙트로그램 파형 애니메이터
  useEffect(() => {
    let mixerIntervalId = null;

    if (isPlaying) {
      if (mainAudioRef.current) {
        mainAudioRef.current.play().catch(() => {});
      }

      // 오디오 파형 리드미컬 출렁임 처리
      mixerIntervalId = setInterval(() => {
        const nextBar = currentBar;
        const updatedMeters = { MASTER: 30 };
        playlistTracks.forEach(t => {
          if (playlistGrid[t.id][nextBar]) {
            updatedMeters[t.id] = Math.floor(Math.random() * 60) + 40;
            updatedMeters.MASTER = Math.max(updatedMeters.MASTER, updatedMeters[t.id] + 15);
          } else {
            updatedMeters[t.id] = Math.floor(Math.random() * 15) + 5;
          }
        });
        setMixerMeters(updatedMeters);
      }, 100);

      specIntervalRef.current = setInterval(() => {
        setSpectrogramHeights(
          Array(VISUALIZER_BARS_COUNT).fill(0).map(() => Math.floor(Math.random() * 25) + 5)
        );
      }, 50);

    } else {
      if (mainAudioRef.current) {
        mainAudioRef.current.pause();
      }
      if (mixerIntervalId) clearInterval(mixerIntervalId);
      if (specIntervalRef.current) clearInterval(specIntervalRef.current);
      setSpectrogramHeights(Array(VISUALIZER_BARS_COUNT).fill(4));
      setMixerMeters({ MASTER: 5, Kawaii_Bass_1: 0, Kawaii_Bass_2: 0, Anime_1: 0, Project_5_1: 0 });
    }

    return () => {
      if (mixerIntervalId) clearInterval(mixerIntervalId);
      if (specIntervalRef.current) clearInterval(specIntervalRef.current);
    };
  }, [isPlaying, currentBar, playlistGrid]);

  // 🎞️ [요청 반영 핵심]: 상단바 슬라이더 드래그 시 곡 전체 길이에 맞춰 정밀 스크럽 수동 탐색
  const handleSliderScrub = (e) => {
    const targetPercent = Number(e.target.value);
    setAudioProgress(targetPercent);
    
    if (mainAudioRef.current && mainAudioRef.current.duration) {
      const targetTime = (targetPercent / 100) * mainAudioRef.current.duration;
      mainAudioRef.current.currentTime = targetTime;
    }
  };

  const handleAnimateBack = () => {
    setIsExiting(true);
    if (mainAudioRef.current) mainAudioRef.current.pause();
    setTimeout(() => { onBack(); }, 400); 
  };

  const handleGridClick = (trackId, index) => {
    setPlaylistGrid(prev => ({
      ...prev,
      [trackId]: prev[trackId].map((val, i) => i === index ? !val : val)
    }));
  };

  return (
    <>
      {/* 🎬 런처 감성 가상 시네마틱 부팅 오버레이 */}
      {isBooting && (
        <div className="fl-boot-loader-overlay">
          <div className="boot-logo-text">FL STUDIO 24</div>
          <div className="boot-status-text">INITIALIZING CORE DIGITAL AUDIO ENGINE...</div>
          <div className="boot-progress-bar-rack">
            <div className="boot-progress-fill" />
          </div>
        </div>
      )}

      {/* 💻 데스크톱 메인 프레임 */}
      <div className={`sub-panel fl-workspace ${isExiting ? "hidden" : ""}`} style={{ overflowY: "auto" }}>
        
        {/* 상단 툴바 랙 */}
        <header className={`fl-dashboard-header ${isPlaying ? "playing-glow" : ""}`}>
          <div className="fl-toolbar-left">
            <button className="fl-back-trigger" onClick={handleAnimateBack}>↩ EXIT</button>
            <div className="fl-desktop-logo" style={{ fontSize: '11px' }}>FL STUDIO 24</div>
            
            <div className="fl-lcd-monitor" style={{ minWidth: "120px" }}>
              <div className="lcd-cell">
                <span className="cell-title" style={{ fontSize: '6px' }}>BPM</span>
                <input type="number" className="lcd-bpm-input" value={bpm} onChange={(e) => setBpm(Number(e.target.value))} />
              </div>
              <div className="lcd-cell">
                <span className="cell-title" style={{ fontSize: '6px' }}>TARGET</span>
                <span className="cell-data green" style={{ fontSize: '9px' }}>{selectedTrack.id}</span>
              </div>
            </div>
          </div>

          {/* 🎯 [중앙 트랜스포트 랙]: 노래 전체 길이에 맞춘 프로그레스 슬라이더 래핑 */}
          <div className="fl-toolbar-center-console">
            <div className="fl-desktop-transport-rack">
              <button className={`desktop-node play ${isPlaying ? "on" : ""}`} onClick={() => setIsPlaying(true)}>▶</button>
              <button className={`desktop-node pause ${!isPlaying && audioProgress > 0 ? "on" : ""}`} onClick={() => setIsPlaying(false)}>⏸</button>
              <button className="desktop-node stop" onClick={() => { setIsPlaying(false); if(mainAudioRef.current) mainAudioRef.current.currentTime = 0; setAudioProgress(0); setCurrentBar(0); }}>■</button>
            </div>

            {/* 🔥 노래 실제 길이를 0% ~ 100% 비율로 정밀 제어하는 타임 슬라이더 리얼 피드백 */}
            <div className="fl-desktop-song-slider-container">
              <input 
                type="range" 
                className="fl-song-timeline-slider"
                min="0" 
                max="100" 
                step="0.1"
                value={audioProgress} 
                onChange={handleSliderScrub}
              />
              <span className="slider-time-badge" style={{ fontSize: '9px' }}>{timeDisplay}</span>
            </div>
          </div>

          {/* 스펙트럼 아날로그 이퀄라이저 */}
          <div className="fl-spectrogram-rack" style={{ height: "30px", margin: 0 }}>
            <div className="spec-bars-container" style={{ gap: "2px" }}>
              {spectrogramHeights.map((height, idx) => (
                <div key={idx} className="spec-bar-node" style={{ height: `${height}px`, width: "4px", backgroundColor: "#00ff66" }} />
              ))}
            </div>
          </div>
        </header>

        {/* 메인 바디 패널 */}
        <div className="fl-body-panel">
          <aside className="fl-sidebar-browser">
            <div className="browser-header" style={{ color: "#00ff66", fontSize: '10px' }}>📁 Browser &gt; Packs</div>
            <div className="browser-file-list">
              {playlistTracks.map(t => (
                <div 
                  key={t.id} 
                  className={`browser-item ${selectedTrack.id === t.id ? "active" : ""}`} 
                  onClick={() => setSelectedTrack(t)}
                >
                  {selectedTrack.id === t.id ? "🟢" : "💿"} {t.id}
                </div>
              ))}
            </div>
          </aside>

          {/* 플레이리스트 에디터 레일 */}
          <div className="fl-playlist-editor">
            <div className="fl-playlist-timeline-header">
              <div className="fl-track-header-spacer">Track</div>
              <div className="fl-timeline-bars-rail">
                {Array.from({ length: TOTAL_BARS }).map((_, idx) => (
                  <div key={idx} className={`fl-bar-number ${currentBar === idx && isPlaying ? "highlight" : ""}`}>
                    {idx + 1}
                  </div>
                ))}
                {isPlaying && (
                  <div className="fl-playlist-laser-line" style={{ backgroundColor: "#00ff66", left: `${audioProgress}%` }} />
                )}
              </div>
            </div>

            <div className="fl-playlist-rows-stack">
              {playlistTracks.map((track) => (
                <div key={track.id} className={`fl-playlist-row ${selectedTrack.id === track.id ? "focused" : ""}`}>
                  <div className="fl-track-name-card" onClick={() => setSelectedTrack(track)}>
                    <div className="fl-track-color-bar" style={{ backgroundColor: track.color }} />
                    <span className="fl-track-title-text" style={{ fontSize: '10px', color: selectedTrack.id === track.id ? "#00ff66" : "" }}>
                      {track.id}.mp3
                  </span>
                  </div>

                  <div className="fl-playlist-clips-grid">
                    {playlistGrid[track.id].map((hasBlock, index) => {
                      const isHitting = isPlaying && currentBar === index;
                      return (
                        <div key={index} className={`fl-playlist-cell ${index % 4 === 0 ? "beat-line" : ""}`} onClick={() => handleGridClick(track.id, index)}>
                          {hasBlock && (
                            <div 
                              className={`fl-audio-clip-block ${isHitting ? "pulse-active" : ""}`}
                              style={{ 
                                backgroundColor: track.color + (isHitting ? "66" : "22"), 
                                borderLeft: `3px solid ${track.color}`
                              }}
                            >
                              <span className="clip-wave-label" style={{ fontSize: '8px' }}>wav</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 미디 하드웨어 및 믹서 */}
        <div className="fl-studio-hardware-container">
          <div style={{ display: "flex", gap: "15px" }}>
            <div className="fl-channel-rack" style={{ flex: 1 }}>
              <div className="rack-title">◽ CHANNEL RACK</div>
              {playlistTracks.map(t => (
                <div key={t.id} className="channel-row">
                  <div className={`channel-led ${isPlaying && playlistGrid[t.id][currentBar] ? "active" : ""}`} />
                  <div className="channel-name" style={{ fontSize: '10px' }}>{t.id}</div>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} style={{ width: "10px", height: "8px", backgroundColor: i % 2 === 0 ? "#444" : "#666" }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="fl-mixer-board" style={{ flex: 2 }}>
              <div className="mixer-strip master active">
                <div className="mixer-db-meter">
                  <div className="meter-fill" style={{ height: `${mixerMeters.MASTER}%` }} />
                </div>
                <div className="fader-runway">
                  <div className="fader-handle" style={{ bottom: "45px", backgroundColor: "#00ff66" }} />
                </div>
                <span className="mixer-label" style={{ color: "#00ff66" }}>MASTER</span>
              </div>

              {playlistTracks.map((t, idx) => {
                const isActiveChannel = isPlaying && playlistGrid[t.id][currentBar];
                return (
                  <div key={t.id} className={`mixer-strip ${isActiveChannel ? "active" : ""}`}>
                    <div className="mixer-db-meter">
                      <div className="meter-fill" style={{ height: `${mixerMeters[t.id] || 5}%` }} />
                    </div>
                    <div className="fader-runway">
                      <div className="fader-handle" style={{ bottom: `${30 + (idx * 6)}px` }} />
                    </div>
                    <span className="mixer-label">IN {idx + 1}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}