import { generateTimeSlots, generateRecurringDates, getTodayString } from '../timeSlotUtils';

describe('timeSlotUtils', () => {
  describe('generateTimeSlots', () => {
    it('returns empty array when no date is provided', () => {
      expect(generateTimeSlots('')).toEqual([]);
    });

    it('generates weekday time slots (6:00-21:00)', () => {
      const slots = generateTimeSlots('2025-11-20'); // Thursday
      expect(slots).toHaveLength(15); // 6-21 = 15 hours
      expect(slots[0]).toBe('06:00-07:00');
      expect(slots[slots.length - 1]).toBe('20:00-21:00');
    });

    it('generates weekend time slots (6:00-18:00)', () => {
      const slots = generateTimeSlots('2025-11-16'); // Sunday
      expect(slots).toHaveLength(12); // 6-18 = 12 hours
      expect(slots[0]).toBe('06:00-07:00');
      expect(slots[slots.length - 1]).toBe('17:00-18:00');
    });

    it('generates correct format for all slots', () => {
      const slots = generateTimeSlots('2025-11-20');
      slots.forEach(slot => {
        expect(slot).toMatch(/^\d{2}:\d{2}-\d{2}:\d{2}$/);
      });
    });
  });

  describe('generateRecurringDates', () => {
    it('generates single date for 1 week', () => {
      const dates = generateRecurringDates('2025-11-20', 1);
      expect(dates).toHaveLength(1);
      expect(dates[0]).toBe('2025-11-20');
    });

    it('generates correct dates for multiple weeks', () => {
      const dates = generateRecurringDates('2025-11-20', 3);
      expect(dates).toHaveLength(3);
      expect(dates[0]).toBe('2025-11-20');
      expect(dates[1]).toBe('2025-11-27');
      expect(dates[2]).toBe('2025-12-04');
    });

    it('generates dates in YYYY-MM-DD format', () => {
      const dates = generateRecurringDates('2025-11-20', 2);
      dates.forEach(date => {
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });
  });

  describe('getTodayString', () => {
    it('returns date in YYYY-MM-DD format', () => {
      const today = getTodayString();
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('returns current date', () => {
      const today = getTodayString();
      const now = new Date();
      const expected = `${now.getFullYear()}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
      expect(today).toBe(expected);
    });
  });
});
