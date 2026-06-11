import { formatCurrency } from "./utils";

/** Convert native-currency amount to USD. `rate` is native_per_USD. */
export const nativeToUSD = (amount: number, rate: number): number =>
  amount / rate;

/** Convert USD amount to native currency. `rate` is native_per_USD. */
export const usdToNative = (amount: number, rate: number): number =>
  amount * rate;

/**
 * Format a native-currency value as a USD display string.
 * Divides by rate when ccy !== "USD" and rate is valid; falls back to native formatting.
 */
export const fmtAmount = (
  nativeAmount: number,
  ccy: string,
  rate: number | null | undefined,
): string => {
  if (ccy === "USD" || rate == null || rate <= 0)
    return formatCurrency(nativeAmount);
  return formatCurrency(nativeAmount / rate);
};

/**
 * For limit orders: user enters price in USD for non-USD/non-HKD stocks,
 * in native currency for USD and HKD. Returns the native (local) price.
 */
export const limitPriceToNative = (
  inputPrice: number,
  ccy: string,
  rate: number | null | undefined,
): number => {
  if (ccy === "USD" || ccy === "HKD" || rate == null || rate <= 0)
    return inputPrice;
  return inputPrice * rate;
};

/** Stock display price in USD. Returns null when price is absent. */
export const stockPriceToUSD = (
  price: number | null,
  rate: number | null,
): number | null => {
  if (price == null) return null;
  if (rate == null || rate <= 0) return price;
  return price / rate;
};

/** Trade value in USD: qty × nativePrice ÷ rate. */
export const calcTradeValueUSD = (
  qty: number,
  nativePrice: number,
  rate: number | null | undefined,
): number => (qty * nativePrice) / (rate ?? 1);
