import { useReducer, useCallback, useEffect, useState } from 'react';
import { gameReducer, initialState } from './game/reducer';
import { useGameLoop } from './hooks/useGameLoop';
import { Board } from './components/Board';
import { DicePanel } from './components/DicePanel';
import { EventOverlay } from './components/EventOverlay';
import { LearningCard } from './components/LearningCard';
import { EventLog } from './components/EventLog';
import { PlayerStatusBar } from './components/PlayerStatusBar';
import { BackgroundParticles } from './components/BackgroundParticles';
import type { CellKind } from './game/types';
import './styles/globals.css';
import './styles/board.css';
import './styles/animations.css';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { startRoll, stepForward } = useGameLoop(state, dispatch);
  const [lastEventKind, setLastEventKind] = useState<CellKind | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [playerCount, setPlayerCount] = useState(2);

  useEffect(() => {
    if (state.activeEvent && state.activeEvent.type !== 'NONE') {
      setLastEventKind(state.activeEvent.kind);
    }
  }, [state.activeEvent]);

  // confetti on game over
  useEffect(() => {
    if (state.phase !== 'GAME_OVER') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';
    script.onload = () => {
      const confetti = (window as unknown as { confetti: (opts: object) => void }).confetti;
      const end = Date.now() + 4000;
      const frame = () => {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ffd700','#ff4d6d','#4d9fff'] });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ffd700','#ff4d6d','#4d9fff'] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    };
    document.head.appendChild(script);
  }, [state.phase]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); stepForward(); }
      if ((e.key === ' ' || e.key === 'Enter') && state.phase === 'READY') { e.preventDefault(); startRoll(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [stepForward, startRoll, state.phase]);

  const handleDismissEvent = useCallback(() => {
    if (state.activeEvent?.type === 'GAME_FINISH') return;
  }, [state.activeEvent]);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET_GAME', playerCount });
    setLastEventKind(null);
    setShowCard(false);
  }, [playerCount]);

  const targetIndex = state.activeEvent?.targetIndex;

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      <BackgroundParticles />

      {/* Title */}
      <h1 style={{ textAlign: 'center', padding: '0.3rem 0' }}>
        <span className="text-title">반복기호의 마블</span>
      </h1>

      {/* Player count selector */}
      {state.turnCount === 0 && state.phase === 'READY' && (
        <div style={{ textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, color: 'rgba(26,22,56,0.65)', fontSize: '0.9rem' }}>플레이어:</span>
          {[1, 2, 3, 4].map(n => (
            <button
              key={n}
              className={`count-btn ${playerCount === n ? 'count-btn--active' : 'count-btn--inactive'}`}
              onClick={() => { setPlayerCount(n); dispatch({ type: 'SET_PLAYER_COUNT', count: n }); }}
            >
              {n}명
            </button>
          ))}
        </div>
      )}

      {/* Player status */}
      <PlayerStatusBar players={state.players} currentPlayer={state.currentPlayer} />

      {/* Main layout */}
      <div className="game-layout" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Board section */}
        <div className="board-section" style={{ flex: 1, minWidth: 0 }}>
          <Board
            players={state.players}
            currentPlayer={state.currentPlayer}
            targetIndex={targetIndex}
          />
        </div>

        {/* Side panel */}
        <div style={{ width: '210px', display: 'flex', flexDirection: 'column', gap: '0.8rem', flexShrink: 0 }}>
          <DicePanel state={state} onRoll={startRoll} onStep={stepForward} />

          {lastEventKind && !showCard && state.phase === 'READY' && (
            <button
              className="btn-3d btn-gold"
              onClick={() => setShowCard(true)}
              style={{ fontSize: '0.82rem', padding: '0.55em 1em' }}
            >
              📚 기호 카드 보기
            </button>
          )}
          {showCard && (
            <LearningCard kind={lastEventKind} onClose={() => setShowCard(false)} />
          )}

          <EventLog logs={state.eventLog} />

          <button
            className="btn-3d"
            onClick={handleReset}
            style={{
              background: 'rgba(26,22,56,0.07)', color: 'rgba(26,22,56,0.5)',
              fontSize: '0.78rem', padding: '0.5em 1em',
              boxShadow: '0 3px 0 rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)',
            }}
          >
            🔄 게임 리셋
          </button>
        </div>
      </div>

      {/* Event overlay */}
      <EventOverlay event={state.activeEvent} onDismiss={handleDismissEvent} />

      {/* Victory screen */}
      {state.phase === 'GAME_OVER' && (
        <div className="victory-backdrop">
          <div className="victory-modal">
            <div className="victory-crown">👑</div>
            <div className="victory-title">완주!</div>
            <div className="victory-name">{state.players[state.currentPlayer]?.name}</div>
            <div className="victory-sub">🎵 모든 음악 기호를 마스터했어요!</div>
            <div className="victory-stats">총 {state.turnCount}턴 소요</div>
            <button className="btn-3d btn-gold victory-btn" onClick={handleReset}>
              🔄 다시 하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
