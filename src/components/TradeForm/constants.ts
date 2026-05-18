export const SYMBOLS = [
  "AAPL", "TSLA", "NVDA", "MSFT", "AMZN",
  "GOOGL", "META", "SPY", "NFLX", "AMD",
];

export const MOCK_PRICES: Record<string, number> = {
  AAPL: 189.5, TSLA: 242.0, NVDA: 875.0, MSFT: 428.0,
  AMZN: 185.0, GOOGL: 175.0, META: 535.0, SPY: 541.2,
  NFLX: 680.0, AMD: 158.0,
};

export const COMMISSION_PCT = 0.01;

export type FormState = "idle" | "submitting" | "success" | "error";
