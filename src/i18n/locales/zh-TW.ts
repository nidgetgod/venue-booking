export default {
  nav: {
    title: '場地預約系統',
    booking: '預約場地',
    records: '預約記錄',
  },
  form: {
    userInfo: '預約人資訊',
    name: '姓名',
    namePlaceholder: '請輸入姓名',
    phone: '電話',
    phonePlaceholder: '09xx-xxx-xxx',
    peopleCount: '人數',
    peopleCountPlaceholder: '請輸入使用人數',
    useLastInfo: '使用上次預約資訊',
  },
  calendar: {
    selectDateTime: '選擇日期時段',
    availableSlots: '可用時段',
    today: '今天',
    weekday: '平日 6:00-21:00',
    weekend: '假日 6:00-18:00',
    booked: '已預約',
    legend: '圖例說明',
    legendToday: '今天',
    legendSelected: '已選擇',
    legendAvailable: '有空位',
    legendNoSlots: '無空位',
    autoSelectToday: '💡 已自動選擇今天，您可以直接選擇時段進行預約',
    prev: '上個月',
    next: '下個月',
    sunday: '日',
    monday: '一',
    tuesday: '二',
    wednesday: '三',
    thursday: '四',
    friday: '五',
    saturday: '六',
  },
  time: {
    selectedSlot: '已選擇時段',
    selected: '已選擇',
  },
  booking: {
    singleBook: '單次預約',
    recurringBook: '連續預約',
  },
  recurring: {
    title: '連續預約設定',
    slot: '預約時段：',
    everyWeek: '每週',
    startFrom: '開始',
    weeksLabel: '連續週數',
    week: '週',
    totalBookings: '總共',
    times: '次預約',
    months: '個月',
    preview: '預約日期預覽',
    conflict: '✗ 衝突',
    available: '✓ 可預約',
    cancel: '取消',
    confirm: '確認預約',
  },
  dialog: {
    success: '預約成功',
    cancelSuccess: '取消成功',
    error: '資料不完整',
    confirm: '確定',
    cancelTitle: '確認取消預約',
    cancelMessage: '您確定要取消這個預約嗎？此操作無法復原。',
    keepBooking: '保留預約',
    confirmCancel: '確認取消',
  },
  messages: {
    bookingSuccess: '已完成預約，可在預約紀錄裡查詢',
    bookingFailed: '預約失敗',
    bookingError: '預約失敗，請稍後再試',
    batchBookingSuccess: '成功預約 {count} 個時段',
    batchBookingSuccessWithConflicts: '成功預約 {successCount} 個時段，以下時段衝突：{datesTimes}',
    multiSlotSuccess: '成功預約 {count} 個時段',
    multiSlotSuccessWithFailures: '成功預約 {successCount} 個時段，以下時段失敗：{failedTimes}',
    cancelSuccess: '預約已成功取消',
    cancelFailed: '取消預約失敗',
    cancelError: '取消預約失敗，請稍後再試',
    fetchError: '讀取預約資料失敗',
    fetchErrorRetry: '讀取預約資料失敗，請稍後再試',
    missingFields: '請填寫以下欄位',
  },
  fields: {
    name: '姓名',
    phone: '電話',
    peopleCount: '人數',
    date: '日期',
    time: '時段',
  },
  records: {
    title: '預約記錄',
    empty: '暫無預約記錄',
    people: '人',
  },
  announcement: {
    title: '場地公告',
    content: `【場地使用規則】
• 務必穿著室內羽球鞋
• 地板污漬請順手清理再離場
• 除水和運動飲料，禁止攜帶食物飲料進入場館
• 垃圾請帶離場館，請勿將垃圾投放在廁所
• 提醒年幼孩童注意安全

【場地費用】
🌅 公益時段 (6:00-8:00)
   平日：NT$ 50 / 場地 / 小時
   假日：NT$ 100 / 場地 / 小時

🌞 平日日間 (8:00-18:00)
   費用：NT$ 100 / 場地 / 小時

🌙 黃金時段 (平日18:00-21:00 及 假日全天)
   費用：NT$ 200 / 場地 / 小時

💡 所有費用以單個場地計算，請於現場付款`,
  },
  day: {
    sun: '日',
    mon: '一',
    tue: '二',
    wed: '三',
    thu: '四',
    fri: '五',
    sat: '六',
  },
  lang: {
    switchTo: '切換語言',
  },
} as const;
