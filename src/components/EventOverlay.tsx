import React from 'react';
import type { ResolvedEvent } from '../game/types';
import { SYMBOL_META } from '../data/symbolMeta';
import '../styles/animations.css';

interface Props {
  event: ResolvedEvent | null;
  onDismiss?: () => void;
}

export const EventOverlay: React.FC<Props> = ({ event, onDismiss }) => {
  if (!event || event.type === 'NONE') return null;
  const meta = SYMBOL_META[event.kind] ?? SYMBOL_META['NORMAL'];

  let description = meta.effect;
  if (event.type === 'JUMP_TO_INDEX' && event.targetIndex !== undefined) {
    description = `→ ${event.targetIndex}번 칸으로 이동!`;
  } else if (event.type === 'MOVE_FORWARD') {
    description = `${event.steps}칸 앞으로!`;
  } else if (event.type === 'MOVE_BACKWARD') {
    description = `${event.steps}칸 뒤로!`;
  } else if (event.type === 'SKIP_TURNS') {
    description = `다음 ${event.skipTurns}번 쉬기!`;
  } else if (event.type === 'GAME_FINISH') {
    description = '🎊 완주했습니다!';
  }

  return (
    <div className={`event-overlay ${event.animationClass}`} aria-live="polite">
      <div className="event-overlay__box" onClick={onDismiss}>
        <div className="event-overlay__emoji">{meta.emoji}</div>
        <div className="event-overlay__title">{meta.name}</div>
        <div className="event-overlay__desc">{description}</div>
        {onDismiss && <div style={{ fontSize: '0.7rem', color: '#aaa', marginTop: '0.5rem' }}>탭하여 닫기</div>}
      </div>
    </div>
  );
};
