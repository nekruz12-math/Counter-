import type { Language } from '../types/counter';

export interface SmartTranslations {
  appName: string;
  navHome: string;
  navStats: string;
  navGoals: string;
  navSettings: string;
  addCounter: string;
  newCounterTitle: string;
  editCounterTitle: string;
  settingsSubtitle: string;
  nameLabel: string;
  namePlaceholder: string;
  valueLabel: string;
  limitLabel: string;
  dailyGoalLabel: string;
  dailyGoalHint: string;
  dailyGoalProgress: string;
  dailyGoalDone: string;
  unitLabel: string;
  unitPlaceholder: string;
  colorSchemeLabel: string;
  reminderLabel: string;
  reminderHint: string;
  streakLabel: string;
  streakDesc: string;
  resetCounterLabel: string;
  resetPreservesLimit: string;
  deleteCounterLabel: string;
  confirmDeleteLabel: string;
  cancelLabel: string;
  saveLabel: string;
  createLabel: string;
  limitReached: string;
  overLimit: string;
  remaining: string;
  undoResetText: string;
  undoBtn: string;
  emptyCountersTitle: string;
  emptyCountersSub: string;
  statsBreakdown: string;
  goalsCompletedTitle: string;
  goalsDailyTitle: string;
  goalsEmpty: string;
  languageLabel: string;
  themeLabel: string;
  themeDark: string;
  themeLight: string;
  scheduleDarkLabel: string;
  scheduleDarkDesc: string;
  sunriseLabel: string;
  sunsetLabel: string;
  updateGpsBtn: string;
  soundLabel: string;
  hapticLabel: string;
  hapticIntensityLabel: string;
  intensityLow: string;
  intensityMedium: string;
  intensityHigh: string;
  notificationsLabel: string;
  notificationsDesc: string;
  notificationsGranted: string;
  notificationsBlocked: string;
  stepLabel: string;
  daysStreak: string;
  trendUpLabel: string;
  trendDownLabel: string;
  powerSaverLabel: string;
  powerSaverDesc: string;
  reminderAlertTitle: string;
  reminderAlertBody: string;
  reminderOpenBtn: string;
  weeklyInsightsTitle: string;
  weeklyInsightsPeriod: string;
  avgDailyCountLabel: string;
  mostProductiveDayLabel: string;
  weeklyTotalLabel: string;
  weeklySelectedDayAvg: string;
  weeklyNoData: string;
  weekdaysShort: readonly [string, string, string, string, string, string, string];
  weekdaysFull: readonly [string, string, string, string, string, string, string];
  securitySectionTitle: string;
  pinLockLabel: string;
  pinLockDesc: string;
  setPinBtn: string;
  changePinBtn: string;
  removePinBtn: string;
  enterPinTitle: string;
  enterPinSubtitle: string;
  enterNewPinTitle: string;
  confirmNewPinTitle: string;
  pinMismatchError: string;
  wrongPinError: string;
  biometricLabel: string;
  biometricDesc: string;
  unlockWithFingerprint: string;
  lockNowBtn: string;
  versionFooterLabel: string;
  versionDataSafeNote: string;
}

