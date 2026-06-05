import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Trade } from "@/data/types";

interface OpenOrdersContextValue {
  orders: Trade[];
  loading: boolean;
  error: string | null;
  addOrder: (order: Trade) => void;
  refetch: () => Promise<void>;
  cancel: (id: string) => Promise<void>;
  amend: (id: string, qty: number, price: number) => Promise<void>;
}

const OpenOrdersContext = createContext<OpenOrdersContextValue | null>(null);

export const OpenOrdersProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [orders, setOrders] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      const data = await api.getOpenOrders();
      setOrders(data);
      setError(null);
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  };

  useEffect(() => {
    setLoading(true);
    refetch().finally(() => setLoading(false));
  }, []);

  const addOrder = (order: Trade) => setOrders((prev) => [order, ...prev]);

  const cancel = async (id: string) => {
    const updated = await api.cancelOrder(id);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
  };

  const amend = async (id: string, qty: number, price: number) => {
    const updated = await api.amendOrder(id, qty, price);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
  };

  return (
    <OpenOrdersContext.Provider
      value={{ orders, loading, error, addOrder, refetch, cancel, amend }}
    >
      {children}
    </OpenOrdersContext.Provider>
  );
};

export const useOpenOrders = () => {
  const ctx = useContext(OpenOrdersContext);
  if (!ctx)
    throw new Error("useOpenOrders must be used within OpenOrdersProvider");
  return ctx;
};
