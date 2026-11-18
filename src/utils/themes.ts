import type { CounterColorId } from '../types/counter';

export interface CounterColorPalette {
  id: CounterColorId;
  swatchHex: string;
  // List card styles (Dark & Light) — eye-soothing velvety tones
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
    swatchHex: '#D06B53',
    cardBg: 'bg-[#F5E9E4] dark:bg-[#2C201D]',
    cardBorder: 'border-[#E6CFC7] dark:border-[#42302B]',
    cardTitle: 'text-[#331C16] dark:text-[#F6E8E3]',
    cardMuted: 'text-[#734A3F] dark:text-[#C9A69B]',
    focusBg: 'bg-[#F9F3F0] dark:bg-[#171210]',
    focusText: 'text-[#843824] dark:text-[#F0B4A1]',
    focusMuted: 'text-[#82594E] dark:text-[#B58E82]',
    focusPrimaryBg: 'bg-[#C9644C] hover:bg-[#B85740] dark:bg-[#EBA893] dark:hover:bg-[#F2B7A5]',
    focusPrimaryText: 'text-white dark:text-[#2D1610]',
    focusSecondaryBg: 'bg-[#EADAD3] hover:bg-[#DFCAC1] dark:bg-[#2E211E] dark:hover:bg-[#3A2A26]',
    focusSecondaryText: 'text-[#331C16] dark:text-[#F0B4A1]',
    progressFill: 'bg-[#C9644C] dark:bg-[#EBA893]',
    ringStroke: '#EBA893',
  },
  olive: {
    id: 'olive',
    swatchHex: '#5E7A52',
    cardBg: 'bg-[#E9F0E6] dark:bg-[#1D271B]',
    cardBorder: 'border-[#CEDCCB] dark:border-[#2E3E2B]',
    cardTitle: 'text-[#1B2818] dark:text-[#E6F1E3]',
    cardMuted: 'text-[#486043] dark:text-[#A8C1A2]',
    focusBg: 'bg-[#F3F7F2] dark:bg-[#111610]',
    focusText: 'text-[#3B5934] dark:text-[#B4D6AB]',
    focusMuted: 'text-[#587053] dark:text-[#8FA889]',
    focusPrimaryBg: 'bg-[#4E6E44] hover:bg-[#425E39] dark:bg-[#AED1A4] dark:hover:bg-[#BCE0B3]',
    focusPrimaryText: 'text-white dark:text-[#152212]',
    focusSecondaryBg: 'bg-[#DCE7D8] hover:bg-[#CEDCC9] dark:bg-[#232F20] dark:hover:bg-[#2C3B29]',
    focusSecondaryText: 'text-[#1B2818] dark:text-[#B4D6AB]',
    progressFill: 'bg-[#4E6E44] dark:bg-[#AED1A4]',
    ringStroke: '#AED1A4',
  },
  teal: {
    id: 'teal',
    swatchHex: '#2A7B80',
    cardBg: 'bg-[#E4F0F1] dark:bg-[#19282A]',
    cardBorder: 'border-[#C5DEDE] dark:border-[#294043]',
    cardTitle: 'text-[#12292B] dark:text-[#E3F3F4]',
    cardMuted: 'text-[#3D676A] dark:text-[#9AC6C9]',
    focusBg: 'bg-[#F1F8F8] dark:bg-[#0F1718]',
    focusText: 'text-[#1D6266] dark:text-[#8FD1D4]',
    focusMuted: 'text-[#4B7477] dark:text-[#7DA8AB]',
    focusPrimaryBg: 'bg-[#236E73] hover:bg-[#1C5D61] dark:bg-[#88CFD2] dark:hover:bg-[#9CD9DC]',
    focusPrimaryText: 'text-white dark:text-[#0C2527]',
    focusSecondaryBg: 'bg-[#D3E6E7] hover:bg-[#C3DCDD] dark:bg-[#1F3133] dark:hover:bg-[#283E41]',
    focusSecondaryText: 'text-[#12292B] dark:text-[#8FD1D4]',
    progressFill: 'bg-[#236E73] dark:bg-[#88CFD2]',
    ringStroke: '#88CFD2',
  },
  gold: {
    id: 'gold',
    swatchHex: '#C4923E',
    cardBg: 'bg-[#F4EFE1] dark:bg-[#2B2418]',
    cardBorder: 'border-[#E2D6BA] dark:border-[#423724]',
    cardTitle: 'text-[#2E2310] dark:text-[#F6EFE0]',
    cardMuted: 'text-[#6D562D] dark:text-[#CFB98E]',
    focusBg: 'bg-[#F9F6EE] dark:bg-[#16130D]',
    focusText: 'text-[#87601B] dark:text-[#E9C67E]',
    focusMuted: 'text-[#78623B] dark:text-[#B8A173]',
    focusPrimaryBg: 'bg-[#B07E29] hover:bg-[#9A6D21] dark:bg-[#E6C278] dark:hover:bg-[#EED08E]',
    focusPrimaryText: 'text-white dark:text-[#281E0A]',
    focusSecondaryBg: 'bg-[#E8DEC5] hover:bg-[#DDD0B1] dark:bg-[#2D2518] dark:hover:bg-[#392F1F]',
    focusSecondaryText: 'text-[#2E2310] dark:text-[#E9C67E]',
    progressFill: 'bg-[#B07E29] dark:bg-[#E6C278]',
    ringStroke: '#E6C278',
  },
  amber: {
    id: 'amber',
    swatchHex: '#C27438',
    cardBg: 'bg-[#F5EBE1] dark:bg-[#2C2017]',
    cardBorder: 'border-[#E4CEBA] dark:border-[#443123]',
    cardTitle: 'text-[#331F10] dark:text-[#F7ECE2]',
    cardMuted: 'text-[#754D2F] dark:text-[#D2AE90]',
    focusBg: 'bg-[#FAF4EE] dark:bg-[#17110C]',
    focusText: 'text-[#915120] dark:text-[#EEB688]',
    focusMuted: 'text-[#7F5C41] dark:text-[#B99577]',
    focusPrimaryBg: 'bg-[#B86628] hover:bg-[#A35820] dark:bg-[#ECB282] dark:hover:bg-[#F2C197]',
    focusPrimaryText: 'text-white dark:text-[#2B1708]',
    focusSecondaryBg: 'bg-[#EAD9C8] hover:bg-[#DFC9B4] dark:bg-[#2F2218] dark:hover:bg-[#3C2B1F]',
    focusSecondaryText: 'text-[#331F10] dark:text-[#EEB688]',
    progressFill: 'bg-[#B86628] dark:bg-[#ECB282]',
    ringStroke: '#ECB282',
  },
  navy: {
    id: 'navy',
    swatchHex: '#3B63B8',
    cardBg: 'bg-[#E7EEF9] dark:bg-[#1B2336]',
    cardBorder: 'border-[#C9D8F0] dark:border-[#2B3754]',
    cardTitle: 'text-[#141F36] dark:text-[#E7EFFC]',
    cardMuted: 'text-[#435882] dark:text-[#A4B9E0]',
    focusBg: 'bg-[#F2F6FC] dark:bg-[#101520]',
    focusText: 'text-[#284E9E] dark:text-[#A3C2F7]',
    focusMuted: 'text-[#4F648C] dark:text-[#859CC7]',
    focusPrimaryBg: 'bg-[#335BB0] hover:bg-[#2A4E99] dark:bg-[#9EC0F7] dark:hover:bg-[#B1CEFA]',
    focusPrimaryText: 'text-white dark:text-[#101E3B]',
    focusSecondaryBg: 'bg-[#D7E3F5] hover:bg-[#C6D6EE] dark:bg-[#202A40] dark:hover:bg-[#293652]',
    focusSecondaryText: 'text-[#141F36] dark:text-[#A3C2F7]',
    progressFill: 'bg-[#335BB0] dark:bg-[#9EC0F7]',
    ringStroke: '#9EC0F7',
  },
  plum: {
    id: 'plum',
    swatchHex: '#7B5282',
    cardBg: 'bg-[#EFE8F2] dark:bg-[#281E2B]',
    cardBorder: 'border-[#DACBE0] dark:border-[#3E2F43]',
    cardTitle: 'text-[#2A192E] dark:text-[#F3EAF6]',
    cardMuted: 'text-[#64446B] dark:text-[#C9A8CF]',
    focusBg: 'bg-[#F7F3F9] dark:bg-[#151017]',
    focusText: 'text-[#663A6E] dark:text-[#DFB6E6]',
    focusMuted: 'text-[#725278] dark:text-[#B08FB6]',
    focusPrimaryBg: 'bg-[#73457B] hover:bg-[#623969] dark:bg-[#DCB2E3] dark:hover:bg-[#E5C2EB]',
    focusPrimaryText: 'text-white dark:text-[#27132B]',
    focusSecondaryBg: 'bg-[#E4D6E8] hover:bg-[#D7C4DD] dark:bg-[#2B202E] dark:hover:bg-[#37293B]',
    focusSecondaryText: 'text-[#2A192E] dark:text-[#DFB6E6]',
    progressFill: 'bg-[#73457B] dark:bg-[#DCB2E3]',
    ringStroke: '#DCB2E3',
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
