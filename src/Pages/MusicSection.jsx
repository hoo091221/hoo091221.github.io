import React, { useState, useRef, useEffect } from "react";

// import "./../CSS/s";

import kawaiiBass1Src from "../sounds/Kawaii_Bass_1.mp3";
import kawaiiBass2Src from "../sounds/Kawaii_Bass_2.mp3";
import anime1Src from "../sounds/Anime_1.mp3";
// import project51Src from "../sounds/Project_5_1.mp3";

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
    Anime_1: [true, true, false, false, true, true, false, false, true, true, false, false, true, true, true, true],
    Project_5_1: [false, false, false, false, true, true, true, true, false, false, false, false, true, true, true, true],
  });

  const mainAudioRef = useRef(null);
  const specIntervalRef = useRef(null);

  // 🎬 1. 화려한 최초 프로그램 부팅 연출 타이머 (모션을 감상할 수 있게 1.1초로 넉넉히 설정)
  // useEffect(() => {
  //   const bootTimer = setTimeout(() => {
  //     setIsBooting(false);
  //   }, 1100);
  //   return () => clearTimeout(bootTimer);
  // }, []);

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
      audio.play().catch(() => { });
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
        mainAudioRef.current.play().catch(() => { });
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

      <style>{`/* FL Studio 24 Workspace Theme */
.fl-workspace {
  width: 92vw;
  height: 88vh;
  display: flex;
  flex-direction: column;
  background-color: #121316;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #c5c5c5;
  border-radius: 10px;
  border: 1px solid #2a2c33;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8);
  overflow: hidden;
  position: relative;
}

.fl-workspace.hidden {
  opacity: 0;
  transform: scale(0.95);
  pointer-events: none;
  transition: opacity 0.4s ease, transform 0.4s ease;
}

/* 부팅 오버레이 */
.fl-boot-loader-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background-color: #0b0c0e;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  font-family: Consolas, monospace;
}
.boot-logo-text { font-size: 24px; font-weight: 800; color: #ff8800; letter-spacing: 4px; margin-bottom: 8px; }
.boot-status-text { font-size: 11px; color: #666; letter-spacing: 2px; margin-bottom: 20px; }
.boot-progress-bar-rack { width: 200px; height: 4px; background: #222; border-radius: 2px; overflow: hidden; }
.boot-progress-fill { width: 100%; height: 100%; background: #ff8800; animation: bootLoad 1.1s ease-in-out forwards; }
@keyframes bootLoad { 0% { transform: translateX(-100%); } 100% { transform: translateX(0); } }

/* 상단 툴바 */
.fl-dashboard-header {
  height: 52px;
  background: linear-gradient(to bottom, #252830, #1a1c22);
  border-bottom: 1px solid #000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  flex-shrink: 0;
}
.fl-toolbar-left { display: flex; align-items: center; gap: 12px; }
.fl-back-trigger {
  background: #2d303b; border: 1px solid #444; color: #ff5f56;
  font-size: 10px; font-weight: 700; padding: 5px 10px; border-radius: 3px; cursor: pointer;
}
.fl-desktop-logo { font-weight: 800; color: #ff8800; letter-spacing: 1px; }

/* LCD 모니터 */
.fl-lcd-monitor {
  background: #000; border: 1px solid #333; border-radius: 3px;
  display: flex; padding: 2px 8px; gap: 10px; align-items: center;
}
.lcd-cell { display: flex; flex-direction: column; }
.cell-title { color: #666; font-weight: 700; }
.cell-data { color: #ff8800; font-family: Consolas, monospace; font-weight: bold; }
.lcd-bpm-input {
  background: transparent; border: none; color: #ff8800; font-family: Consolas, monospace;
  font-size: 11px; font-weight: bold; width: 36px; outline: none;
}

/* 중앙 트랜스포트 랙 */
.fl-toolbar-center-console { display: flex; align-items: center; gap: 14px; }
.fl-desktop-transport-rack { display: flex; gap: 3px; background: #111; padding: 3px; border-radius: 3px; border: 1px solid #333; }
.desktop-node {
  background: #262932; border: 1px solid #3a3d4a; color: #aaa;
  width: 24px; height: 22px; font-size: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 2px;
}
.desktop-node.on { background: #ff8800; color: #000; border-color: #ffa533; font-weight: bold; }

/* 타임라인 슬라이더 */
.fl-desktop-song-slider-container { display: flex; align-items: center; gap: 8px; background: #15161a; padding: 4px 10px; border-radius: 4px; border: 1px solid #282a33; }
.fl-song-timeline-slider { width: 140px; accent-color: #ff8800; cursor: pointer; height: 4px; }
.slider-time-badge { color: #00ff66; font-family: Consolas, monospace; font-weight: bold; }

/* 스펙트로그램 */
.fl-spectrogram-rack { background: #000; border: 1px solid #222; border-radius: 3px; padding: 4px 8px; display: flex; align-items: center; }
.spec-bars-container { display: flex; align-items: flex-end; height: 100%; }
.spec-bar-node { border-radius: 1px 1px 0 0; transition: height 0.05s ease; }

/* 바디 및 브라우저 */
.fl-body-panel { flex: 1; display: flex; overflow: hidden; background: #181a20; }
.fl-sidebar-browser { width: 180px; background: #14151a; border-right: 1px solid #282a33; display: flex; flex-direction: column; }
.browser-header { padding: 10px; font-weight: bold; border-bottom: 1px solid #222; }
.browser-file-list { flex: 1; overflow-y: auto; padding: 6px; }
.browser-item {
  padding: 6px 10px; font-size: 11px; cursor: pointer; border-radius: 3px; margin-bottom: 2px; color: #999;
}
.browser-item:hover { background: #222530; color: #fff; }
.browser-item.active { background: #262a38; color: #00ff66; font-weight: bold; border-left: 3px solid #00ff66; }

/* 플레이리스트 에디터 */
.fl-playlist-editor { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: #1e2028; }
.fl-playlist-timeline-header { height: 26px; background: #16181f; border-bottom: 1px solid #2d313d; display: flex; align-items: center; }
.fl-track-header-spacer { width: 110px; padding-left: 10px; font-size: 10px; color: #666; font-weight: bold; border-right: 1px solid #2d313d; }
.fl-timeline-bars-rail { flex: 1; display: flex; position: relative; height: 100%; align-items: center; }
.fl-bar-number { flex: 1; font-size: 9px; color: #555; text-align: center; border-right: 1px solid #252833; font-family: Consolas, monospace; }
.fl-bar-number.highlight { color: #ff8800; font-weight: bold; background: rgba(255,136,0,0.1); }
.fl-playlist-laser-line { position: absolute; top: 0; bottom: 0; width: 2px; z-index: 10; pointer-events: none; box-shadow: 0 0 8px #00ff66; }

.fl-playlist-rows-stack { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
.fl-playlist-row { display: flex; height: 38px; border-bottom: 1px solid #242732; background: #1a1c24; }
.fl-playlist-row.focused { background: #1e212b; }
.fl-track-name-card { width: 110px; background: #15171e; border-right: 1px solid #2a2d39; display: flex; align-items: center; padding: 0 8px; gap: 6px; cursor: pointer; }
.fl-track-color-bar { width: 4px; height: 20px; border-radius: 2px; }
.fl-track-title-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: Consolas, monospace; }

.fl-playlist-clips-grid { flex: 1; display: flex; }
.fl-playlist-cell { flex: 1; border-right: 1px solid #222530; display: flex; align-items: center; padding: 2px; cursor: pointer; }
.fl-playlist-cell.beat-line { border-right-color: #333844; }
.fl-audio-clip-block { width: 100%; height: 28px; border-radius: 3px; display: flex; align-items: center; padding-left: 6px; box-sizing: border-box; }
.fl-audio-clip-block.pulse-active { filter: brightness(1.4); box-shadow: 0 0 10px rgba(255,255,255,0.3); }
.clip-wave-label { font-family: Consolas, monospace; color: rgba(255,255,255,0.7); font-weight: bold; }

/* 하단 채널 랙 & 믹서 */
.fl-studio-hardware-container { height: 110px; background: #121317; border-top: 1px solid #2a2c35; display: flex; padding: 8px; gap: 10px; flex-shrink: 0; }
.fl-channel-rack { background: #171920; border: 1px solid #282b36; border-radius: 4px; padding: 6px; display: flex; flex-direction: column; gap: 4px; }
.rack-title { font-size: 9px; font-weight: bold; color: #777; margin-bottom: 2px; }
.channel-row { display: flex; align-items: center; gap: 6px; background: #1e212a; padding: 2px 6px; border-radius: 3px; }
.channel-led { width: 6px; height: 6px; border-radius: 50%; background: #333; }
.channel-led.active { background: #00ff66; box-shadow: 0 0 6px #00ff66; }
.channel-name { font-family: Consolas, monospace; color: #bbb; width: 70px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.fl-mixer-board { background: #171920; border: 1px solid #282b36; border-radius: 4px; display: flex; padding: 6px; gap: 8px; overflow-x: auto; }
.mixer-strip { width: 38px; background: #111216; border: 1px solid #222; border-radius: 3px; display: flex; flex-direction: column; align-items: center; padding: 4px 0; gap: 4px; position: relative; }
.mixer-strip.active { border-color: #444; background: #15171d; }
.mixer-strip.master { border-color: #ff8800; background: #1a1815; }
.mixer-db-meter { width: 5px; flex: 1; background: #08080a; border-radius: 2px; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; }
.meter-fill { width: 100%; background: linear-gradient(to top, #00ff66, #ffcc00, #ff3333); transition: height 0.08s ease; }
.fader-runway { width: 4px; height: 35px; background: #0a0a0c; position: relative; border-radius: 2px; }
.fader-handle { position: absolute; left: -4px; width: 12px; height: 6px; background: #777; border-radius: 2px; border: 1px solid #999; }
.mixer-label { font-size: 9px; font-family: Consolas, monospace; color: #888; font-weight: bold; }
`}</style>

      {/* 🎬 런처 감성 가상 시네마틱 부팅 오버레이 */}
      {/* {isBooting && (
        <div className="fl-boot-loader-overlay">
          <div className="boot-logo-text">FL STUDIO 24</div>
          <div className="boot-status-text">INITIALIZING CORE DIGITAL AUDIO ENGINE...</div>
          <div className="boot-progress-bar-rack">
            <div className="boot-progress-fill" />
          </div>
        </div>
      )} */}

      {/* 💻 데스크톱 메인 프레임 */}
      <div className={`sub-panel fl-workspace ${isExiting ? "hidden" : ""}`} style={{ overflowY: "auto" }}>

        {/* 상단 툴바 랙 */}
        <header className={`fl-dashboard-header ${isPlaying ? "playing-glow" : ""}`}>
          <div className="fl-toolbar-left">
            <button className="fl-back-trigger" onClick={handleAnimateBack}>↩ EXIT</button>
            <div className="fl-desktop-logo" style={{ fontSize: '11px' }}>FL STUDIO 26</div>

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
              <button className="desktop-node stop" onClick={() => { setIsPlaying(false); if (mainAudioRef.current) mainAudioRef.current.currentTime = 0; setAudioProgress(0); setCurrentBar(0); }}>■</button>
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