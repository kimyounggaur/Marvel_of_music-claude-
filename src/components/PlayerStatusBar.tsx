import React from 'react';
import type { Player } from '../game/types';

interface Props { players: Player[]; currentPlayer: number; }

export const PlayerStatusBar: React.FC<Props> = ({ players, currentPlayer }) => (
  <div className="player-status-bar">
    {players.map(p => (
      <div
        key={p.id}
        className={`player-chip ${p.id === currentPlayer ? 'player-chip--active' : ''}`}
        aria-label={`${p.name} - ${p.position}번 칸${p.skipTurns > 0 ? `, 쉬기 ${p.skipTurns}번` : ''}`}
      >
        <div className="player-chip__dot" style={{ background: p.color, color: p.color }} />
        {p.id === currentPlayer ? '▶ ' : ''}{p.name}
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginLeft: '0.3rem' }}>
          {p.position}칸
        </span>
        {p.skipTurns > 0 && <span style={{ color: '#88ccff', marginLeft: '0.3rem' }}>⏸️{p.skipTurns}</span>}
      </div>
    ))}
  </div>
);
