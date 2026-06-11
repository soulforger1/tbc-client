import type { Trade, PartialFill } from "@/data/types";

import { getSessionToken } from "@/context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

function reqHeaders(): HeadersInit {
  const token = getSessionToken() ?? "";
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function throwApiError(res: Response): Promise<never> {
  const body = await res.json().catch(() => null);
  throw new Error(body?.error ?? `${res.status} ${res.statusText}`);
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { headers: reqHeaders() });
  if (!res.ok) return throwApiError(res);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: reqHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) return throwApiError(res);
  return res.json() as Promise<T>;
}

async function patch<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers: reqHeaders(),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) return throwApiError(res);
  return res.json() as Promise<T>;
}

export interface WalletEntry {
  id: number;
  currency: string;
  currencyName: string;
  balance: number;
  lockedAmount: number;
  available: number;
}

export interface PortfolioStats {
  portfolioValue: number;
  stockValueUSD: number;
  availableCash: number;
  buyingPower: number;
  totalPnl: number;
  wallets: { currency: string; balance: number; lockedAmount: number }[];
}

export interface HoldingData {
  symbol: string;
  stockId: number;
  qty: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  pnl: number;
  pnlPct: number;
  ccy: string;
  rate: number;
  rateDate: string;
}

export interface PortfolioResponse {
  stats: PortfolioStats;
  holdings: HoldingData[];
}

export interface CreateOrderPayload {
  symbol: string;
  side: "buy" | "sell";
  orderType: "market" | "limit";
  quantity: number;
  price?: number;
  rate?: number;
  goodTill?: "day" | "gtc";
  description?: string;
}

export interface Stock {
  id: number;
  name: string;
  prefix: string;
  exchange: string;
  ccy: string;
  price: number | null;
  pc: number | null;
  mp: number | null;
  value_date: string | null;
  rate: number | null;
}

export interface StocksResponse {
  data: Stock[];
  total: number;
  hasMore: boolean;
}

export interface FeeResponse {
  feeRate: number;
  warranty: string;
  amount: number;
  feeTrans: number;
  stampDuty: number;
  rate: number;
}

export const api = {
  getStocks: (params?: { q?: string; limit?: number; offset?: number }) => {
    const sp = new URLSearchParams();
    if (params?.q) sp.set("q", params.q);
    if (params?.limit != null) sp.set("limit", String(params.limit));
    if (params?.offset != null) sp.set("offset", String(params.offset));
    const qs = sp.toString();
    return get<StocksResponse>(qs ? `/stocks?${qs}` : "/stocks");
  },
  getPortfolio: () => get<PortfolioResponse>("/portfolio"),
  getWallet: () => get<WalletEntry[]>("/portfolio/wallet"),
  getOrders: (status?: string) =>
    get<Trade[]>(
      status ? `/orders?status=${encodeURIComponent(status)}` : "/orders",
    ),
  getOpenOrders: () => get<Trade[]>("/orders/open"),
  createOrder: (payload: CreateOrderPayload) => post<Trade>("/orders", payload),
  cancelOrder: (id: string) => patch<Trade>(`/orders/${id}/cancel`),
  amendOrder: (id: string, quantity: number, price: number) =>
    patch<Trade>(`/orders/${id}/amend`, { quantity, price }),
  getPartialFills: (id: string) =>
    get<PartialFill[]>(`/orders/${id}/partial-fills`),
  getFee: (params: {
    size: number;
    price: number;
    ccy: string;
    date?: string;
  }) => {
    const sp = new URLSearchParams({
      size: String(params.size),
      price: String(params.price),
      ccy: params.ccy,
    });
    if (params.date) sp.set("date", params.date);
    return get<FeeResponse>(`/fee/calculate?${sp.toString()}`);
  },
};
