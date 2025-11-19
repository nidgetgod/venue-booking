export default {
  nav: {
    title: 'Venue Booking System',
    booking: 'Book Venue',
    records: 'Booking Records',
  },
  form: {
    userInfo: 'User Information',
    name: 'Name',
    namePlaceholder: 'Enter your name',
    phone: 'Phone',
    phonePlaceholder: '09xx-xxx-xxx',
    peopleCount: 'Number of People',
    peopleCountPlaceholder: 'Enter number of people',
    useLastInfo: 'Use Last Booking Info',
  },
  calendar: {
    selectDateTime: 'Select Date & Time',
    availableSlots: 'Available Time Slots',
    today: 'Today',
    weekday: 'Weekday 6:00-21:00',
    weekend: 'Weekend 6:00-18:00',
    booked: 'Booked',
    legend: 'Legend',
    legendToday: 'Today',
    legendSelected: 'Selected',
    legendAvailable: 'Available',
    legendNoSlots: 'No Slots',
    autoSelectToday: '💡 Today is auto-selected, you can choose a time slot to book',
    prev: 'Previous',
    next: 'Next',
    sunday: 'Sun',
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
  },
  time: {
    selectedSlot: 'Selected Time Slot',
    selected: 'Selected',
  },
  booking: {
    singleBook: 'Single Booking',
    recurringBook: 'Recurring Booking',
  },
  recurring: {
    title: 'Recurring Booking Setup',
    slot: 'Time Slot:',
    everyWeek: 'Every',
    startFrom: 'Starting from',
    weeksLabel: 'Number of Weeks',
    week: 'week(s)',
    totalBookings: 'Total',
    times: 'bookings',
    months: 'month(s)',
    preview: 'Booking Preview',
    conflict: '✗ Conflict',
    available: '✓ Available',
    cancel: 'Cancel',
    confirm: 'Confirm Booking',
  },
  dialog: {
    success: 'Booking Successful',
    cancelSuccess: 'Cancellation Successful',
    error: 'Incomplete Information',
    confirm: 'OK',
    cancelTitle: 'Confirm Cancellation',
    cancelMessage: 'Are you sure you want to cancel this booking? This action cannot be undone.',
    keepBooking: 'Keep Booking',
    confirmCancel: 'Confirm Cancel',
  },
  messages: {
    bookingSuccess: 'Booking completed successfully, check your booking records',
    bookingFailed: 'Booking failed',
    bookingError: 'Booking failed, please try again later',
    batchBookingSuccess: 'Successfully booked {count} time slot(s)',
    batchBookingSuccessWithConflicts: 'Successfully booked {successCount} time slot(s). Conflicts: {datesTimes}',
    multiSlotSuccess: 'Successfully booked {count} time slot(s)',
    multiSlotSuccessWithFailures: 'Successfully booked {successCount} time slot(s). Failed: {failedTimes}',
    cancelSuccess: 'Booking cancelled successfully',
    cancelFailed: 'Failed to cancel booking',
    cancelError: 'Failed to cancel booking, please try again later',
    fetchError: 'Failed to load booking data',
    fetchErrorRetry: 'Failed to load booking data, please try again later',
    missingFields: 'Please fill in the following fields',
  },
  fields: {
    name: 'Name',
    phone: 'Phone',
    peopleCount: 'Number of People',
    date: 'Date',
    time: 'Time Slot',
  },
  records: {
    title: 'Booking Records',
    empty: 'No booking records',
    people: 'people',
  },
  announcement: {
    title: 'Venue Announcement',
    content: `【Venue Rules】
• Indoor badminton shoes are required
• Please clean floor stains before leaving
• Only water and sports drinks allowed, no food
• Please take your trash with you, do not dispose in restrooms
• Please supervise young children for safety

【Pricing】
🌅 Public Hours (6:00-8:00)
   Weekday: NT$ 50 / court / hour
   Weekend: NT$ 100 / court / hour

🌞 Weekday Daytime (8:00-18:00)
   Fee: NT$ 100 / court / hour

🌙 Prime Time (Weekday 18:00-21:00 & All Weekend)
   Fee: NT$ 200 / court / hour

💡 All prices are per court, payment on site`,
  },
  day: {
    sun: 'Sun',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
  },
  lang: {
    switchTo: 'Switch Language',
  },
} as const;
