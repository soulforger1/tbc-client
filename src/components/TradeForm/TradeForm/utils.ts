import type { FeeResponse, Stock } from "@/lib/api";
import type { FormState } from "../constants";

export type TradeFormOrderType = "market" | "limit";

export const TradeFormDefaultValues = {
  side: "buy",
  symbol: "",
  stock: null,
  orderType: "market",
  quantity: "",
  limitPrice: "",
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
  stock: Stock;
  orderType: "market" | "limit";
  quantity: string;
  limitPrice: string;
  formState: FormState;
  errorMessage: string | null;
  feeResult: FeeResponse | null;
  fetchingFee: boolean;
  buyingPower: number | null;
  holdingQty: number | null;
};
