import { useState, useEffect, useRef, useCallback } from "react";
import { api, type Stock } from "@/lib/api";

const PAGE_SIZE = 20;

export function useStockList(alwaysOpen: boolean) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [stockOffset, setStockOffset] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!alwaysOpen) return;
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query, alwaysOpen]);

  useEffect(() => {
    if (!alwaysOpen) return;
    setStocks([]);
    setStockOffset(0);
    setHasMore(false);
    setLoading(true);
    api
      .getStocks({ limit: PAGE_SIZE, offset: 0, q: debouncedQuery || undefined })
      .then(({ data, hasMore: more }) => {
        setStocks(data);
        setHasMore(more);
        setStockOffset(PAGE_SIZE);
      })
      .finally(() => setLoading(false));
  }, [debouncedQuery, alwaysOpen]);

  useEffect(() => {
    if (alwaysOpen) return;
    api
      .getStocks()
      .then(({ data }) => setStocks(data))
      .finally(() => setLoading(false));
  }, [alwaysOpen]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const { data, hasMore: more } = await api.getStocks({
        limit: PAGE_SIZE,
        offset: stockOffset,
        q: debouncedQuery || undefined,
      });
      setStocks((prev) => [...prev, ...data]);
      setHasMore(more);
      setStockOffset((prev) => prev + PAGE_SIZE);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, stockOffset, debouncedQuery]);

  useEffect(() => {
    if (!alwaysOpen) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [alwaysOpen, loadMore]);

  return {
    query,
    setQuery,
    stocks,
    loading,
    loadingMore,
    hasMore,
    sentinelRef,
    debouncedQuery,
  };
}
