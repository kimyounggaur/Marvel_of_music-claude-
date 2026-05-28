import React, { useState, useEffect } from 'react';
import type { GameState } from '../game/types';
import { Dice3D } from './Dice3D';

interface Props {
  state: GameState;
  onRoll: () => void;
  onStep: () => void;
}

const PLAYER_EMOJI = ['🐱','🐶','🐸','🐻'];

export const DicePanel: React.FC<Props> = ({ state, onRoll, onStep }) => {
  const { phase, diceValue, remainingSteps, players, currentPlayer } = state;
  const player = players[currentPlayer];
  const [displayValue, setDisplayValue] = useState<number>(1);
  const [rolling, setRolling] = useState(false);

  useEffect(() => {
    if (phase === 'ROLLING') {
      setRolling(true);
      const interval = setInterval(() => setDisplayValue(Math.floor(Math.random() * 6) + 1), 80);
      return () => clearInterval(interval);
    } else {
      setRolling(false);
      if (diceValue !== null) setDisplayValue(diceValue);
    }
  }, [phase, diceValue]);

  const canRoll = phase === 'READY';
  const canStep = phase === 'WAITING_STEP' && remainingSteps > 0;

  return (
    <div className="hud-panel">
      <div className="hud-player-row">
        <div className="hud-avatar" style={{ background: player.color }}>
          {PLAYER_EMOJI[player.id] ?? '⭐'}
        </div>
        <div className="hud-player-info">
          <span className="hud-player-name">{player.name}</span>
          <span className="hud-player-pos">📍 {player.position}번 칸</span>
        </div>
        {player.skipTurns > 0 && (
          <div className="hud-skip-badge">⏸️ ×{player.skipTurns}</div>
        )}
      </div>

      <div className="hud-dice-row">
        <Dice3D value={displayValue} rolling={rolling} />
        {remainingSteps > 0 && (
          <div className="hud-steps">
            <span className="hud-steps__num">{remainingSteps}</span>
            <span className="hud-steps__label">칸 남음</span>
          </div>
        )}
      </div>

      {canStep && <div className="hud-hint">→ 버튼으로 한 칸씩 이동하세요</div>}

      <div className="hud-btn-row">
        <button className="btn-3d btn-gold hud-btn" onClick={onRoll} disabled={!canRoll} aria-label="주사위 굴리기">
          🎲 주사위
        </button>
        <button className="btn-3d btn-green hud-btn" onClick={onStep} disabled={!canStep} aria-label="한 칸 이동">
          ➡️ 이동
        </button>
      </div>
    </div>
  );
};
