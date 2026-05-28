import React from 'react';
import './dice3d.css';

const DOT_POSITIONS: Record<number, number[][]> = {
  1: [[50,50]],
  2: [[25,25],[75,75]],
  3: [[25,25],[50,50],[75,75]],
  4: [[25,25],[75,25],[25,75],[75,75]],
  5: [[25,25],[75,25],[50,50],[25,75],[75,75]],
  6: [[25,20],[75,20],[25,50],[75,50],[25,80],[75,80]],
};

interface Props { value: number; rolling: boolean; }

export const Dice3D: React.FC<Props> = ({ value, rolling }) => {
  const dots = DOT_POSITIONS[value] ?? DOT_POSITIONS[1];
  return (
    <div className={`dice3d-scene ${rolling ? 'dice3d--rolling' : ''}`}>
      <div className="dice3d">
        {(['front','back','right','left','top','bottom'] as const).map(face => (
          <div key={face} className={`dice3d__face dice3d__face--${face}`}>
            {face === 'front' && dots.map(([x,y],i) => (
              <div key={i} className="dice3d__dot"
                style={{ left:`${x}%`, top:`${y}%`, transform:'translate(-50%,-50%)' }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
