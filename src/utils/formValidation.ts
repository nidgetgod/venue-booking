/**
 * 驗證預約表單
 * @param formData 表單資料
 * @param selectedDate 選擇的日期
 * @param selectedTime 選擇的時段
 * @returns 缺少的欄位 key 陣列
 */
export const validateBookingForm = (
  formData: {
    name: string;
    phone: string;
    peopleCount: string;
  },
  selectedDate: string,
  selectedTime: string
): string[] => {
  const missingFields: string[] = [];
  
  if (!formData.name) missingFields.push('name');
  if (!formData.phone) missingFields.push('phone');
  if (!formData.peopleCount) missingFields.push('peopleCount');
  if (!selectedDate) missingFields.push('date');
  if (!selectedTime) missingFields.push('time');
  
  return missingFields;
};
