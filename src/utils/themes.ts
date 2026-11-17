import type { CounterColorId } from '../types/counter';

export interface CounterColorPalette {
  id: CounterColorId;
  swatchHex: string;
  // List card styles (Dark & Light)
  cardBg: string;
  cardBorder: string;
  cardTitle: string;
  cardMuted: string;
  cardPlusBg: string;
  cardPlusText: string;
  cardMinusBg: string;
  cardMinusText: string;
  // Focus full-screen styles (Dark & Light)
  focusBg: string;
  focusText: string;
  focusMuted: string;
  focusPrimaryBg: string;
  focusPrimaryText: string;
  focusSecondaryBg: string;
  focusSecondaryText: string;
  progressFill: string;
}

export const COUNTER_THEMES: Record<CounterColorId, CounterColorPalette> = {
  terracotta: {
    id: 'terracotta',
    swatchHex: '#D97706',
    cardBg: 'bg-[#F8EAE4] dark:bg-[#5E3A2F]',
    cardBorder: 'border-[#EAC8BC] dark:border-[#74493C]',
    cardTitle: 'text-[#3D2018] dark:text-[#FCEEE9]',
    cardMuted: 'text-[#7B4F42] dark:text-[#DFB7AB]',
    cardPlusBg: 'bg-[#D97757] hover:bg-[#C66546] dark:bg-[#F4B8A4] dark:hover:bg-[#F7C7B7]',
    cardPlusText: 'text-white dark:text-[#3A1E16]',
    cardMinusBg: 'bg-[#EED5CC] hover:bg-[#E4C2B6] dark:bg-[#221613] dark:hover:bg-[#2E1E1A]',
    cardMinusText: 'text-[#3D2018] dark:text-[#FCEEE9]',
    focusBg: 'bg-[#FDF6F3] dark:bg-[#1E1411]',
    focusText: 'text-[#8C3B24] dark:text-[#F4B8A4]',
    focusMuted: 'text-[#8F6559] dark:text-[#C59B8E]',
    focusPrimaryBg: 'bg-[#D97757] hover:bg-[#C66546] dark:bg-[#F4B8A4] dark:hover:bg-[#F7C7B7]',
    focusPrimaryText: 'text-white dark:text-[#3A1E16]',
    focusSecondaryBg: 'bg-[#EFE0DA] hover:bg-[#E5CFC7] dark:bg-[#49322B] dark:hover:bg-[#5B3E36]',
    focusSecondaryText: 'text-[#3D2018] dark:text-[#F4B8A4]',
    progressFill: 'bg-[#D97757] dark:bg-[#F4B8A4]',
  },
  olive: {
    id: 'olive',
    swatchHex: '#6B7E45',
    cardBg: 'bg-[#EEF2E4] dark:bg-[#3A4426]',
    cardBorder: 'border-[#D5DFC1] dark:border-[#4C5932]',
    cardTitle: 'text-[#242C15] dark:text-[#EFF5E2]',
    cardMuted: 'text-[#556339] dark:text-[#C4D2A7]',
    cardPlusBg: 'bg-[#5F733A] hover:bg-[#516330] dark:bg-[#C7DC96] dark:hover:bg-[#D3E5AA]',
    cardPlusText: 'text-white dark:text-[#202910]',
    cardMinusBg: 'bg-[#DFE7CE] hover:bg-[#D2DEC0] dark:bg-[#181D10] dark:hover:bg-[#222917]',
    cardMinusText: 'text-[#242C15] dark:text-[#EFF5E2]',
    focusBg: 'bg-[#F7F9F2] dark:bg-[#15190E]',
    focusText: 'text-[#4B5C2B] dark:text-[#C7DC96]',
    focusMuted: 'text-[#667649] dark:text-[#A3B482]',
    focusPrimaryBg: 'bg-[#5F733A] hover:bg-[#516330] dark:bg-[#C7DC96] dark:hover:bg-[#D3E5AA]',
    focusPrimaryText: 'text-white dark:text-[#202910]',
    focusSecondaryBg: 'bg-[#E2E9D4] hover:bg-[#D5DFC2] dark:bg-[#2E361E] dark:hover:bg-[#3B4527]',
    focusSecondaryText: 'text-[#242C15] dark:text-[#C7DC96]',
    progressFill: 'bg-[#5F733A] dark:bg-[#C7DC96]',
  },
  teal: {
    id: 'teal',
    swatchHex: '#155E63',
    cardBg: 'bg-[#E4F2F2] dark:bg-[#1B4244]',
    cardBorder: 'border-[#C1E0E1] dark:border-[#27595C]',
    cardTitle: 'text-[#0E2B2D] dark:text-[#E5F6F7]',
    cardMuted: 'text-[#366669] dark:text-[#9FD0D3]',
    cardPlusBg: 'bg-[#147075] hover:bg-[#105D61] dark:bg-[#8CDAD9] dark:hover:bg-[#A0E3E2]',
    cardPlusText: 'text-white dark:text-[#09292B]',
    cardMinusBg: 'bg-[#CFE7E8] hover:bg-[#BEDCDD] dark:bg-[#0E2224] dark:hover:bg-[#142F31]',
    cardMinusText: 'text-[#0E2B2D] dark:text-[#E5F6F7]',
    focusBg: 'bg-[#F2FAFA] dark:bg-[#0D1A1B]',
    focusText: 'text-[#0F5D61] dark:text-[#8CDAD9]',
    focusMuted: 'text-[#477477] dark:text-[#7BB0B2]',
    focusPrimaryBg: 'bg-[#147075] hover:bg-[#105D61] dark:bg-[#8CDAD9] dark:hover:bg-[#A0E3E2]',
    focusPrimaryText: 'text-white dark:text-[#09292B]',
    focusSecondaryBg: 'bg-[#D5EAEB] hover:bg-[#C4E0E2] dark:bg-[#1B3739] dark:hover:bg-[#23474A]',
    focusSecondaryText: 'text-[#0E2B2D] dark:text-[#8CDAD9]',
    progressFill: 'bg-[#147075] dark:bg-[#8CDAD9]',
  },
  gold: {
    id: 'gold',
    swatchHex: '#D8A657',
    cardBg: 'bg-[#F8F0DC] dark:bg-[#4B3B1E]',
    cardBorder: 'border-[#EAD8B0] dark:border-[#634E29]',
    cardTitle: 'text-[#33260E] dark:text-[#FBF3E0]',
    cardMuted: 'text-[#745B2A] dark:text-[#E0C794]',
    cardPlusBg: 'bg-[#B98223] hover:bg-[#A1701C] dark:bg-[#F2CB7E] dark:hover:bg-[#F6D696]',
    cardPlusText: 'text-white dark:text-[#2D210A]',
    cardMinusBg: 'bg-[#EFE0BE] hover:bg-[#E6D1A6] dark:bg-[#211A0D] dark:hover:bg-[#2C2312]',
    cardMinusText: 'text-[#33260E] dark:text-[#FBF3E0]',
    focusBg: 'bg-[#FCF9F0] dark:bg-[#1A150B]',
    focusText: 'text-[#926517] dark:text-[#F2CB7E]',
    focusMuted: 'text-[#7F673B] dark:text-[#C5AE7D]',
    focusPrimaryBg: 'bg-[#B98223] hover:bg-[#A1701C] dark:bg-[#F2CB7E] dark:hover:bg-[#F6D696]',
    focusPrimaryText: 'text-white dark:text-[#2D210A]',
    focusSecondaryBg: 'bg-[#EFE3C8] hover:bg-[#E5D5B2] dark:bg-[#3A2E18] dark:hover:bg-[#493A1F]',
    focusSecondaryText: 'text-[#33260E] dark:text-[#F2CB7E]',
    progressFill: 'bg-[#B98223] dark:bg-[#F2CB7E]',
  },
  amber: {
    id: 'amber',
    swatchHex: '#C27424',
    cardBg: 'bg-[#F9EDE0] dark:bg-[#533519]',
    cardBorder: 'border-[#ECD2B8] dark:border-[#6C4724]',
    cardTitle: 'text-[#36200A] dark:text-[#FDF0E3]',
    cardMuted: 'text-[#7C5028] dark:text-[#E4BA92]',
    cardPlusBg: 'bg-[#C46B1E] hover:bg-[#AE5D18] dark:bg-[#F4B97E] dark:hover:bg-[#F7C796]',
    cardPlusText: 'text-white dark:text-[#2F1A06]',
    cardMinusBg: 'bg-[#F1DBC4] hover:bg-[#E7C9AA] dark:bg-[#22160B] dark:hover:bg-[#2F1F10]',
    cardMinusText: 'text-[#36200A] dark:text-[#FDF0E3]',
    focusBg: 'bg-[#FDF7F0] dark:bg-[#1C130A]',
    focusText: 'text-[#A05616] dark:text-[#F4B97E]',
    focusMuted: 'text-[#876240] dark:text-[#C6A07B]',
    focusPrimaryBg: 'bg-[#C46B1E] hover:bg-[#AE5D18] dark:bg-[#F4B97E] dark:hover:bg-[#F7C796]',
    focusPrimaryText: 'text-white dark:text-[#2F1A06]',
    focusSecondaryBg: 'bg-[#F0DFCE] hover:bg-[#E7CFBA] dark:bg-[#3D2815] dark:hover:bg-[#4E341C]',
    focusSecondaryText: 'text-[#36200A] dark:text-[#F4B97E]',
    progressFill: 'bg-[#C46B1E] dark:bg-[#F4B97E]',
  },
  navy: {
    id: 'navy',
    swatchHex: '#1D4ED8',
    cardBg: 'bg-[#E8EFFB] dark:bg-[#1F2D49]',
    cardBorder: 'border-[#C9DAF5] dark:border-[#2C3F66]',
    cardTitle: 'text-[#101C36] dark:text-[#EAF1FD]',
    cardMuted: 'text-[#3E5583] dark:text-[#A9C0EA]',
    cardPlusBg: 'bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#A8C7FA] dark:hover:bg-[#BDD5FC]',
    cardPlusText: 'text-white dark:text-[#0B1E42]',
    cardMinusBg: 'bg-[#D5E2F7] hover:bg-[#C3D5F4] dark:bg-[#101829] dark:hover:bg-[#172238]',
    cardMinusText: 'text-[#101C36] dark:text-[#EAF1FD]',
    focusBg: 'bg-[#F4F7FD] dark:bg-[#0D131F]',
    focusText: 'text-[#1D4ED8] dark:text-[#A8C7FA]',
    focusMuted: 'text-[#4B618D] dark:text-[#869EC9]',
    focusPrimaryBg: 'bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#A8C7FA] dark:hover:bg-[#BDD5FC]',
    focusPrimaryText: 'text-white dark:text-[#0B1E42]',
    focusSecondaryBg: 'bg-[#DBE5F7] hover:bg-[#CCD9F4] dark:bg-[#1C2840] dark:hover:bg-[#243452]',
    focusSecondaryText: 'text-[#101C36] dark:text-[#A8C7FA]',
    progressFill: 'bg-[#2563EB] dark:bg-[#A8C7FA]',
  },
  plum: {
    id: 'plum',
    swatchHex: '#7C4D79',
    cardBg: 'bg-[#F3EAF4] dark:bg-[#493047]',
    cardBorder: 'border-[#DFCBE1] dark:border-[#61405F]',
    cardTitle: 'text-[#2D182C] dark:text-[#F8ECF8]',
    cardMuted: 'text-[#6A4568] dark:text-[#D7B6D5]',
    cardPlusBg: 'bg-[#7D4679] hover:bg-[#6A3A67] dark:bg-[#E7BBE4] dark:hover:bg-[#EECBF0]',
    cardPlusText: 'text-white dark:text-[#2B1329]',
    cardMinusBg: 'bg-[#E8D5E9] hover:bg-[#DBC1DD] dark:bg-[#1E131D] dark:hover:bg-[#2A1B29]',
    cardMinusText: 'text-[#2D182C] dark:text-[#F8ECF8]',
    focusBg: 'bg-[#FAF5FA] dark:bg-[#181018]',
    focusText: 'text-[#6D3B6A] dark:text-[#E7BBE4]',
    focusMuted: 'text-[#7A5678] dark:text-[#B996B7]',
    focusPrimaryBg: 'bg-[#7D4679] hover:bg-[#6A3A67] dark:bg-[#E7BBE4] dark:hover:bg-[#EECBF0]',
    focusPrimaryText: 'text-white dark:text-[#2B1329]',
    focusSecondaryBg: 'bg-[#EBDAEC] hover:bg-[#E0C8E2] dark:bg-[#382436] dark:hover:bg-[#482F46]',
    focusSecondaryText: 'text-[#2D182C] dark:text-[#E7BBE4]',
    progressFill: 'bg-[#7D4679] dark:bg-[#E7BBE4]',
  },
};

export const COUNTER_COLOR_IDS: CounterColorId[] = [
  'terracotta',
  'olive',
  'teal',
  'gold',
  'amber',
  'navy',
  'plum',
];
