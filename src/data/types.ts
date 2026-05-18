export type TradeStatus = "open" | "filled" | "cancelled" | "partial" | "nominal" | "final";
export type TradeSide = "buy" | "sell";
export type OrderType = "market" | "limit";
export type GoodTill = "day" | "gtc";

export interface Trade {
  id: string;
  symbol: string;
  currency: string;
  side: TradeSide;
  orderType: OrderType;
  goodTill: GoodTill;
  quantity: number;
  price: number | null;
  filledQty: number;
  filledPrice: number | null;
  tradeValue: number | null;
  tradeValueUSD: number | null;
  commission: number | null;
  rate: number | null;
  total: number;
  status: TradeStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioPoint {
  date: string;
  value: number;
  pnl: number;
}

export interface Holding {
  symbol: string;
  name: string;
  qty: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  pnl: number;
  pnlPct: number;
}