export const SMART_TRANSLATIONS: Record<Language, SmartTranslations> = {
  tg: {
    appName: 'Counter',
    navHome: 'Асосӣ',
    navStats: 'Омор',
    navGoals: 'Мақсадҳо',
    navSettings: 'Танзимот',
    addCounter: 'Иловаи ҳисобкунак',
    newCounterTitle: 'Ҳисобкунаки нав',
    editCounterTitle: 'Танзимот',
    settingsSubtitle: 'Танзимоти ҳисобкунак',
    nameLabel: 'Ном',
    namePlaceholder: 'Масалан: Салавот, Истиғфор...',
    valueLabel: 'Қимати ҷорӣ',
    limitLabel: 'Лимити умумӣ',
    dailyGoalLabel: 'Мақсади рӯзона (24 соат)',
    dailyGoalHint: 'Ҳар рӯз дар 24 соат худкор сифр мешавад (0 = бе мақсад)',
    dailyGoalProgress: 'Имрӯз',
    dailyGoalDone: 'Иҷро шуд',
    unitLabel: 'Воҳид (ихтиёрӣ)',
    unitPlaceholder: 'та / дақ',
    colorSchemeLabel: 'Нақшаи рангҳои дилнишин',
    reminderLabel: 'Ёдраскунии мақсади рӯзона',
    reminderHint: 'Огоҳӣ агар то ин вақт мақсади рӯзона пур нашавад',
    streakLabel: 'Силсилаи ҳаррӯза (Streak)',
    streakDesc: 'Ҳисоби рӯзҳои пайдарпай барои ин одат',
    resetCounterLabel: 'Сифр кардани ҳисобкунак',
    resetPreservesLimit: 'Қимат ба 0 меравад, лимит боқӣ мемонад',
    deleteCounterLabel: 'Нест кардани ҳисобкунак',
    confirmDeleteLabel: 'Тасдиқи несткунӣ',
    cancelLabel: 'Бекор кардан',
    saveLabel: 'Захира кардан',
    createLabel: 'Сохтан',
    limitReached: 'Лимит пур шуд',
    overLimit: 'изофа',
    remaining: 'Боқимонда',
    undoResetText: 'Ба сифр баргардонида шуд',
    undoBtn: 'Бозгашт',
    emptyCountersTitle: 'Ҳанӯз ягон ҳисобкунак нест',
    emptyCountersSub: 'Тугмаи + дар поёнро зер кунед ва аввалин ҳисобкунаки худро созед.',
    statsBreakdown: 'Пешрафти ҳар як ҳисобкунак',
    goalsCompletedTitle: 'Мақсадҳои ба лимит расида',
    goalsDailyTitle: 'Мақсадҳои рӯзонаи имрӯз',
    goalsEmpty: 'Ҳоло ягон ҳисобкунак ба лимит нарасидааст.',
    languageLabel: 'Забони барнома',
    themeLabel: 'Намуди экран',
    themeDark: 'Торик',
    themeLight: 'Равшан',
    scheduleDarkLabel: 'Реҷаи торик аз рӯи офтоб',
    scheduleDarkDesc: 'Гузариши худкор дар вақти тулӯъ ва ғуруби офтоб',
    sunriseLabel: 'Тулӯъ',
    sunsetLabel: 'Ғуруб',
    updateGpsBtn: 'Макони дақиқ',
    soundLabel: 'Садои зеркунӣ ва расидан ба лимит',
    hapticLabel: 'Ларзиш (Вибрация)',
    hapticIntensityLabel: 'Шиддати ларзиш',
    intensityLow: 'Паст',
    intensityMedium: 'Миёна',
    intensityHigh: 'Баланд',
    notificationsLabel: 'Огоҳиномаи мақсади рӯзона',
    notificationsDesc: 'Фиристодани ёдраскунӣ агар мақсади рӯзона пур нашавад',
    notificationsGranted: 'Огоҳиномаҳо фаъоланд',
    notificationsBlocked: 'Огоҳиномаи дохилӣ фаъол аст',
    stepLabel: 'Қадам',
    daysStreak: 'рӯз',
    trendUpLabel: 'Нисбат ба ҳафтаи гузашта зиёд шуд',
    trendDownLabel: 'Нисбат ба ҳафтаи гузашта кам шуд',
    powerSaverLabel: 'Сарфаи батарея (Power Saver)',
    powerSaverDesc: 'Аниматсияҳоро хомӯш мекунад, сабти худкор фаъол мемонад',
    reminderAlertTitle: 'Ёдраскунии мақсади рӯзона',
    reminderAlertBody: 'Мақсади имрӯз ҳанӯз пур нашудааст',
    reminderOpenBtn: 'Ҳисоб кардан',
    weeklyInsightsTitle: 'Таҳлили ҳафтаина',
    weeklyInsightsPeriod: '4 ҳафтаи охир',
    avgDailyCountLabel: 'Миёнаи рӯзона',
    mostProductiveDayLabel: 'Рӯзи сермаҳсултарин',
    weeklyTotalLabel: 'Ҷамъи 4 ҳафта',
    weeklySelectedDayAvg: 'Миёна дар ин рӯз',
    weeklyNoData: 'Барои дидани графики 4-ҳафтаина ҳисобкуниро оғоз кунед',
    weekdaysShort: ['Дш', 'Сш', 'Чш', 'Пш', 'Ҷм', 'Шб', 'Яш'],
    weekdaysFull: ['Душанбе', 'Сешанбе', 'Чоршанбе', 'Панҷшанбе', 'Ҷумъа', 'Шанбе', 'Якшанбе'],
    securitySectionTitle: 'Амният ва Қулфи Барнома',
    pinLockLabel: 'Пароли 4-рақама (PIN)',
    pinLockDesc: 'Муҳофизати барнома бо рамзи 4-рақама ҳангоми даромадан',
    setPinBtn: 'Гузоштани PIN',
    changePinBtn: 'Ивази PIN',
    removePinBtn: 'Хомӯш кардан',
    enterPinTitle: 'Рамзи PIN-ро ворид кунед',
    enterPinSubtitle: 'Барои кушодани Counter рамзи 4-рақамаро занед',
    enterNewPinTitle: 'Рамзи нави 4-рақама',
    confirmNewPinTitle: 'Рамзро такрор кунед',
    pinMismatchError: 'Рамзҳо мувофиқ наомаданд, аз нав ворид кунед',
    wrongPinError: 'Рамзи PIN нодуруст аст',
    biometricLabel: 'Кушодан бо изи ангушт',
    biometricDesc: 'Истифодаи сканери изи ангушти телефон барои кушодани зуд',
    unlockWithFingerprint: 'Кушодан бо изи ангушт',
    lockNowBtn: 'Қулф кардан',
    versionFooterLabel: 'Версияи 2.0.0 · Навсозии бехатар',
    versionDataSafeNote: 'Ҳангоми навсозӣ (Обновить) ҳамаи ҳисобкунакҳо ва танзимоти шумо пурра ҳифз мешаванд.',
  },
  ru: {
    appName: 'Counter',
    navHome: 'Главная',
    navStats: 'Статистика',
    navGoals: 'Цели',
    navSettings: 'Настройки',
    addCounter: 'Добавить счётчик',
    newCounterTitle: 'Новый счётчик',
    editCounterTitle: 'Настройки',
    settingsSubtitle: 'Настройки счётчика',
    nameLabel: 'Название',
    namePlaceholder: 'Например: SLWT, Вода, Шаги...',
    valueLabel: 'Значение',
    limitLabel: 'Общий лимит',
    dailyGoalLabel: 'Дневная цель (24ч)',
    dailyGoalHint: 'Сбрасывается автоматически каждые 24 часа (0 = без цели)',
    dailyGoalProgress: 'Сегодня',
    dailyGoalDone: 'Выполнено',
    unitLabel: 'Единица (опц.)',
    unitPlaceholder: 'шт / мин',
    colorSchemeLabel: 'Палитра оттенков',
    reminderLabel: 'Напоминание о дневной цели',
    reminderHint: 'Напомнит, если дневная цель не выполнена к этому времени',
    streakLabel: 'Цепочка привычек',
    streakDesc: 'Отслеживать ежедневную серию для этого счётчика',
    resetCounterLabel: 'Сбросить счётчик',
    resetPreservesLimit: 'Сбрасывает значение до 0, сохраняя лимит',
    deleteCounterLabel: 'Удалить счётчик',
    confirmDeleteLabel: 'Подтвердить удаление',
    cancelLabel: 'Отмена',
    saveLabel: 'Сохранить',
    createLabel: 'Создать',
    limitReached: 'Лимит достигнут',
    overLimit: 'сверх лимита',
    remaining: 'Осталось',
    undoResetText: 'Сброшено до 0',
    undoBtn: 'Отменить',
    emptyCountersTitle: 'Пока нет счётчиков',
    emptyCountersSub: 'Нажмите кнопку + внизу, чтобы создать первый счётчик.',
    statsBreakdown: 'Прогресс по счётчикам',
    goalsCompletedTitle: 'Достигнутые общие цели',
    goalsDailyTitle: 'Дневные цели на сегодня',
    goalsEmpty: 'Пока ни один счётчик не достиг лимита.',
    languageLabel: 'Язык интерфейса',
    themeLabel: 'Тема оформления',
    themeDark: 'Тёмная',
    themeLight: 'Светлая',
    scheduleDarkLabel: 'Тёмная тема по расписанию солнца',
    scheduleDarkDesc: 'Автопереключение по времени местного восхода и заката',
    sunriseLabel: 'Восход',
    sunsetLabel: 'Закат',
    updateGpsBtn: 'Точная геопозиция',
    soundLabel: 'Звук нажатия и достижения цели',
    hapticLabel: 'Вибрация при нажатии',
    hapticIntensityLabel: 'Сила вибрации',
    intensityLow: 'Низкая',
    intensityMedium: 'Средняя',
    intensityHigh: 'Высокая',
    notificationsLabel: 'Уведомления о дневной цели',
    notificationsDesc: 'Напоминание, если дневная цель ещё не выполнена',
    notificationsGranted: 'Уведомления разрешены',
    notificationsBlocked: 'Встроенные напоминания активны',
    stepLabel: 'Шаг',
    daysStreak: 'дн.',
    trendUpLabel: 'Чаще, чем на прошлой неделе',
    trendDownLabel: 'Реже, чем на прошлой неделе',
    powerSaverLabel: 'Энергосбережение',
    powerSaverDesc: 'Отключает анимации при мгновенном автосохранении',
    reminderAlertTitle: 'Напоминание о дневной цели',
    reminderAlertBody: 'Дневная цель ещё не достигнута',
    reminderOpenBtn: 'Считать',
    weeklyInsightsTitle: 'Еженедельная аналитика',
    weeklyInsightsPeriod: 'Последние 4 недели',
    avgDailyCountLabel: 'Среднее в день',
    mostProductiveDayLabel: 'Самый продуктивный день',
    weeklyTotalLabel: 'Всего за 4 нед.',
    weeklySelectedDayAvg: 'Среднее за день',
    weeklyNoData: 'Начните считать, чтобы увидеть график за 4 недели',
    weekdaysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    weekdaysFull: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
    securitySectionTitle: 'Безопасность и блокировка',
    pinLockLabel: '4-значный PIN-код',
    pinLockDesc: 'Защита входа в приложение 4-значным паролем',
    setPinBtn: 'Установить PIN',
    changePinBtn: 'Изменить PIN',
    removePinBtn: 'Отключить',
    enterPinTitle: 'Введите PIN-код',
    enterPinSubtitle: 'Введите 4-значный код для входа в Counter',
    enterNewPinTitle: 'Новый 4-значный PIN',
    confirmNewPinTitle: 'Повторите PIN-код',
    pinMismatchError: 'Коды не совпадают, попробуйте снова',
    wrongPinError: 'Неверный PIN-код',
    biometricLabel: 'Вход по отпечатку пальца',
    biometricDesc: 'Быстрая разблокировка сканером отпечатка пальца',
    unlockWithFingerprint: 'Разблокировать отпечатком',
    lockNowBtn: 'Заблокировать',
    versionFooterLabel: 'Версия 2.0.0 · Безопасное обновление',
    versionDataSafeNote: 'При обновлении (Обновить) все ваши счётчики и настройки полностью сохраняются.',
  },
  en: {
    appName: 'Counter',
    navHome: 'Home',
    navStats: 'Stats',
    navGoals: 'Goals',
    navSettings: 'Settings',
    addCounter: 'Add Counter',
    newCounterTitle: 'New Counter',
    editCounterTitle: 'Settings',
    settingsSubtitle: 'Counter Settings',
    nameLabel: 'Name',
    namePlaceholder: 'e.g. SLWT, Water, Reps...',
    valueLabel: 'Value',
    limitLabel: 'Total Limit',
    dailyGoalLabel: 'Daily Goal (24h)',
    dailyGoalHint: 'Automatically resets every 24 hours (0 = off)',
    dailyGoalProgress: 'Today',
    dailyGoalDone: 'Done',
    unitLabel: 'Unit (optional)',
    unitPlaceholder: 'pcs / min',
    colorSchemeLabel: 'Soothing Color Theme',
    reminderLabel: 'Daily Goal Reminder',
    reminderHint: 'Alerts if your daily goal is not met by this time',
    streakLabel: 'Habit Streak',
    streakDesc: 'Track consecutive active days for this counter',
    resetCounterLabel: 'Reset Counter to 0',
    resetPreservesLimit: 'Resets count to 0 without clearing the limit',
    deleteCounterLabel: 'Delete Counter',
    confirmDeleteLabel: 'Confirm Delete',
    cancelLabel: 'Cancel',
    saveLabel: 'Save',
    createLabel: 'Create',
    limitReached: 'Limit reached',
    overLimit: 'over',
    remaining: 'Remaining',
    undoResetText: 'Reset to zero',
    undoBtn: 'Undo',
    emptyCountersTitle: 'No counters yet',
    emptyCountersSub: 'Tap the + button below to create your first counter.',
    statsBreakdown: 'Counter Breakdown',
    goalsCompletedTitle: 'Reached & Exceeded Targets',
    goalsDailyTitle: "Today's Daily Goals",
    goalsEmpty: 'No counters have reached their target limit yet.',
    languageLabel: 'Language',
    themeLabel: 'Appearance',
    themeDark: 'Dark',
    themeLight: 'Light',
    scheduleDarkLabel: 'Schedule Dark Mode',
    scheduleDarkDesc: 'Automatically toggle light/dark at local sunrise & sunset',
    sunriseLabel: 'Sunrise',
    sunsetLabel: 'Sunset',
    updateGpsBtn: 'Precise location',
    soundLabel: 'Tap & milestone sounds',
    hapticLabel: 'Haptic vibration',
    hapticIntensityLabel: 'Haptic intensity',
    intensityLow: 'Low',
    intensityMedium: 'Medium',
    intensityHigh: 'High',
    notificationsLabel: 'Daily goal reminders',
    notificationsDesc: 'Reminder when your daily goal is not yet met',
    notificationsGranted: 'Notifications enabled',
    notificationsBlocked: 'In-app reminders active',
    stepLabel: 'Step',
    daysStreak: 'd',
    trendUpLabel: 'Increased vs. previous week',
    trendDownLabel: 'Decreased vs. previous week',
    powerSaverLabel: 'Power Saver mode',
    powerSaverDesc: 'Disables animations while keeping instant auto-save active',
    reminderAlertTitle: 'Daily Goal Reminder',
    reminderAlertBody: 'Daily goal is not completed yet',
    reminderOpenBtn: 'Count now',
    weeklyInsightsTitle: 'Weekly Insights',
    weeklyInsightsPeriod: 'Last 4 weeks',
    avgDailyCountLabel: 'Daily average',
    mostProductiveDayLabel: 'Most productive day',
    weeklyTotalLabel: '4-week total',
    weeklySelectedDayAvg: 'Day average',
    weeklyNoData: 'Start counting to populate your 4-week activity chart',
    weekdaysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    weekdaysFull: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    securitySectionTitle: 'Security & App Lock',
    pinLockLabel: '4-Digit PIN Passcode',
    pinLockDesc: 'Protect app access with a 4-digit passcode',
    setPinBtn: 'Set PIN',
    changePinBtn: 'Change PIN',
    removePinBtn: 'Disable',
    enterPinTitle: 'Enter Passcode',
    enterPinSubtitle: 'Enter your 4-digit PIN to unlock Counter',
    enterNewPinTitle: 'Enter New 4-Digit PIN',
    confirmNewPinTitle: 'Confirm 4-Digit PIN',
    pinMismatchError: 'PIN codes did not match, try again',
    wrongPinError: 'Incorrect PIN code',
    biometricLabel: 'Fingerprint Unlock',
    biometricDesc: 'Unlock quickly using your device fingerprint sensor',
    unlockWithFingerprint: 'Unlock with Fingerprint',
    lockNowBtn: 'Lock Now',
    versionFooterLabel: 'Version 2.0.0 · Data-Safe Update',
    versionDataSafeNote: 'All your counters and settings are automatically preserved when updating.',
  },
};
