import React from 'react';
import type { Player } from '../game/types';

const PLAYER_EMOJI = ['🐱', '🐶', '🐸', '🐻'];

interface Props {
  player: Player;
  x: number;
  y: number;
  width: number;
  height: number;
  isActive: boolean;
  offset?: number;
}

export const PlayerToken: React.FC<Props> = ({ player, x, y, width, height, isActive, offset = 0 }) => {
  const size = Math.min(width * 0.55, height * 0.55, 28);
  const ox = (offset % 2) * (size * 0.6) - (size * 0.3);
  const oy = Math.floor(offset / 2) * (size * 0.6) - (size * 0.3);

  return (
    <g
      transform={`translate(${x + width / 2 + ox}, ${y + height / 2 + oy})`}
      style={{ pointerEvents: 'none' }}
    >
      <circle
        r={size / 2}
        fill={player.color}
        fillOpacity={0.9}
        stroke="white"
        strokeWidth={2}
      />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.65}
        style={{ userSelect: 'none' }}
      >
        {PLAYER_EMOJI[player.id] ?? '⭐'}
      </text>
      {isActive && (
        <circle
          r={size / 2 + 3}
          fill="none"
          stroke="white"
          strokeWidth={2}
          opacity={0.8}
          style={{ animation: 'token-idle-bounce 1s ease-in-out infinite' }}
        />
      )}
    </g>
  );
};
