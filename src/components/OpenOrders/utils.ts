import type { Trade, GoodTill } from "@/data/types";

export const isOpenOrder = (trade: Trade) =>
  trade.status === "open" || trade.status === "filing" || trade.status === "nominal";

export const goodTillLabel = (gt: GoodTill) => (gt === "day" ? "Day" : "GTC");
