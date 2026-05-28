import React, { useState, useEffect } from 'react';
import type { GameState } from '../game/types';

interface Props {
  state: GameState;
  onRoll: () => void;
  onStep: () => void;
}

const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

export const DicePanel: React.FC<Props> = ({ state, onRoll, onStep }) => {
  const { phase, diceValue, remainingSteps, players, currentPlayer } = state;
  const player = players[currentPlayer];
  const [displayValue, setDisplayValue] = useState<number>(1);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    if (phase === 'ROLLING') {
      setRolling(true);
      const interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 80);
      return () => clearInterval(interval);
    } else {
      setRolling(false);
      if (diceValue !== null) setDisplayValue(diceValue);
    }
  }, [phase, diceValue]);

  const canRoll = phase === 'READY';
  const canStep = phase === 'WAITING_STEP' && remainingSteps > 0;

  return (
    <div className="control-panel">
      {/* Current player indicator */}
      <div style={{
        background: player.color,
        color: 'white',
        borderRadius: '999px',
        padding: '0.4em 1em',
        fontWeight: 900,
        textAlign: 'center',
        fontSize: '0.9rem'
      }}>
        {player.name}의 차례
      </div>

      {/* Dice display */}
      <div className={`dice-cube ${rolling ? 'dice-cube--rolling' : ''}`}>
        {diceValue !== null || rolling
          ? DICE_FACES[displayValue - 1]
          : '🎲'}
      </div>

      {/* Remaining steps */}
      {remainingSteps > 0 && (
        <div className="remaining-steps">
          남은 이동: {remainingSteps}칸
        </div>
      )}

      {/* Hint */}
      {canStep && (
        <div style={{ fontSize: '0.78rem', color: '#666', textAlign: 'center' }}>
          → 버튼으로 한 칸씩 이동하세요
        </div>
      )}

      {/* Roll button */}
      <button
        className="dice-btn"
        onClick={onRoll}
        disabled={!canRoll}
        aria-label="주사위 굴리기"
      >
        🎲 주사위 굴리기
      </button>

      {/* Step button */}
      <button
        className="step-btn"
        onClick={onStep}
        disabled={!canStep}
        aria-label="한 칸 이동"
      >
        ➡️ 한 칸 이동
      </button>

      {/* Skip info */}
      {player.skipTurns > 0 && (
        <div style={{ fontSize: '0.8rem', color: '#ef476f', textAlign: 'center', fontWeight: 700 }}>
          ⏸️ 페르마타 남은 쉬기: {player.skipTurns}번
        </div>
      )}
    </div>
  );
};
