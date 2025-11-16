/**
 * 根據日期生成可用時段
 * @param dateStr 日期字串 (YYYY-MM-DD)
 * @returns 時段陣列
 */
export const generateTimeSlots = (dateStr: string): string[] => {
  if (!dateStr) return [];
  
  const date = new Date(dateStr);
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  const slots: string[] = [];
  const startHour = 6;
  const endHour = isWeekend ? 18 : 21;
  
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(
      `${hour.toString().padStart(2, '0')}:00-${(hour + 1)
        .toString()
        .padStart(2, '0')}:00`
    );
  }
  
  return slots;
};

/**
 * 生成連續週期的預約日期
 * @param startDate 起始日期
 * @param weeks 週數
 * @returns 日期字串陣列
 */
export const generateRecurringDates = (
  startDate: string,
  weeks: number
): string[] => {
  const dates: string[] = [];
  const start = new Date(startDate);
  
  for (let week = 0; week < weeks; week++) {
    const bookingDate = new Date(start);
    bookingDate.setDate(start.getDate() + week * 7);
    const dateStr = `${bookingDate.getFullYear()}-${(bookingDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${bookingDate.getDate().toString().padStart(2, '0')}`;
    dates.push(dateStr);
  }
  
  return dates;
};

/**
 * 取得今天的日期字串
 * @returns YYYY-MM-DD 格式的日期字串
 */
export const getTodayString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};
