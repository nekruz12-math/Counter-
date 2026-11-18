import type { CounterColorId } from '../types/counter';

export interface CounterColorPalette {
  id: CounterColorId;
  swatchHex: string;
  // List card styles (Dark & Light) — vibrant, luminous flagship tones
  cardBg: string;
  cardBorder: string;
  cardTitle: string;
  cardMuted: string;
  // Focus full-screen styles (Dark & Light)
  focusBg: string;
  focusText: string;
  focusMuted: string;
  focusPrimaryBg: string;
  focusPrimaryText: string;
  focusSecondaryBg: string;
  focusSecondaryText: string;
  progressFill: string;
  ringStroke: string;
}

export const COUNTER_THEMES: Record<CounterColorId, CounterColorPalette> = {
  terracotta: {
    id: 'terracotta',
    swatchHex: '#E85D44',
    cardBg: 'bg-gradient-to-br from-[#FFEBE6] to-[#FAD8CF] dark:from-[#3A221E] dark:to-[#2B1916]',
    cardBorder: 'border-[#F2B8A9] dark:border-[#5C352E]',
    cardTitle: 'text-[#3A140C] dark:text-[#FFF0EC]',
    cardMuted: 'text-[#8C3B2B] dark:text-[#F0B2A4]',
    focusBg: 'bg-[#FFF5F2] dark:bg-[#19110F]',
    focusText: 'text-[#C43E26] dark:text-[#FF9E8A]',
    focusMuted: 'text-[#8F4D3F] dark:text-[#CC968A]',
    focusPrimaryBg: 'bg-[#E55339] hover:bg-[#D1462D] dark:bg-[#FF8E75] dark:hover:bg-[#FFA08B]',
    focusPrimaryText: 'text-white dark:text-[#2B0E08]',
    focusSecondaryBg: 'bg-[#F7D7CE] hover:bg-[#F0C5B9] dark:bg-[#38211D] dark:hover:bg-[#472A25]',
    focusSecondaryText: 'text-[#3A140C] dark:text-[#FFB4A3]',
    progressFill: 'bg-[#E55339] dark:bg-[#FF8E75]',
    ringStroke: '#FF8E75',
  },
  olive: {
    id: 'olive',
    swatchHex: '#3BA55D',
    cardBg: 'bg-gradient-to-br from-[#E6FAEC] to-[#CFF2DA] dark:from-[#1B3624] dark:to-[#14291B]',
    cardBorder: 'border-[#A3E2B7] dark:border-[#2E5C3D]',
    cardTitle: 'text-[#0E331A] dark:text-[#EAFFF0]',
    cardMuted: 'text-[#266E3E] dark:text-[#9CE0B2]',
    focusBg: 'bg-[#F2FCF5] dark:bg-[#0F1912]',
    focusText: 'text-[#218040] dark:text-[#7CE89E]',
    focusMuted: 'text-[#3C7850] dark:text-[#8CC49E]',
    focusPrimaryBg: 'bg-[#2E9E52] hover:bg-[#258945] dark:bg-[#6EE294] dark:hover:bg-[#85EAA6]',
    focusPrimaryText: 'text-white dark:text-[#0A2613]',
    focusSecondaryBg: 'bg-[#CBEED6] hover:bg-[#B8E6C6] dark:bg-[#213D2A] dark:hover:bg-[#2A4D35]',
    focusSecondaryText: 'text-[#0E331A] dark:text-[#98EDA8]',
    progressFill: 'bg-[#2E9E52] dark:bg-[#6EE294]',
    ringStroke: '#6EE294',
  },
  teal: {
    id: 'teal',
    swatchHex: '#149CA6',
    cardBg: 'bg-gradient-to-br from-[#E3F9FB] to-[#C8EFF2] dark:from-[#163538] dark:to-[#11282B]',
    cardBorder: 'border-[#9ADFE5] dark:border-[#275A5F]',
    cardTitle: 'text-[#0A2E31] dark:text-[#E8FCFD]',
    cardMuted: 'text-[#1E6C73] dark:text-[#92DEE3]',
    focusBg: 'bg-[#F0FAFB] dark:bg-[#0D181A]',
    focusText: 'text-[#0F7E87] dark:text-[#6EE2EB]',
    focusMuted: 'text-[#37757A] dark:text-[#82C3C8]',
    focusPrimaryBg: 'bg-[#12929C] hover:bg-[#0E7D86] dark:bg-[#62DCE5] dark:hover:bg-[#7BE3EB]',
    focusPrimaryText: 'text-white dark:text-[#072427]',
    focusSecondaryBg: 'bg-[#C6ECF0] hover:bg-[#B2E3E8] dark:bg-[#1D3C40] dark:hover:bg-[#254C51]',
    focusSecondaryText: 'text-[#0A2E31] dark:text-[#8BE8EF]',
    progressFill: 'bg-[#12929C] dark:bg-[#62DCE5]',
    ringStroke: '#62DCE5',
  },
  gold: {
    id: 'gold',
    swatchHex: '#E09F1F',
    cardBg: 'bg-gradient-to-br from-[#FFF6DE] to-[#FCE8B8] dark:from-[#382C14] dark:to-[#2B210E]',
    cardBorder: 'border-[#F2CE7E] dark:border-[#5E4920]',
    cardTitle: 'text-[#362505] dark:text-[#FFF7E3]',
    cardMuted: 'text-[#825B10] dark:text-[#F0CD7F]',
    focusBg: 'bg-[#FFFBF0] dark:bg-[#18130A]',
    focusText: 'text-[#A67108] dark:text-[#FFD166]',
    focusMuted: 'text-[#856425] dark:text-[#C9AF71]',
    focusPrimaryBg: 'bg-[#D99614] hover:bg-[#C2840E] dark:bg-[#FFCE5C] dark:hover:bg-[#FFD87A]',
    focusPrimaryText: 'text-white dark:text-[#2B1D04]',
    focusSecondaryBg: 'bg-[#F7E2B0] hover:bg-[#F0D597] dark:bg-[#382B14] dark:hover:bg-[#473719]',
    focusSecondaryText: 'text-[#362505] dark:text-[#FFD87A]',
    progressFill: 'bg-[#D99614] dark:bg-[#FFCE5C]',
    ringStroke: '#FFCE5C',
  },
  amber: {
    id: 'amber',
    swatchHex: '#EA7325',
    cardBg: 'bg-gradient-to-br from-[#FFF0E3] to-[#FCDCC2] dark:from-[#3B2414] dark:to-[#2C1A0E]',
    cardBorder: 'border-[#F5BC90] dark:border-[#613B20]',
    cardTitle: 'text-[#381B07] dark:text-[#FFF2E8]',
    cardMuted: 'text-[#8C4616] dark:text-[#F5BA8E]',
    focusBg: 'bg-[#FFF7F0] dark:bg-[#19110B]',
    focusText: 'text-[#BF5611] dark:text-[#FFAB6E]',
    focusMuted: 'text-[#8C5632] dark:text-[#CCA081]',
    focusPrimaryBg: 'bg-[#E56A19] hover:bg-[#CC5C12] dark:bg-[#FFA361] dark:hover:bg-[#FFB37B]',
    focusPrimaryText: 'text-white dark:text-[#2B1405]',
    focusSecondaryBg: 'bg-[#FAD7BA] hover:bg-[#F5C8A3] dark:bg-[#3A2314] dark:hover:bg-[#4A2D1A]',
    focusSecondaryText: 'text-[#381B07] dark:text-[#FFB884]',
    progressFill: 'bg-[#E56A19] dark:bg-[#FFA361]',
    ringStroke: '#FFA361',
  },
  navy: {
    id: 'navy',
    swatchHex: '#3867E8',
    cardBg: 'bg-gradient-to-br from-[#EBF1FF] to-[#D4E2FF] dark:from-[#1B284A] dark:to-[#141E38]',
    cardBorder: 'border-[#A8C3FA] dark:border-[#304880]',
    cardTitle: 'text-[#0F1E42] dark:text-[#EDF3FF]',
    cardMuted: 'text-[#2D4E9E] dark:text-[#A3C0FA]',
    focusBg: 'bg-[#F4F7FF] dark:bg-[#0E1424]',
    focusText: 'text-[#2554D4] dark:text-[#8AB1FF]',
    focusMuted: 'text-[#4762A6] dark:text-[#8BA3D9]',
    focusPrimaryBg: 'bg-[#3262E3] hover:bg-[#2652CC] dark:bg-[#82ACFF] dark:hover:bg-[#99BCFF]',
    focusPrimaryText: 'text-white dark:text-[#0B193B]',
    focusSecondaryBg: 'bg-[#D1E0FF] hover:bg-[#BDD2FF] dark:bg-[#213057] dark:hover:bg-[#2B3E6E]',
    focusSecondaryText: 'text-[#0F1E42] dark:text-[#A3C2FF]',
    progressFill: 'bg-[#3262E3] dark:bg-[#82ACFF]',
    ringStroke: '#82ACFF',
  },
  plum: {
    id: 'plum',
    swatchHex: '#9C4EE0',
    cardBg: 'bg-gradient-to-br from-[#F5EBFF] to-[#E6D1FA] dark:from-[#311E42] dark:to-[#241630]',
    cardBorder: 'border-[#CCA8F0] dark:border-[#52326E]',
    cardTitle: 'text-[#2B1040] dark:text-[#F7EDFF]',
    cardMuted: 'text-[#6A3299] dark:text-[#D5ACF7]',
    focusBg: 'bg-[#FAF5FF] dark:bg-[#160E1F]',
    focusText: 'text-[#7E34BF] dark:text-[#D79EFF]',
    focusMuted: 'text-[#734A96] dark:text-[#B993D4]',
    focusPrimaryBg: 'bg-[#8E3FD4] hover:bg-[#7B32BD] dark:bg-[#CF91FF] dark:hover:bg-[#DAA6FF]',
    focusPrimaryText: 'text-white dark:text-[#240B38]',
    focusSecondaryBg: 'bg-[#E5CEFA] hover:bg-[#DABCF7] dark:bg-[#331F45] dark:hover:bg-[#412857]',
    focusSecondaryText: 'text-[#2B1040] dark:text-[#E0B3FF]',
    progressFill: 'bg-[#8E3FD4] dark:bg-[#CF91FF]',
    ringStroke: '#CF91FF',
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
