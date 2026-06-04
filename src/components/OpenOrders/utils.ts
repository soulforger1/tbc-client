import type { Trade, GoodTill } from "@/data/types";

export const isOpenOrder = (trade: Trade) => trade.status === "open";

export const goodTillLabel = (gt: GoodTill) => (gt === "day" ? "Day" : "GTC");
