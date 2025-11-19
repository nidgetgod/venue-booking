import { WEEK_DAYS_ZH, WEEK_DAYS_EN, getLegendItems } from '../calendar';

describe('Calendar Constants', () => {
  describe('WEEK_DAYS_ZH', () => {
    it('應該包含正確的星期名稱', () => {
      expect(WEEK_DAYS_ZH).toHaveLength(7);
      expect(WEEK_DAYS_ZH).toEqual(['日', '一', '二', '三', '四', '五', '六']);
    });

    it('應該從星期日開始', () => {
      expect(WEEK_DAYS_ZH[0]).toBe('日');
    });

    it('應該以星期六結束', () => {
      expect(WEEK_DAYS_ZH[6]).toBe('六');
    });
  });

  describe('WEEK_DAYS_EN', () => {
    it('應該包含正確的星期名稱', () => {
      expect(WEEK_DAYS_EN).toHaveLength(7);
      expect(WEEK_DAYS_EN).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
    });
  });

  describe('getLegendItems', () => {
    const mockT = (key: string) => key;
    const legendItems = getLegendItems(mockT);

    it('應該包含所有圖例項目', () => {
      expect(legendItems).toHaveLength(4);
    });

    it('應該包含有空堂時段的圖例', () => {
      const item = legendItems.find(item => item.label === 'legendAvailable');
      expect(item).toBeDefined();
      expect(item?.color).toContain('bg-green-200');
    });

    it('應該包含無空堂時段的圖例', () => {
      const item = legendItems.find(item => item.label === 'legendNoSlots');
      expect(item).toBeDefined();
      expect(item?.color).toContain('bg-gray-100');
    });

    it('應該包含已選擇日期的圖例', () => {
      const item = legendItems.find(item => item.label === 'legendSelected');
      expect(item).toBeDefined();
      expect(item?.color).toContain('bg-blue-600');
    });

    it('應該包含今天的圖例', () => {
      const item = legendItems.find(item => item.label === 'legendToday');
      expect(item).toBeDefined();
      expect(item?.color).toContain('border-orange-400');
    });

    it('每個圖例項目應該有 color 和 label 屬性', () => {
      legendItems.forEach(item => {
        expect(item).toHaveProperty('color');
        expect(item).toHaveProperty('label');
        expect(typeof item.color).toBe('string');
        expect(typeof item.label).toBe('string');
        expect(item.color.length).toBeGreaterThan(0);
        expect(item.label.length).toBeGreaterThan(0);
      });
    });
  });
});
