import React from 'react';
import type { ResolvedEvent } from '../game/types';
import { SYMBOL_META } from '../data/symbolMeta';
import { EventParticles } from './EventParticles';
import '../styles/animations.css';

interface Props {
  event: ResolvedEvent | null;
  onDismiss?: () => void;
}

const AURA_COLOR_MAP: Partial<Record<string, string>> = {
  MULTI_REST: '#ff8800', REPEAT_END: '#4d9fff', DAL_SEGNO: '#cc88ff',
  CODA: '#00ccff', DA_CAPO: '#ffee00', FIRST_ENDING: '#00ff88',
  FERMATA: '#88ccff', DOUBLE_SEGNO: '#cc44ff', DOUBLE_CODA: '#ff44cc',
  FINE: '#ffd700',
};

export const EventOverlay: React.FC<Props> = ({ event, onDismiss }) => {
  if (!event || event.type === 'NONE') return null;
  const meta = SYMBOL_META[event.kind] ?? SYMBOL_META['NORMAL'];
  const auraColor = AURA_COLOR_MAP[event.kind] ?? '#ffd700';

  let effectText = meta.effect;
  if (event.type === 'JUMP_TO_INDEX' && event.targetIndex !== undefined) {
    effectText = `→ ${event.targetIndex}번 칸으로 이동!`;
  } else if (event.type === 'MOVE_FORWARD') {
    effectText = `${event.steps}칸 앞으로!`;
  } else if (event.type === 'MOVE_BACKWARD') {
    effectText = `${event.steps}칸 뒤로!`;
  } else if (event.type === 'SKIP_TURNS') {
    effectText = `다음 ${event.skipTurns}번 쉬기!`;
  } else if (event.type === 'GAME_FINISH') {
    effectText = '🎊 완주했습니다!';
  }

  return (
    <>
      <EventParticles color={auraColor} active={true} />
      <div className={`event-overlay ${event.animationClass}`} aria-live="polite">
        <div className="event-overlay__card" onClick={onDismiss}>
          <div className="event-overlay__emoji">{meta.emoji}</div>
          <div className="event-overlay__title">{meta.name}</div>
          <div className="event-overlay__divider" />
          <div className="event-overlay__meaning">{meta.meaning}</div>
          <div className="event-overlay__effect">🎮 {effectText}</div>
          <div className="event-overlay__mnemonic">💡 {meta.mnemonic}</div>
        </div>
      </div>
    </>
  );
};
