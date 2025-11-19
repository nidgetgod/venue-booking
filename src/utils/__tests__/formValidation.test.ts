import { validateBookingForm } from '../formValidation';

describe('formValidation', () => {
  describe('validateBookingForm', () => {
    const validForm = {
      name: '張三',
      phone: '0912345678',
      peopleCount: '4',
    };

    it('returns empty array when all fields are valid', () => {
      const result = validateBookingForm(validForm, '2025-11-20', '10:00');
      expect(result).toEqual([]);
    });

    it('returns missing name field', () => {
      const form = { ...validForm, name: '' };
      const result = validateBookingForm(form, '2025-11-20', '10:00');
      expect(result).toContain('name');
    });

    it('returns missing phone field', () => {
      const form = { ...validForm, phone: '' };
      const result = validateBookingForm(form, '2025-11-20', '10:00');
      expect(result).toContain('phone');
    });

    it('returns missing peopleCount field', () => {
      const form = { ...validForm, peopleCount: '' };
      const result = validateBookingForm(form, '2025-11-20', '10:00');
      expect(result).toContain('peopleCount');
    });

    it('returns missing date field', () => {
      const result = validateBookingForm(validForm, '', '10:00');
      expect(result).toContain('date');
    });

    it('returns missing time field', () => {
      const result = validateBookingForm(validForm, '2025-11-20', '');
      expect(result).toContain('time');
    });

    it('returns all missing fields', () => {
      const emptyForm = { name: '', phone: '', peopleCount: '' };
      const result = validateBookingForm(emptyForm, '', '');
      expect(result).toHaveLength(5);
      expect(result).toContain('name');
      expect(result).toContain('phone');
      expect(result).toContain('peopleCount');
      expect(result).toContain('date');
      expect(result).toContain('time');
    });
  });
});
