export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  shareDecimalPrecision: parseInt(process.env.SHARE_DECIMAL_PRECISION || '4', 10),
  defaultStockPrice: parseFloat(process.env.DEFAULT_STOCK_PRICE || '100'),
  marketSchedule: {
    openDays: [1, 2, 3, 4, 5],
  },
});
