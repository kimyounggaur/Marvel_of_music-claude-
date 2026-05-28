import React from 'react';
import type { CellKind } from '../game/types';
import { SYMBOL_META } from '../data/symbolMeta';

interface Props {
  kind: CellKind | null;
  onClose: () => void;
}

export const LearningCard: React.FC<Props> = ({ kind, onClose }) => {
  if (!kind) return null;
  const meta = SYMBOL_META[kind];
  if (!meta || kind === 'NORMAL' || kind === 'START') return null;

  return (
    <div className="learning-card">
      <div className="learning-card__symbol">{meta.emoji}</div>
      <div className="learning-card__name">{meta.name}</div>
      <div className="learning-card__name-en">{meta.nameEn}</div>
      <div className="learning-card__divider" />
      <div className="learning-card__meaning">{meta.meaning}</div>
      <div className="learning-card__effect">🎮 {meta.effect}</div>
      <div className="learning-card__mnemonic">💡 {meta.mnemonic}</div>
      <button
        className="btn-3d btn-gold"
        onClick={onClose}
        style={{ marginTop: '0.8rem', fontSize: '0.85rem', padding: '0.5em 1.2em' }}
        aria-label="계속하기"
      >
        계속하기
      </button>
    </div>
  );
};
