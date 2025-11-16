/**
 * 驗證預約表單
 * @param formData 表單資料
 * @param selectedDate 選擇的日期
 * @param selectedTime 選擇的時段
 * @returns 缺少的欄位陣列
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
  
  if (!formData.name) missingFields.push('姓名');
  if (!formData.phone) missingFields.push('電話');
  if (!formData.peopleCount) missingFields.push('人數');
  if (!selectedDate) missingFields.push('日期');
  if (!selectedTime) missingFields.push('時段');
  
  return missingFields;
};
