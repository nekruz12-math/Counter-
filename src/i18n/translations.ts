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
  lockedLabel: string;
  lockedDesc: string;
  allowNegativeLabel: string;
  allowNegativeDesc: string;
  reminderLabel: string;
  reminderHint: string;
  streakLabel: string;
  streakDesc: string;
  counterHistoryLabel: string;
  noCounterHistory: string;
  resetCounterLabel: string;
  resetPreservesLimit: string;
  archiveCounterLabel: string;
  unarchiveCounterLabel: string;
  deleteCounterLabel: string;
  confirmDeleteLabel: string;
  cancelLabel: string;
  saveLabel: string;
  createLabel: string;
  limitReached: string;
  overLimit: string;
  remaining: string;
  lockedNotice: string;
  undoResetText: string;
  undoBtn: string;
  emptyCountersTitle: string;
  emptyCountersSub: string;
  statsTotalCount: string;
  statsActiveCounters: string;
  statsReachedTargets: string;
  statsTotalRounds: string;
  statsBreakdown: string;
  goalsCompletedTitle: string;
  goalsEmpty: string;
  archivedTitle: string;
  archivedEmpty: string;
  restoreBtn: string;
  languageLabel: string;
  themeLabel: string;
  themeDark: string;
  themeLight: string;
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
  clearHistory: string;
  stepLabel: string;
  daysStreak: string;
  trendUpLabel: string;
  trendDownLabel: string;
  powerSaverLabel: string;
  powerSaverDesc: string;
  quickActionsLabel: string;
  quickIncrementBtn: string;
  quickResetBtn: string;
  widgetTitle: string;
  widgetMostActive: string;
  widgetOpenFocus: string;
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
    dailyGoalProgress: 'Мақсади имрӯз',
    dailyGoalDone: 'Иҷро шуд',
    unitLabel: 'Воҳид (ихтиёрӣ)',
    unitPlaceholder: 'та / дақ',
    colorSchemeLabel: 'Нақшаи рангҳо',
    lockedLabel: 'Қулф шудааст',
    lockedDesc: 'Ҳисобкунакро қулф кунед, то тасодуфан тағйир наёбад',
    allowNegativeLabel: 'Қиматҳои манфӣ',
    allowNegativeDesc: 'Ҳисобкунак метавонад аз нол поён равад',
    reminderLabel: 'Ёдраскунии мақсади рӯзона',
    reminderHint: 'Огоҳӣ агар то ин вақт мақсади рӯзона пур нашавад',
    streakLabel: 'Силсилаи ҳаррӯза (Streak)',
    streakDesc: 'Ҳисоби рӯзҳои пайдарпай барои ин одат',
    counterHistoryLabel: 'Таърихи ҳисоб',
    noCounterHistory: 'Ҳанӯз ягон давр сифр карда нашудааст',
    resetCounterLabel: 'Сифр кардани ҳисобкунак',
    resetPreservesLimit: 'Қимат ба 0 меравад, лимит боқӣ мемонад',
    archiveCounterLabel: 'Бойгонӣ кардан',
    unarchiveCounterLabel: 'Аз бойгонӣ баровардан',
    deleteCounterLabel: 'Нест кардани ҳисобкунак',
    confirmDeleteLabel: 'Тасдиқи несткунӣ',
    cancelLabel: 'Бекор кардан',
    saveLabel: 'Захира кардан',
    createLabel: 'Сохтан',
    limitReached: 'Лимит пур шуд',
    overLimit: 'изофа',
    remaining: 'Боқимонда',
    lockedNotice: 'Қулф фаъол аст — барои тағйир дар танзимот кушоед',
    undoResetText: 'Ба сифр баргардонида шуд',
    undoBtn: 'Бозгашт',
    emptyCountersTitle: 'Ҳанӯз ягон ҳисобкунак нест',
    emptyCountersSub: 'Тугмаи + дар поёнро зер кунед ва аввалин ҳисобкунаки худро созед.',
    statsTotalCount: 'Маҷмӯи ҳисобҳо',
    statsActiveCounters: 'Ҳисобкунакҳои фаъол',
    statsReachedTargets: 'Ба лимит расиданд',
    statsTotalRounds: 'Даврҳои сабтшуда',
    statsBreakdown: 'Пешрафти ҳар як ҳисобкунак',
    goalsCompletedTitle: 'Мақсадҳои расида ва гузашта',
    goalsEmpty: 'Ҳоло ягон ҳисобкунак ба лимит нарасидааст.',
    archivedTitle: 'Бойгонӣ (Архив)',
    archivedEmpty: 'Ҳисобкунакҳои бойгонишуда нестанд.',
    restoreBtn: 'Барқарор',
    languageLabel: 'Забони барнома',
    themeLabel: 'Намуди экран',
    themeDark: 'Торик',
    themeLight: 'Равшан',
    soundLabel: 'Садои зеркунӣ ва расидан ба лимит',
    hapticLabel: 'Ларзиш (Вибрация)',
    hapticIntensityLabel: 'Шиддати ларзиш',
    intensityLow: 'Паст',
    intensityMedium: 'Миёна',
    intensityHigh: 'Баланд',
    notificationsLabel: 'Огоҳиномаи мақсади рӯзона',
    notificationsDesc: 'Фиристодани ёдраскунии браузерӣ ва дохилӣ агар мақсад пур нашавад',
    notificationsGranted: 'Иҷозати браузер фаъол аст',
    notificationsBlocked: 'Огоҳиномаи браузер хомӯш ё баста аст',
    clearHistory: 'Тоза кардан',
    stepLabel: 'Қадам',
    daysStreak: 'рӯз',
    trendUpLabel: 'Нисбат ба ҳафтаи гузашта зиёд шуд',
    trendDownLabel: 'Нисбат ба ҳафтаи гузашта кам шуд',
    powerSaverLabel: 'Сарфаи батарея (Power Saver)',
    powerSaverDesc: 'Аниматсияҳоро хомӯш ва навсозии пасзаминаро кам мекунад',
    quickActionsLabel: 'Амалҳои зуд',
    quickIncrementBtn: 'Зиёд кардан',
    quickResetBtn: 'Сифр кардан',
    widgetTitle: 'Видҷети экрани асосӣ',
    widgetMostActive: 'Серкорбурдтарин',
    widgetOpenFocus: 'Кушодан',
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
    dailyGoalProgress: 'Цель на сегодня',
    dailyGoalDone: 'Выполнено',
    unitLabel: 'Единица (опц.)',
    unitPlaceholder: 'шт / мин',
    colorSchemeLabel: 'Цветовая схема',
    lockedLabel: 'Заблокирован',
    lockedDesc: 'Заблокировать счётчик, чтобы случайно не изменить счёт',
    allowNegativeLabel: 'Разрешить отрицательные значения',
    allowNegativeDesc: 'Счётчик может опускаться ниже нуля',
    reminderLabel: 'Напоминание о дневной цели',
    reminderHint: 'Напомнит, если дневная цель не выполнена к этому времени',
    streakLabel: 'Цепочка привычек',
    streakDesc: 'Отслеживать ежедневную серию для этого счётчика',
    counterHistoryLabel: 'История счёта',
    noCounterHistory: 'Пока нет сброшенных раундов',
    resetCounterLabel: 'Сбросить счётчик',
    resetPreservesLimit: 'Сбрасывает значение до 0, сохраняя лимит',
    archiveCounterLabel: 'Архивировать счётчик',
    unarchiveCounterLabel: 'Вернуть из архива',
    deleteCounterLabel: 'Удалить счётчик',
    confirmDeleteLabel: 'Подтвердить удаление',
    cancelLabel: 'Отмена',
    saveLabel: 'Сохранить',
    createLabel: 'Создать',
    limitReached: 'Лимит достигнут',
    overLimit: 'сверх лимита',
    remaining: 'Осталось',
    lockedNotice: 'Счётчик заблокирован — откройте в настройках',
    undoResetText: 'Сброшено до 0',
    undoBtn: 'Отменить',
    emptyCountersTitle: 'Пока нет счётчиков',
    emptyCountersSub: 'Нажмите кнопку + внизу, чтобы создать первый счётчик.',
    statsTotalCount: 'Общий счёт',
    statsActiveCounters: 'Активных счётчиков',
    statsReachedTargets: 'Достигли лимита',
    statsTotalRounds: 'Завершённых раундов',
    statsBreakdown: 'Прогресс по счётчикам',
    goalsCompletedTitle: 'Достигнутые цели',
    goalsEmpty: 'Пока ни один счётчик не достиг лимита.',
    archivedTitle: 'Архив',
    archivedEmpty: 'В архиве пока пусто.',
    restoreBtn: 'Восстановить',
    languageLabel: 'Язык интерфейса',
    themeLabel: 'Тема оформления',
    themeDark: 'Тёмная',
    themeLight: 'Светлая',
    soundLabel: 'Звук нажатия и достижения цели',
    hapticLabel: 'Вибрация при нажатии',
    hapticIntensityLabel: 'Сила вибрации',
    intensityLow: 'Низкая',
    intensityMedium: 'Средняя',
    intensityHigh: 'Высокая',
    notificationsLabel: 'Уведомления о дневной цели',
    notificationsDesc: 'Напоминание в браузере и приложении, если цель не достигнута',
    notificationsGranted: 'Уведомления браузера разрешены',
    notificationsBlocked: 'Только встроенные напоминания',
    clearHistory: 'Очистить',
    stepLabel: 'Шаг',
    daysStreak: 'дн.',
    trendUpLabel: 'Чаще, чем на прошлой неделе',
    trendDownLabel: 'Реже, чем на прошлой неделе',
    powerSaverLabel: 'Энергосбережение',
    powerSaverDesc: 'Отключает анимации и снижает частоту фоновых сохранений',
    quickActionsLabel: 'Быстрые действия',
    quickIncrementBtn: 'Прибавить',
    quickResetBtn: 'Сбросить на 0',
    widgetTitle: 'Виджет главного экрана',
    widgetMostActive: 'Самый частый',
    widgetOpenFocus: 'Открыть',
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
    dailyGoalProgress: 'Daily Goal',
    dailyGoalDone: 'Done',
    unitLabel: 'Unit (optional)',
    unitPlaceholder: 'pcs / min',
    colorSchemeLabel: 'Color Theme',
    lockedLabel: 'Locked',
    lockedDesc: 'Lock counter to prevent accidental taps',
    allowNegativeLabel: 'Allow negative values',
    allowNegativeDesc: 'Counter can go below zero',
    reminderLabel: 'Daily Goal Reminder',
    reminderHint: 'Alerts if your daily goal is not met by this time',
    streakLabel: 'Habit Streak',
    streakDesc: 'Track consecutive active days for this counter',
    counterHistoryLabel: 'Count History',
    noCounterHistory: 'No reset rounds recorded yet',
    resetCounterLabel: 'Reset Counter to 0',
    resetPreservesLimit: 'Resets count to 0 without clearing the limit',
    archiveCounterLabel: 'Archive Counter',
    unarchiveCounterLabel: 'Unarchive Counter',
    deleteCounterLabel: 'Delete Counter',
    confirmDeleteLabel: 'Confirm Delete',
    cancelLabel: 'Cancel',
    saveLabel: 'Save',
    createLabel: 'Create',
    limitReached: 'Limit reached',
    overLimit: 'over',
    remaining: 'Remaining',
    lockedNotice: 'Counter is locked — unlock in settings',
    undoResetText: 'Reset to zero',
    undoBtn: 'Undo',
    emptyCountersTitle: 'No counters yet',
    emptyCountersSub: 'Tap the + button below to create your first counter.',
    statsTotalCount: 'Total Count',
    statsActiveCounters: 'Active Counters',
    statsReachedTargets: 'Limits Reached',
    statsTotalRounds: 'Saved Rounds',
    statsBreakdown: 'Counter Breakdown',
    goalsCompletedTitle: 'Reached & Exceeded Targets',
    goalsEmpty: 'No counters have reached their target limit yet.',
    archivedTitle: 'Archived Counters',
    archivedEmpty: 'No archived counters.',
    restoreBtn: 'Restore',
    languageLabel: 'Language',
    themeLabel: 'Appearance',
    themeDark: 'Dark',
    themeLight: 'Light',
    soundLabel: 'Tap & milestone sounds',
    hapticLabel: 'Haptic vibration',
    hapticIntensityLabel: 'Haptic intensity',
    intensityLow: 'Low',
    intensityMedium: 'Medium',
    intensityHigh: 'High',
    notificationsLabel: 'Daily goal reminders',
    notificationsDesc: 'Browser & in-app push reminder when daily goal is unmet',
    notificationsGranted: 'Browser notifications enabled',
    notificationsBlocked: 'In-app reminders active',
    clearHistory: 'Clear',
    stepLabel: 'Step',
    daysStreak: 'd',
    trendUpLabel: 'Increased vs. previous week',
    trendDownLabel: 'Decreased vs. previous week',
    powerSaverLabel: 'Power Saver mode',
    powerSaverDesc: 'Disables animations and throttles background saves',
    quickActionsLabel: 'Quick actions',
    quickIncrementBtn: 'Increment',
    quickResetBtn: 'Reset to 0',
    widgetTitle: 'Home Screen Widget',
    widgetMostActive: 'Most Frequent',
    widgetOpenFocus: 'Open',
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
  },
};
