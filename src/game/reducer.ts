import type { GameState, GamePhase, Player } from './types';
import { BOARD_LEN, stepForward } from './movement';
import { BOARD } from '../data/boardCells';
import { resolveCellEvent } from './rules';

const PLAYER_COLORS = ['#ef476f', '#4f7cff', '#43c77a', '#ffb84f'];

export type GameAction =
  | { type: 'ROLL_DICE_START' }
  | { type: 'ROLL_DICE_COMPLETE'; value: number }
  | { type: 'STEP_FORWARD' }
  | { type: 'RESOLVE_EVENT' }
  | { type: 'APPLY_EVENT_COMPLETE'; targetIndex: number }
  | { type: 'SKIP_TURN_COMPLETE' }
  | { type: 'EVENT_COMPLETE' }
  | { type: 'NEXT_TURN' }
  | { type: 'FINISH_GAME' }
  | { type: 'ADD_LOG'; message: string }
  | { type: 'RESET_GAME'; playerCount: number }
  | { type: 'SET_PLAYER_COUNT'; count: number }
  | { type: 'DISMISS_EVENT' };

function createPlayers(count: number): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `플레이어 ${i + 1}`,
    color: PLAYER_COLORS[i],
    position: 0,
    skipTurns: 0,
    finished: false,
  }));
}

export const initialState: GameState = {
  players: createPlayers(2),
  currentPlayer: 0,
  diceValue: null,
  remainingSteps: 0,
  phase: 'READY',
  activeEvent: null,
  eventLog: [],
  chainDepth: 0,
  turnCount: 0,
};

function addLog(state: GameState, message: string): GameState {
  const newLog = [message, ...state.eventLog].slice(0, 20);
  return { ...state, eventLog: newLog };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  const cp = state.currentPlayer;
  const player = state.players[cp];

  switch (action.type) {
    case 'RESET_GAME': {
      return { ...initialState, players: createPlayers(action.playerCount) };
    }

    case 'SET_PLAYER_COUNT': {
      return { ...initialState, players: createPlayers(action.count) };
    }

    case 'ROLL_DICE_START': {
      if (state.phase !== 'READY') return state;
      return { ...state, phase: 'ROLLING' };
    }

    case 'ROLL_DICE_COMPLETE': {
      if (state.phase !== 'ROLLING') return state;
      const newState = addLog(state, `🎲 주사위 ${action.value}! ${action.value}칸 이동하세요.`);
      return { ...newState, diceValue: action.value, remainingSteps: action.value, phase: 'WAITING_STEP' };
    }

    case 'STEP_FORWARD': {
      if (state.phase !== 'WAITING_STEP') return state;
      if (state.remainingSteps <= 0) return state;
      const newPos = stepForward(player.position, BOARD_LEN);
      const newPlayers = state.players.map(p =>
        p.id === player.id ? { ...p, position: newPos } : p
      );
      const newRemaining = state.remainingSteps - 1;
      const newPhase: GamePhase = newRemaining > 0 ? 'WAITING_STEP' : 'RESOLVING_EVENT';
      return { ...state, players: newPlayers, remainingSteps: newRemaining, phase: newPhase };
    }

    case 'RESOLVE_EVENT': {
      if (state.phase !== 'RESOLVING_EVENT') return state;
      if (state.chainDepth > 10) {
        const s = addLog(state, '⚠️ 연쇄 이동 한계 도달. 차례를 넘깁니다.');
        return { ...s, phase: 'READY', activeEvent: null, chainDepth: 0 };
      }
      const event = resolveCellEvent(BOARD, player.position);
      if (event.type === 'NONE') {
        return { ...state, activeEvent: null, phase: 'READY', chainDepth: 0 };
      }
      return { ...state, activeEvent: event, phase: 'RESOLVING_EVENT' };
    }

    case 'APPLY_EVENT_COMPLETE': {
      const newPlayers = state.players.map(p =>
        p.id === player.id ? { ...p, position: action.targetIndex } : p
      );
      return { ...state, players: newPlayers, chainDepth: state.chainDepth + 1, phase: 'RESOLVING_EVENT', activeEvent: null };
    }

    case 'SKIP_TURN_COMPLETE': {
      const newPlayers = state.players.map(p =>
        p.id === player.id ? { ...p, skipTurns: p.skipTurns + (state.activeEvent?.skipTurns ?? 0) } : p
      );
      const s = addLog({ ...state, players: newPlayers }, `⏸️ 페르마타! 다음 ${state.activeEvent?.skipTurns ?? 0}번 쉬기.`);
      return { ...s, activeEvent: null, phase: 'READY', chainDepth: 0 };
    }

    case 'FINISH_GAME': {
      const s = addLog(state, `🎉 ${player.name} 완주! 축하합니다!`);
      return { ...s, phase: 'GAME_OVER' };
    }

    case 'DISMISS_EVENT': {
      if (state.activeEvent === null) return state;
      return { ...state, activeEvent: null, phase: 'READY', chainDepth: 0 };
    }

    case 'NEXT_TURN': {
      const activePlayers = state.players.filter(p => !p.finished);
      if (activePlayers.length <= 1) return { ...state, phase: 'GAME_OVER' };
      let next = (cp + 1) % state.players.length;
      // skip finished players
      let safety = 0;
      while (state.players[next].finished && safety < state.players.length) {
        next = (next + 1) % state.players.length;
        safety++;
      }
      const nextPlayer = state.players[next];
      if (nextPlayer.skipTurns > 0) {
        const newPlayers = state.players.map(p =>
          p.id === nextPlayer.id ? { ...p, skipTurns: p.skipTurns - 1 } : p
        );
        const s = addLog({ ...state, players: newPlayers }, `⏸️ ${nextPlayer.name} 페르마타로 쉬어요. 남은 쉬기: ${nextPlayer.skipTurns - 1}번`);
        // Skip to next next player
        let nextnext = (next + 1) % s.players.length;
        let safety2 = 0;
        while (s.players[nextnext].finished && safety2 < s.players.length) {
          nextnext = (nextnext + 1) % s.players.length;
          safety2++;
        }
        return { ...s, currentPlayer: nextnext, phase: 'READY', diceValue: null, remainingSteps: 0, activeEvent: null, chainDepth: 0, turnCount: state.turnCount + 1 };
      }
      return { ...state, currentPlayer: next, phase: 'READY', diceValue: null, remainingSteps: 0, activeEvent: null, chainDepth: 0, turnCount: state.turnCount + 1 };
    }

    case 'ADD_LOG': {
      return addLog(state, action.message);
    }

    default:
      return state;
  }
}
