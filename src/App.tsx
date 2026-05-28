import { useReducer, useCallback, useEffect, useState } from 'react';
import { gameReducer, initialState } from './game/reducer';
import { useGameLoop } from './hooks/useGameLoop';
import { Board } from './components/Board';
import { DicePanel } from './components/DicePanel';
import { EventOverlay } from './components/EventOverlay';
import { LearningCard } from './components/LearningCard';
import { EventLog } from './components/EventLog';
import { PlayerStatusBar } from './components/PlayerStatusBar';
import type { CellKind } from './game/types';
import './styles/globals.css';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { startRoll, stepForward } = useGameLoop(state, dispatch);
  const [lastEventKind, setLastEventKind] = useState<CellKind | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [playerCount, setPlayerCount] = useState(2);

  // Show learning card after event resolves
  useEffect(() => {
    if (state.activeEvent && state.activeEvent.type !== 'NONE') {
      setLastEventKind(state.activeEvent.kind);
    }
  }, [state.activeEvent]);

  // Keyboard controls
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
    <div style={{ minHeight: '100vh', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
      {/* Title */}
      <h1 className="title">
        {'반복기호의 마블'.split('').map((ch, i) => (
          <span key={i}>{ch}</span>
        ))}
      </h1>

      {/* Player count selector (only when READY at start) */}
      {state.turnCount === 0 && state.phase === 'READY' && (
        <div style={{ textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontWeight: 700 }}>플레이어 수:</span>
          {[1, 2, 3, 4].map(n => (
            <button
              key={n}
              onClick={() => { setPlayerCount(n); dispatch({ type: 'SET_PLAYER_COUNT', count: n }); }}
              style={{
                padding: '0.3em 0.9em',
                background: playerCount === n ? 'var(--primary)' : '#eee',
                color: playerCount === n ? 'white' : 'var(--ink)',
                fontWeight: 700
              }}
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
        {/* Board */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Board
            players={state.players}
            currentPlayer={state.currentPlayer}
            targetIndex={targetIndex}
          />
          {/* Mobile step button */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
            <button
              className="step-btn step-btn-mobile"
              onClick={stepForward}
              disabled={state.phase !== 'WAITING_STEP' || state.remainingSteps <= 0}
              aria-label="한 칸 이동"
              style={{ display: 'none' }}
            >
              ➡️ 한 칸 이동 (남은: {state.remainingSteps})
            </button>
          </div>
        </div>

        {/* Side panel */}
        <div style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '0.8rem', flexShrink: 0 }}>
          <DicePanel state={state} onRoll={startRoll} onStep={stepForward} />

          {/* Learning card trigger */}
          {lastEventKind && !showCard && state.phase === 'READY' && (
            <button
              onClick={() => setShowCard(true)}
              style={{ background: 'var(--secondary)', color: 'var(--ink)', fontSize: '0.85rem' }}
            >
              📚 기호 카드 보기
            </button>
          )}
          {showCard && (
            <LearningCard kind={lastEventKind} onClose={() => setShowCard(false)} />
          )}

          <EventLog logs={state.eventLog} />

          <button
            onClick={handleReset}
            style={{ background: '#f5f5f5', color: '#666', fontSize: '0.8rem' }}
          >
            🔄 게임 리셋
          </button>
        </div>
      </div>

      {/* Event overlay */}
      <EventOverlay event={state.activeEvent} onDismiss={handleDismissEvent} />

      {/* Game over screen */}
      {state.phase === 'GAME_OVER' && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          zIndex: 200
        }}>
          <div style={{
            background: 'white', borderRadius: '20px', padding: '2rem 3rem',
            textAlign: 'center', animation: 'overlay-pop 0.5s cubic-bezier(.34,1.56,.64,1)'
          }}>
            <div style={{ fontSize: '4rem' }}>🎉</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)', margin: '0.5rem 0' }}>
              {state.players[state.currentPlayer]?.name} 완주!
            </div>
            <div style={{ fontSize: '1rem', color: '#666', marginBottom: '1rem' }}>
              음악 기호를 모두 배웠어요!
            </div>
            <button
              onClick={handleReset}
              style={{ background: 'var(--primary)', color: 'white', fontSize: '1.1rem' }}
            >
              🔄 다시 하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
