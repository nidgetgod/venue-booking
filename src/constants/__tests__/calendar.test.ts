import { WEEK_DAYS, LEGEND_ITEMS } from '../calendar';

describe('Calendar Constants', () => {
  describe('WEEK_DAYS', () => {
    it('應該包含正確的星期名稱', () => {
      expect(WEEK_DAYS).toHaveLength(7);
      expect(WEEK_DAYS).toEqual(['日', '一', '二', '三', '四', '五', '六']);
    });

    it('應該從星期日開始', () => {
      expect(WEEK_DAYS[0]).toBe('日');
    });

    it('應該以星期六結束', () => {
      expect(WEEK_DAYS[6]).toBe('六');
    });
  });

  describe('LEGEND_ITEMS', () => {
    it('應該包含所有圖例項目', () => {
      expect(LEGEND_ITEMS).toHaveLength(4);
    });

    it('應該包含有空堂時段的圖例', () => {
      const item = LEGEND_ITEMS.find(item => item.label === '有空堂時段');
      expect(item).toBeDefined();
      expect(item?.color).toContain('bg-green-200');
    });

    it('應該包含無空堂時段的圖例', () => {
      const item = LEGEND_ITEMS.find(item => item.label === '無空堂時段');
      expect(item).toBeDefined();
      expect(item?.color).toContain('bg-gray-100');
    });

    it('應該包含已選擇日期的圖例', () => {
      const item = LEGEND_ITEMS.find(item => item.label === '已選擇日期');
      expect(item).toBeDefined();
      expect(item?.color).toContain('bg-blue-600');
    });

    it('應該包含今天的圖例', () => {
      const item = LEGEND_ITEMS.find(item => item.label === '今天');
      expect(item).toBeDefined();
      expect(item?.color).toContain('border-orange-400');
    });

    it('每個圖例項目應該有 color 和 label 屬性', () => {
      LEGEND_ITEMS.forEach(item => {
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
