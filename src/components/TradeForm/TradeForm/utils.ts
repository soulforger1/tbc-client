import type { FeeResponse, Stock } from "@/lib/api";
import type { FormState } from "../constants";

export function computeEffectivePrice(
  orderType: "market" | "limit",
  marketPrice: number,
  limitPriceNum: number,
  ccy: string,
  rate: number | undefined,
): number {
  if (orderType !== "limit" || limitPriceNum <= 0) return marketPrice;
  const isNonUsdNonHkd = ccy !== "USD" && ccy !== "HKD";
  if (!isNonUsdNonHkd) return limitPriceNum;
  // limit price is entered in USD for non-USD/non-HKD — convert to local currency.
  // if rate not yet known, fall back to market price so the first fee fetch bootstraps the rate.
  return rate ? limitPriceNum * rate : marketPrice;
}

export type TradeFormOrderType = "market" | "limit";

export const TradeFormDefaultValues = {
  side: "buy",
  symbol: "",
  stock: null,
  orderType: "market",
  quantity: "",
  limitPrice: "",
  goodTill: "gtc",
  formState: "idle",
  errorMessage: null,
  feeResult: null,
  fetchingFee: false,
  buyingPower: null,
  holdingQty: null,
} as TradeFormType;

export type TradeFormType = {
  side: "buy" | "sell";
  symbol: string;
  stock: Stock | null;
  orderType: "market" | "limit";
  quantity: string;
  limitPrice: string;
  goodTill: "day" | "gtc";
  formState: FormState;
  errorMessage: string | null;
  feeResult: FeeResponse | null;
  fetchingFee: boolean;
  buyingPower: number | null;
  holdingQty: number | null;
};
