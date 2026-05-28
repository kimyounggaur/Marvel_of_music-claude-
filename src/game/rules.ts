import type { BoardCell, CellKind, ResolvedEvent } from './types';
import { getPositionAfterSteps, BOARD_LEN } from './movement';

function findIndexByKind(board: BoardCell[], kind: CellKind): number {
  return board.findIndex(c => c.kind === kind);
}

function findPair(board: BoardCell[], cell: BoardCell): BoardCell | undefined {
  if (!cell.pairId) return undefined;
  const targetOcc = cell.occurrence === 1 ? 2 : 1;
  return board.find(c => c.pairId === cell.pairId && c.occurrence === targetOcc);
}

export function resolveCellEvent(board: BoardCell[], position: number): ResolvedEvent {
  const cell = board[position];
  const none: ResolvedEvent = {
    type: 'NONE', sourceIndex: position,
    animationClass: '', kind: cell.kind
  };

  if (cell.markerOnly) return none;

  switch (cell.kind) {
    case 'NORMAL':
    case 'START':
    case 'SEGNO':
    case 'SECOND_ENDING':
    case 'REPEAT_START':
      return none;

    case 'MULTI_REST': {
      const steps = cell.count ?? 1;
      const target = getPositionAfterSteps(position, steps, true, BOARD_LEN);
      return { type: 'MOVE_FORWARD', sourceIndex: position, targetIndex: target, steps, animationClass: 'fx-rocket-dash', kind: cell.kind };
    }

    case 'REPEAT_END': {
      const startCell = board.find(c => c.kind === 'REPEAT_START' && c.pairId === cell.pairId);
      if (!startCell) { console.warn('REPEAT_START not found'); return none; }
      return { type: 'JUMP_TO_INDEX', sourceIndex: position, targetIndex: startCell.index, animationClass: 'fx-rewind', kind: cell.kind };
    }

    case 'DAL_SEGNO': {
      const segno = findIndexByKind(board, 'SEGNO');
      if (segno === -1) { console.warn('SEGNO not found'); return none; }
      return { type: 'JUMP_TO_INDEX', sourceIndex: position, targetIndex: segno, animationClass: 'fx-segno-fly', kind: cell.kind };
    }

    case 'CODA': {
      if (cell.occurrence === 1) {
        const pair = findPair(board, cell);
        if (!pair) { console.warn('CODA pair not found'); return none; }
        return { type: 'JUMP_TO_INDEX', sourceIndex: position, targetIndex: pair.index, animationClass: 'fx-coda-portal', kind: cell.kind };
      }
      return none;
    }

    case 'DA_CAPO':
      return { type: 'JUMP_TO_INDEX', sourceIndex: position, targetIndex: 0, animationClass: 'fx-spotlight-start', kind: cell.kind };

    case 'FIRST_ENDING': {
      const second = findIndexByKind(board, 'SECOND_ENDING');
      if (second === -1) { console.warn('SECOND_ENDING not found'); return none; }
      return { type: 'JUMP_TO_INDEX', sourceIndex: position, targetIndex: second, animationClass: 'fx-spring-jump', kind: cell.kind };
    }

    case 'FERMATA':
      return { type: 'SKIP_TURNS', sourceIndex: position, skipTurns: 2, animationClass: 'fx-ice-freeze', kind: cell.kind };

    case 'DOUBLE_SEGNO': {
      if (cell.occurrence === 1) {
        const pair = findPair(board, cell);
        if (!pair) { console.warn('DOUBLE_SEGNO pair not found'); return none; }
        return { type: 'JUMP_TO_INDEX', sourceIndex: position, targetIndex: pair.index, animationClass: 'fx-hologram', kind: cell.kind };
      }
      return none;
    }

    case 'DOUBLE_SEGNO_TRIGGER': {
      const dsegno = board.find(c => c.kind === 'DOUBLE_SEGNO' && c.occurrence === 1);
      if (!dsegno) { console.warn('DOUBLE_SEGNO occurrence 1 not found'); return none; }
      return { type: 'JUMP_TO_INDEX', sourceIndex: position, targetIndex: dsegno.index, animationClass: 'fx-hologram', kind: cell.kind };
    }

    case 'DOUBLE_CODA': {
      if (cell.occurrence === 1) {
        const pair = findPair(board, cell);
        if (!pair) { console.warn('DOUBLE_CODA pair not found'); return none; }
        return { type: 'JUMP_TO_INDEX', sourceIndex: position, targetIndex: pair.index, animationClass: 'fx-wormhole', kind: cell.kind };
      }
      return none;
    }

    case 'FINE':
      return { type: 'GAME_FINISH', sourceIndex: position, animationClass: 'fx-finale', kind: cell.kind };

    default:
      return none;
  }
}
