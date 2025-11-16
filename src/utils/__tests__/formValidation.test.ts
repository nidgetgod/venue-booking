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
      expect(result).toContain('姓名');
    });

    it('returns missing phone field', () => {
      const form = { ...validForm, phone: '' };
      const result = validateBookingForm(form, '2025-11-20', '10:00');
      expect(result).toContain('電話');
    });

    it('returns missing peopleCount field', () => {
      const form = { ...validForm, peopleCount: '' };
      const result = validateBookingForm(form, '2025-11-20', '10:00');
      expect(result).toContain('人數');
    });

    it('returns missing date field', () => {
      const result = validateBookingForm(validForm, '', '10:00');
      expect(result).toContain('日期');
    });

    it('returns missing time field', () => {
      const result = validateBookingForm(validForm, '2025-11-20', '');
      expect(result).toContain('時段');
    });

    it('returns all missing fields', () => {
      const emptyForm = { name: '', phone: '', peopleCount: '' };
      const result = validateBookingForm(emptyForm, '', '');
      expect(result).toHaveLength(5);
      expect(result).toContain('姓名');
      expect(result).toContain('電話');
      expect(result).toContain('人數');
      expect(result).toContain('日期');
      expect(result).toContain('時段');
    });
  });
});
