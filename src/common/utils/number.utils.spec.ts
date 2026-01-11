import { NumberUtils } from '../../common/utils/number.utils';

describe('NumberUtils', () => {
  describe('roundToPrecision', () => {
    it('should round to specified decimal places', () => {
      expect(NumberUtils.roundToPrecision(10.12345, 2)).toBe(10.12);
      expect(NumberUtils.roundToPrecision(10.12345, 4)).toBe(10.1235);
      expect(NumberUtils.roundToPrecision(10.999, 2)).toBe(11);
      expect(NumberUtils.roundToPrecision(10.5, 0)).toBe(11);
    });

    it('should handle negative numbers', () => {
      expect(NumberUtils.roundToPrecision(-10.12345, 2)).toBe(-10.12);
      expect(NumberUtils.roundToPrecision(-10.999, 2)).toBe(-11);
    });

    it('should handle zero precision', () => {
      expect(NumberUtils.roundToPrecision(10.7, 0)).toBe(11);
      expect(NumberUtils.roundToPrecision(10.3, 0)).toBe(10);
    });
  });

  describe('calculateShareQuantity', () => {
    it('should calculate correct share quantity with precision', () => {
      const amount = 5000;
      const price = 150.25;
      const precision = 4;

      const result = NumberUtils.calculateShareQuantity(amount, price, precision);
      expect(result).toBe(33.2779);
    });

    it('should handle different precision levels', () => {
      const amount = 1000;
      const price = 33.33;

      expect(NumberUtils.calculateShareQuantity(amount, price, 0)).toBe(30);
      expect(NumberUtils.calculateShareQuantity(amount, price, 2)).toBe(30.00);
      expect(NumberUtils.calculateShareQuantity(amount, price, 4)).toBe(30.003);
    });

    it('should throw error for zero or negative price', () => {
      expect(() => NumberUtils.calculateShareQuantity(1000, 0, 2)).toThrow(
        'Price must be greater than zero',
      );
      expect(() => NumberUtils.calculateShareQuantity(1000, -10, 2)).toThrow(
        'Price must be greater than zero',
      );
    });

    it('should handle small amounts', () => {
      const amount = 10;
      const price = 100;
      const precision = 4;

      const result = NumberUtils.calculateShareQuantity(amount, price, precision);
      expect(result).toBe(0.1);
    });
  });
});
