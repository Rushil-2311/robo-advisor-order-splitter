/**
 * Utility class for numeric calculations
 */
export class NumberUtils {
  /**
   * Rounds a number to a specified number of decimal places
   * @param value - The number to round
   * @param precision - The number of decimal places
   * @returns The rounded number
   */
  static roundToPrecision(value: number, precision: number): number {
    const multiplier = Math.pow(10, precision);
    return Math.round(value * multiplier) / multiplier;
  }

  /**
   * Calculates the quantity of shares that can be purchased with a given amount
   * @param amount - The amount of money to invest
   * @param price - The price per share
   * @param precision - The decimal precision for the quantity
   * @returns The quantity of shares
   */
  static calculateShareQuantity(amount: number, price: number, precision: number): number {
    if (price <= 0) {
      throw new Error('Price must be greater than zero');
    }
    const rawQuantity = amount / price;
    return this.roundToPrecision(rawQuantity, precision);
  }
}
