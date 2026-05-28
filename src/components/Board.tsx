import React, { useRef, useEffect, useState } from 'react';
import type { Player } from '../game/types';
import { BOARD } from '../data/boardCells';
import { cellCoord } from '../game/movement';
import { BoardCellComp } from './BoardCell';
import { PlayerToken } from './PlayerToken';
import '../styles/board.css';

interface Props {
  players: Player[];
  currentPlayer: number;
  targetIndex?: number;
}

export const Board: React.FC<Props> = ({ players, currentPlayer, targetIndex }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const [cellRects, setCellRects] = useState<Map<number, DOMRect>>(new Map());

  useEffect(() => {
    const updateRects = () => {
      if (!boardRef.current) return;
      const cells = boardRef.current.querySelectorAll<HTMLDivElement>('[data-cell-index]');
      const map = new Map<number, DOMRect>();
      cells.forEach(el => {
        const idx = parseInt(el.dataset.cellIndex!);
        map.set(idx, el.getBoundingClientRect());
      });
      setCellRects(map);
    };
    updateRects();
    window.addEventListener('resize', updateRects);
    return () => window.removeEventListener('resize', updateRects);
  }, []);

  const currentPos = players[currentPlayer]?.position ?? 0;

  // Place cells in grid
  const cellElements: React.ReactNode[] = [];
  for (const cell of BOARD) {
    const { row, col } = cellCoord(cell.index);
    cellElements.push(
      <div
        key={cell.index}
        data-cell-index={cell.index}
        style={{ gridColumn: col + 1, gridRow: row + 1 }}
      >
        <BoardCellComp
          cell={cell}
          isCurrent={cell.index === currentPos}
          isTarget={targetIndex !== undefined && cell.index === targetIndex}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    );
  }

  // Group players by position for offset
  const positionGroups = new Map<number, Player[]>();
  for (const p of players) {
    if (!positionGroups.has(p.position)) positionGroups.set(p.position, []);
    positionGroups.get(p.position)!.push(p);
  }

  // SVG tokens overlay
  const boardRect = boardRef.current?.getBoundingClientRect();

  return (
    <div className="board-wrapper" ref={boardRef}>
      <div className="board-grid">
        {cellElements}
        {/* Center area */}
        <div className="board-center" style={{ gridColumn: '2 / 14', gridRow: '2 / 8' }}>
          <svg width="48" height="48" viewBox="0 0 48 48" style={{ animation: 'spin-slow 8s linear infinite', flexShrink: 0 }}>
            <text y="36" fontSize="40" textAnchor="middle" x="24">🎵</text>
          </svg>
          <div className="text-title">반복기호의 마블</div>
          <div style={{ fontSize: 'clamp(0.55rem,1.2vw,0.8rem)', color: 'rgba(255,255,255,0.5)', letterSpacing:'0.06em' }}>
            MUSIC MARBLE
          </div>
        </div>
      </div>
      {/* Token SVG layer */}
      {boardRect && (
        <svg
          className="tokens-layer"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible' }}
        >
          {Array.from(positionGroups.entries()).map(([pos, playersAtPos]) =>
            playersAtPos.map((p, offsetIdx) => {
              const rect = cellRects.get(pos);
              if (!rect || !boardRect) return null;
              const x = rect.left - boardRect.left;
              const y = rect.top - boardRect.top;
              return (
                <PlayerToken
                  key={p.id}
                  player={p}
                  x={x}
                  y={y}
                  width={rect.width}
                  height={rect.height}
                  isActive={p.id === currentPlayer}
                  offset={offsetIdx}
                />
              );
            })
          )}
        </svg>
      )}
    </div>
  );
};
