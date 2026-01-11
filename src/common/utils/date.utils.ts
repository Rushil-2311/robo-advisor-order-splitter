/**
 * Utility class for date-related operations
 */
export class DateUtils {
  /**
   * Calculates the next trading day (weekday) from a given date
   * Market is open Monday to Friday
   * @param date - The starting date
   * @returns The next weekday if the date falls on a weekend, otherwise the same date
   */
  static getNextTradingDay(date: Date): Date {
    const result = new Date(date);
    const dayOfWeek = result.getDay();

    // If Saturday (6), add 2 days to get to Monday
    if (dayOfWeek === 6) {
      result.setDate(result.getDate() + 2);
    }
    // If Sunday (0), add 1 day to get to Monday
    else if (dayOfWeek === 0) {
      result.setDate(result.getDate() + 1);
    }

    return result;
  }

  /**
   * Checks if a given date is a trading day (weekday)
   * @param date - The date to check
   * @returns True if the date is a weekday, false otherwise
   */
  static isTradingDay(date: Date): boolean {
    const dayOfWeek = date.getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
  }
}
