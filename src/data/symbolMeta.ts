export interface SymbolInfo {
  name: string;
  nameEn: string;
  meaning: string;
  effect: string;
  mnemonic: string;
  fallback: string;
  emoji: string;
}

export const SYMBOL_META: Record<string, SymbolInfo> = {
  MULTI_REST: {
    name: '다중쉼표', nameEn: 'Multi-rest',
    meaning: '숫자만큼 여러 마디를 한 번에 쉬라는 뜻이에요.',
    effect: '숫자만큼 앞으로 이동!',
    mnemonic: '숫자가 보이면 그만큼 앞으로!',
    fallback: 'N쉼', emoji: '⏩'
  },
  REPEAT_START: {
    name: '시작 도돌이표', nameEn: 'Repeat start',
    meaning: '반복 구간이 시작되는 지점이에요.',
    effect: '목적지 지점이에요.',
    mnemonic: '여기서부터 다시!',
    fallback: '|:', emoji: '🔁'
  },
  REPEAT_END: {
    name: '끝 도돌이표', nameEn: 'Repeat end',
    meaning: '시작 도돌이표로 돌아가 다시 연주해요.',
    effect: '시작 도돌이표 칸으로 돌아가요.',
    mnemonic: '되돌아가는 문!',
    fallback: ':|', emoji: '🔙'
  },
  DAL_SEGNO: {
    name: '달세뇨', nameEn: 'D.S.(Dal Segno)',
    meaning: '세뇨(𝄋) 표시로 돌아가 연주해요.',
    effect: '세뇨 칸으로 이동!',
    mnemonic: 'D.S.는 세뇨 표지판으로!',
    fallback: 'D.S.', emoji: '🎯'
  },
  SEGNO: {
    name: '세뇨', nameEn: 'Segno',
    meaning: '달세뇨가 돌아오는 표지판이에요.',
    effect: '목적지 지점이에요.',
    mnemonic: '돌아올 위치를 알려주는 표지판!',
    fallback: '𝄋', emoji: '📍'
  },
  CODA: {
    name: '코다', nameEn: 'Coda',
    meaning: '코다 구간으로 건너뛰어 마지막을 연주해요.',
    effect: '두 번째 코다 칸으로 이동!',
    mnemonic: '음악의 특별한 출구!',
    fallback: '𝄌', emoji: '🌀'
  },
  DA_CAPO: {
    name: '다카포', nameEn: 'D.C.(Da Capo)',
    meaning: '곡의 맨 처음으로 돌아가 다시 연주해요.',
    effect: 'Start로 이동!',
    mnemonic: 'Capo는 머리, 즉 처음으로!',
    fallback: 'D.C.', emoji: '⏮️'
  },
  FIRST_ENDING: {
    name: '제1괄호', nameEn: '1st ending',
    meaning: '첫 번째 반복에서만 연주하는 마무리예요.',
    effect: '제2괄호 칸으로 건너뛰기!',
    mnemonic: '첫 번째에만 들어가는 방!',
    fallback: '1.', emoji: '1️⃣'
  },
  SECOND_ENDING: {
    name: '제2괄호', nameEn: '2nd ending',
    meaning: '두 번째 반복에서 연주하는 마무리예요.',
    effect: '목적지 지점이에요.',
    mnemonic: '두 번째에 들어가는 방!',
    fallback: '2.', emoji: '2️⃣'
  },
  FERMATA: {
    name: '페르마타', nameEn: 'Fermata',
    meaning: '음을 본래 길이보다 자유롭게 길게 늘여요.',
    effect: '2번 쉬기!',
    mnemonic: '잠깐 멈춰서 더 길게!',
    fallback: '𝄐', emoji: '⏸️'
  },
  DOUBLE_SEGNO: {
    name: '더블세뇨', nameEn: 'Double Segno',
    meaning: '세뇨 표시가 두 개인 특별 기호예요.',
    effect: '두 번째 더블세뇨로 이동!',
    mnemonic: '세뇨가 두 개라 더 특별!',
    fallback: '%%', emoji: '💫'
  },
  DOUBLE_SEGNO_TRIGGER: {
    name: '더블 달세뇨', nameEn: 'D.S.S',
    meaning: '더블세뇨로 보내는 표시예요.',
    effect: '더블세뇨 칸으로 이동!',
    mnemonic: '%%를 찾아서 달리기!',
    fallback: 'D.S.S', emoji: '🚀'
  },
  DOUBLE_CODA: {
    name: '더블코다', nameEn: 'Double Coda',
    meaning: '코다 출구가 두 개인 특별 기호예요.',
    effect: '두 번째 더블코다로 이동!',
    mnemonic: '출구가 두 개라 더 멀리!',
    fallback: '𝄌𝄌', emoji: '🌌'
  },
  FINE: {
    name: '피네', nameEn: 'Fine',
    meaning: '곡의 끝을 나타내요.',
    effect: '곡 완성! 축하 연출.',
    mnemonic: '여기서 곡이 끝나요!',
    fallback: 'Fine', emoji: '🎉'
  },
  NORMAL: {
    name: '일반', nameEn: 'Normal',
    meaning: '일반 칸이에요.',
    effect: '없음',
    mnemonic: '',
    fallback: '1', emoji: '▪️'
  },
  START: {
    name: '출발', nameEn: 'Start',
    meaning: '게임의 출발점이에요.',
    effect: '없음',
    mnemonic: '',
    fallback: 'S', emoji: '🏁'
  },
};
