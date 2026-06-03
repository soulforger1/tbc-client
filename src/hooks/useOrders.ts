import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Trade } from "@/data/types";

export function useOrders(status?: string) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getOrders(status)
      .then(setTrades)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [status]);

  return { trades, loading, error };
}
