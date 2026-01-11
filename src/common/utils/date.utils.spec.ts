import { DateUtils } from '../../common/utils/date.utils';

describe('DateUtils', () => {
  describe('getNextTradingDay', () => {
    it('should return the same date for weekdays (Monday-Friday)', () => {
      // Monday, January 6, 2026
      const monday = new Date('2026-01-05T10:00:00');
      expect(DateUtils.getNextTradingDay(monday)).toEqual(monday);

      // Wednesday, January 7, 2026
      const wednesday = new Date('2026-01-07T10:00:00');
      expect(DateUtils.getNextTradingDay(wednesday)).toEqual(wednesday);

      // Friday, January 9, 2026
      const friday = new Date('2026-01-09T10:00:00');
      expect(DateUtils.getNextTradingDay(friday)).toEqual(friday);
    });

    it('should return Monday for Saturday', () => {
      // Saturday, January 10, 2026
      const saturday = new Date('2026-01-10T10:00:00');
      const result = DateUtils.getNextTradingDay(saturday);

      // Should be Monday, January 12, 2026
      expect(result.getDay()).toBe(1); // Monday
      expect(result.getDate()).toBe(12);
    });

    it('should return Monday for Sunday', () => {
      // Sunday, January 11, 2026
      const sunday = new Date('2026-01-11T10:00:00');
      const result = DateUtils.getNextTradingDay(sunday);

      // Should be Monday, January 12, 2026
      expect(result.getDay()).toBe(1); // Monday
      expect(result.getDate()).toBe(12);
    });
  });

  describe('isTradingDay', () => {
    it('should return true for weekdays', () => {
      const monday = new Date('2026-01-05T10:00:00');
      const tuesday = new Date('2026-01-06T10:00:00');
      const wednesday = new Date('2026-01-07T10:00:00');
      const thursday = new Date('2026-01-08T10:00:00');
      const friday = new Date('2026-01-09T10:00:00');

      expect(DateUtils.isTradingDay(monday)).toBe(true);
      expect(DateUtils.isTradingDay(tuesday)).toBe(true);
      expect(DateUtils.isTradingDay(wednesday)).toBe(true);
      expect(DateUtils.isTradingDay(thursday)).toBe(true);
      expect(DateUtils.isTradingDay(friday)).toBe(true);
    });

    it('should return false for weekends', () => {
      const saturday = new Date('2026-01-10T10:00:00');
      const sunday = new Date('2026-01-11T10:00:00');

      expect(DateUtils.isTradingDay(saturday)).toBe(false);
      expect(DateUtils.isTradingDay(sunday)).toBe(false);
    });
  });
});
