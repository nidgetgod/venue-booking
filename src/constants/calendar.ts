export const WEEK_DAYS_ZH = ['日', '一', '二', '三', '四', '五', '六'];
export const WEEK_DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const getLegendItems = (t: (key: string) => string) => [
  { color: 'bg-green-200 border border-green-300', label: t('legendAvailable') },
  { color: 'bg-gray-100', label: t('legendNoSlots') },
  { color: 'bg-blue-600', label: t('legendSelected') },
  { color: 'border-2 border-orange-400', label: t('legendToday') },
];
