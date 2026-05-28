import { describe, it, expect } from 'vitest';
import { BOARD } from '../data/boardCells';
import { resolveCellEvent } from '../game/rules';
import { stepForward, stepBackward } from '../game/movement';

describe('movement', () => {
  it('stepForward wraps', () => expect(stepForward(39, 40)).toBe(0));
  it('stepBackward 8 from 3', () => expect(stepBackward(3, 8, 40)).toBe(35));
});

describe('rules', () => {
  it('MULTI_REST count 3 at index 3 -> MOVE_FORWARD 3', () => {
    const e = resolveCellEvent(BOARD, 3);
    expect(e.type).toBe('MOVE_FORWARD');
    expect(e.steps).toBe(3);
  });

  it('REPEAT_END at 15 -> JUMP to REPEAT_START (8)', () => {
    const e = resolveCellEvent(BOARD, 15);
    expect(e.type).toBe('JUMP_TO_INDEX');
    expect(e.targetIndex).toBe(8);
  });

  it('DAL_SEGNO at 21 -> JUMP to SEGNO (17)', () => {
    const e = resolveCellEvent(BOARD, 21);
    expect(e.type).toBe('JUMP_TO_INDEX');
    expect(e.targetIndex).toBe(17);
  });

  it('CODA occ1 at 18 -> JUMP to CODA occ2 (22)', () => {
    const e = resolveCellEvent(BOARD, 18);
    expect(e.type).toBe('JUMP_TO_INDEX');
    expect(e.targetIndex).toBe(22);
  });

  it('CODA occ2 (22) is markerOnly -> NONE', () => {
    const e = resolveCellEvent(BOARD, 22);
    expect(e.type).toBe('NONE');
  });

  it('DA_CAPO at 4 -> JUMP to 0', () => {
    const e = resolveCellEvent(BOARD, 4);
    expect(e.type).toBe('JUMP_TO_INDEX');
    expect(e.targetIndex).toBe(0);
  });

  it('FIRST_ENDING at 14 -> JUMP to SECOND_ENDING (16)', () => {
    const e = resolveCellEvent(BOARD, 14);
    expect(e.type).toBe('JUMP_TO_INDEX');
    expect(e.targetIndex).toBe(16);
  });

  it('FERMATA at 34 -> SKIP_TURNS 2', () => {
    const e = resolveCellEvent(BOARD, 34);
    expect(e.type).toBe('SKIP_TURNS');
    expect(e.skipTurns).toBe(2);
  });

  it('DOUBLE_SEGNO occ1 at 28 -> JUMP to occ2 (35)', () => {
    const e = resolveCellEvent(BOARD, 28);
    expect(e.type).toBe('JUMP_TO_INDEX');
    expect(e.targetIndex).toBe(35);
  });

  it('DOUBLE_CODA occ1 at 27 -> JUMP to occ2 (36)', () => {
    const e = resolveCellEvent(BOARD, 27);
    expect(e.type).toBe('JUMP_TO_INDEX');
    expect(e.targetIndex).toBe(36);
  });

  it('FINE at 38 -> GAME_FINISH', () => {
    const e = resolveCellEvent(BOARD, 38);
    expect(e.type).toBe('GAME_FINISH');
  });

  it('REPEAT_START at 8 is markerOnly -> NONE', () => {
    const e = resolveCellEvent(BOARD, 8);
    expect(e.type).toBe('NONE');
  });

  it('DOUBLE_SEGNO_TRIGGER at 25 -> JUMP to DOUBLE_SEGNO occ1 (28)', () => {
    const e = resolveCellEvent(BOARD, 25);
    expect(e.type).toBe('JUMP_TO_INDEX');
    expect(e.targetIndex).toBe(28);
  });

  it('MULTI_REST count 4 at 30 -> MOVE_FORWARD 4', () => {
    const e = resolveCellEvent(BOARD, 30);
    expect(e.type).toBe('MOVE_FORWARD');
    expect(e.steps).toBe(4);
  });
});
