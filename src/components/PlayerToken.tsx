import React from 'react';
import type { Player } from '../game/types';

const PLAYER_EMOJI  = ['🐱','🐶','🐸','🐻'];
const AURA_COLORS   = ['#ff4d6d','#4d9fff','#00e5a0','#ffd700'];
const PEDESTAL_CLRS = ['#cc0033','#003399','#006633','#cc8800'];

interface Props {
  player: Player;
  x: number; y: number;
  width: number; height: number;
  isActive: boolean;
  offset?: number;
}

export const PlayerToken: React.FC<Props> = ({ player, x, y, width, height, isActive, offset = 0 }) => {
  const size   = Math.min(width * 0.52, height * 0.52, 26);
  const ox = (offset % 2) * (size * 0.65) - (size * 0.32);
  const oy = Math.floor(offset / 2) * (size * 0.65) - (size * 0.32);
  const cx = x + width / 2 + ox;
  const cy = y + height / 2 + oy;
  const aura   = AURA_COLORS[player.id]   ?? '#ffffff';
  const pedClr = PEDESTAL_CLRS[player.id] ?? '#333';

  return (
    <g transform={`translate(${cx},${cy})`} style={{ pointerEvents:'none' }}>
      <circle
        r={size / 2 + 5} fill="none"
        stroke={aura} strokeWidth={isActive ? 2.5 : 1}
        opacity={isActive ? 0.9 : 0.35}
        style={{ animation: isActive ? 'aura-pulse 1s ease-in-out infinite' : 'none' }}
      />
      <ellipse rx={size * 0.48} ry={size * 0.14} fill={pedClr} opacity={0.85} cy={size * 0.42} />
      <circle r={size / 2} fill={player.color} stroke="white" strokeWidth={2}
        style={{ filter:`drop-shadow(0 3px 6px ${aura}88)` }} />
      <text textAnchor="middle" dominantBaseline="central" fontSize={size * 0.66} style={{ userSelect:'none' }}>
        {PLAYER_EMOJI[player.id] ?? '⭐'}
      </text>
      {isActive && (
        <text textAnchor="middle" fontSize={size * 0.5} y={-(size / 2 + 4)}
          style={{ animation: 'crown-bob 0.6s ease-in-out infinite alternate' }}>
          👑
        </text>
      )}
    </g>
  );
};
