import React from 'react';
import type { BoardCell as BC } from '../game/types';
import { SYMBOL_META } from '../data/symbolMeta';

interface Props {
  cell: BC;
  isCurrent: boolean;
  isTarget: boolean;
  style?: React.CSSProperties;
}

const EVENT_KINDS = new Set([
  'MULTI_REST', 'REPEAT_END', 'DAL_SEGNO', 'CODA', 'DA_CAPO',
  'FIRST_ENDING', 'FERMATA', 'DOUBLE_SEGNO', 'DOUBLE_SEGNO_TRIGGER',
  'DOUBLE_CODA', 'OCTAVE_DOWN', 'FINE'
]);

const IMAGE_MAP: Record<string, string> = {
  SEGNO: '/assets/symbols/segno.png',
  CODA: '/assets/symbols/coda.png',
  FERMATA: '/assets/symbols/fermata.png',
  REPEAT_START: '/assets/symbols/repeat-start.png',
  REPEAT_END: '/assets/symbols/repeat-end.png',
  FIRST_ENDING: '/assets/symbols/first-ending.jpg',
  SECOND_ENDING: '/assets/symbols/second-ending.jpg',
  MULTI_REST: '/assets/symbols/multi-rest.png',
  OCTAVE_DOWN: '/assets/symbols/octave-down.png',
};

export const BoardCellComp: React.FC<Props> = ({ cell, isCurrent, isTarget, style }) => {
  const meta = SYMBOL_META[cell.kind] ?? SYMBOL_META['NORMAL'];
  const isEvent = EVENT_KINDS.has(cell.kind) && !cell.markerOnly;
  const imgSrc = IMAGE_MAP[cell.kind];

  const classNames = [
    'cell',
    `cell--${cell.side}`,
    cell.isCorner ? 'cell--corner' : '',
    cell.kind === 'START' ? 'cell--start' : '',
    cell.kind === 'FINE' ? 'cell--fine' : '',
    cell.kind === 'FERMATA' ? 'cell--fermata' : '',
    isEvent ? 'cell--event' : '',
    isCurrent ? 'cell--current' : '',
    isTarget ? 'cell--target-glow' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} style={style} title={`${meta.name}: ${meta.effect}`}>
      {imgSrc ? (
        <img
          className="cell__img"
          src={imgSrc}
          alt={meta.name}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      ) : null}
      {cell.kind !== 'NORMAL' && <span className="cell__label">{cell.label}</span>}
      {cell.markerOnly && <span className="cell__marker-badge">목표</span>}
    </div>
  );
};
