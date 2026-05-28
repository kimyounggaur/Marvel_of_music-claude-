import { useEffect, useRef, useCallback } from 'react';
import type { GameState } from '../game/types';
import type { GameAction as GA } from '../game/reducer';
import { rollDice } from '../game/dice';
import { SYMBOL_META } from '../data/symbolMeta';

export function useGameLoop(
  state: GameState,
  dispatch: React.Dispatch<GA>
) {
  const resolvingRef = useRef(false);

  // Auto-resolve events
  useEffect(() => {
    if (state.phase !== 'RESOLVING_EVENT' || state.activeEvent !== null) return;
    if (resolvingRef.current) return;
    resolvingRef.current = true;

    const timer = setTimeout(() => {
      resolvingRef.current = false;
      dispatch({ type: 'RESOLVE_EVENT' });
    }, 100);

    return () => clearTimeout(timer);
  }, [state.phase, state.activeEvent, dispatch]);

  // Apply active event
  useEffect(() => {
    if (state.phase !== 'RESOLVING_EVENT' || state.activeEvent === null) return;
    const event = state.activeEvent;

    let logMsg = '';
    const meta = SYMBOL_META[event.kind] ?? SYMBOL_META['NORMAL'];

    if (event.type === 'JUMP_TO_INDEX' && event.targetIndex !== undefined) {
      logMsg = `${meta.emoji} ${meta.name}! → ${event.targetIndex}번 칸으로 이동.`;
    } else if (event.type === 'MOVE_FORWARD') {
      logMsg = `${meta.emoji} ${meta.name} ${event.steps}! ${event.steps}칸 앞으로!`;
    } else if (event.type === 'MOVE_BACKWARD') {
      logMsg = `${meta.emoji} ${meta.name}! ${event.steps}칸 뒤로!`;
    } else if (event.type === 'SKIP_TURNS') {
      logMsg = `${meta.emoji} ${meta.name}! 다음 ${event.skipTurns}번 쉬기!`;
    } else if (event.type === 'GAME_FINISH') {
      logMsg = `🎉 Fine! 완주!`;
    }

    if (logMsg) dispatch({ type: 'ADD_LOG', message: logMsg });

    const timer = setTimeout(() => {
      if (event.type === 'GAME_FINISH') {
        dispatch({ type: 'FINISH_GAME' });
      } else if (event.type === 'SKIP_TURNS') {
        dispatch({ type: 'SKIP_TURN_COMPLETE' });
      } else if (event.type !== 'NONE' && event.targetIndex !== undefined) {
        dispatch({ type: 'APPLY_EVENT_COMPLETE', targetIndex: event.targetIndex });
      } else {
        dispatch({ type: 'DISMISS_EVENT' });
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [state.activeEvent, dispatch]);

  const doRoll = useCallback((value: number) => {
    dispatch({ type: 'ROLL_DICE_COMPLETE', value });
  }, [dispatch]);

  const startRoll = useCallback(() => {
    if (state.phase !== 'READY') return;
    dispatch({ type: 'ROLL_DICE_START' });
    const value = rollDice();
    const timer = setTimeout(() => doRoll(value), 700);
    return () => clearTimeout(timer);
  }, [state.phase, dispatch, doRoll]);

  const stepForward = useCallback(() => {
    if (state.phase !== 'WAITING_STEP') return;
    dispatch({ type: 'STEP_FORWARD' });
  }, [state.phase, dispatch]);

  return { startRoll, stepForward };
}
