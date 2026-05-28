import React from 'react';
import type { Player } from '../game/types';

interface Props {
  players: Player[];
  currentPlayer: number;
}

export const PlayerStatusBar: React.FC<Props> = ({ players, currentPlayer }) => (
  <div className="player-status-bar">
    {players.map(p => (
      <div
        key={p.id}
        className={`player-chip ${p.id === currentPlayer ? 'player-chip--active' : ''}`}
        style={{ background: p.color + '22', color: p.color }}
        aria-label={`${p.name} - 위치: ${p.position}번 칸${p.skipTurns > 0 ? `, 쉬기 ${p.skipTurns}번` : ''}`}
      >
        {p.id === currentPlayer ? '▶ ' : ''}
        {p.name}
        <span style={{ fontSize: '0.75rem', color: '#888', marginLeft: '0.3rem' }}>
          칸{p.position}
        </span>
        {p.skipTurns > 0 && <span style={{ color: '#01579b', marginLeft: '0.3rem' }}>⏸️{p.skipTurns}</span>}
      </div>
    ))}
  </div>
);
