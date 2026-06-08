import { useEffect, useRef, useState } from "react";
import { BarChart2, Search, TrendingDown, TrendingUp, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Modal } from "./ui/modal";
import { api } from "@/lib/api";
import type { Stock } from "@/lib/api";
import type { Trade } from "@/data/types";
import { formatCurrency } from "@/lib/utils";
import { STATUS_TEXT_COLOR } from "./TradeHistory";

interface SearchPanelProps {
  onClose: () => void;
  onNavigate?: (tab: string) => void;
  onSelectStock?: (stock: Stock) => void;
}

export const SearchPanel = ({ onClose, onNavigate, onSelectStock }: SearchPanelProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState<Trade[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loadingStocks, setLoadingStocks] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    api
      .getOrders()
      .then(setOrders)
      .catch((err) => console.error("Failed to fetch orders:", err));
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = query.trim();
    if (!q) {
      setStocks([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      setLoadingStocks(true);
      api
        .getStocks({ q, limit: 5 })
        .then((res) => setStocks(res.data))
        .catch(() => setStocks([]))
        .finally(() => setLoadingStocks(false));
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const q = query.trim().toLowerCase();
  const filteredOrders = q
    ? orders
        .filter(
          (tr) =>
            tr.symbol.toLowerCase().includes(q) ||
            tr.id.toLowerCase().includes(q) ||
            (tr.status ?? "").toLowerCase().includes(q),
        )
        .slice(0, 10)
    : [];

  const totalResults = stocks.length + filteredOrders.length;
  const isEmpty = !!q && !loadingStocks && totalResults === 0;

  return (
    <Modal align="top" maxWidth="lg" onClose={onClose}>
      {/* Input */}
      <div className="flex items-center gap-3 border-b border-edge px-4 py-3">
        <Search className="h-4 w-4 shrink-0 text-ink4" />
        <input
          ref={inputRef}
          autoFocus
          type="text"
          placeholder={t("common.searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink4 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-ink4 hover:text-ink3 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <kbd className="rounded border border-edge px-1.5 py-0.5 text-xs text-ink4">
          Esc
        </kbd>
      </div>

      {/* Results */}
      <div className="max-h-80 overflow-y-auto">
        {!q && (
          <p className="px-4 py-8 text-center text-sm text-ink4">
            {t("common.typeToSearch")}
          </p>
        )}
        {isEmpty && (
          <p className="px-4 py-8 text-center text-sm text-ink4">
            {t("common.noResults", { query })}
          </p>
        )}

        {/* Stocks section */}
        {stocks.length > 0 && (
          <>
            <p className="px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-ink4 bg-muted/40">
              {t("common.stocksSection")}
            </p>
            {stocks.map((stock) => {
              const pcPositive = stock.pc != null && stock.pc >= 0;
              return (
                <div
                  key={stock.id}
                  onClick={() => { onSelectStock?.(stock); onNavigate?.("trade"); onClose(); }}
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors cursor-pointer border-b border-edge/50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-500/15">
                      <BarChart2 className="h-3.5 w-3.5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        {stock.prefix}
                        <span className="ml-2 text-xs font-normal text-ink4">
                          {stock.exchange}
                        </span>
                      </p>
                      <p className="text-xs text-ink4 truncate max-w-48">
                        {stock.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {stock.price != null ? (
                      <>
                        <p className="text-sm font-medium text-ink">
                          {stock.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                          <span className="ml-1 text-xs text-ink4">
                            {stock.ccy}
                          </span>
                        </p>
                        {stock.pc != null && (
                          <span
                            className={`text-xs font-medium ${pcPositive ? "text-emerald-500" : "text-red-500"}`}
                          >
                            {pcPositive ? "+" : ""}
                            {stock.pc.toFixed(2)}%
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-ink4">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Orders section */}
        {filteredOrders.length > 0 && (
          <>
            <p className="px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-ink4 bg-muted/40">
              {t("common.ordersSection")}
            </p>
            {filteredOrders.map((tr) => (
              <div
                key={tr.id}
                onClick={() => { onNavigate?.(tr.status === "open" ? "orders" : "history"); onClose(); }}
                className="flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors cursor-pointer border-b border-edge/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-md ${tr.side === "buy" ? "bg-emerald-500/15" : "bg-red-500/15"}`}
                  >
                    {tr.side === "buy" ? (
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {tr.symbol}
                      <span className="ml-2 text-xs font-normal text-ink4">
                        {tr.id}
                      </span>
                    </p>
                    <p className="text-xs text-ink4 capitalize">
                      {tr.orderType} · {tr.goodTill.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-ink">
                    {formatCurrency(tr.total)}
                  </p>
                  <span
                    className={`text-xs font-medium capitalize ${STATUS_TEXT_COLOR[tr.status] ?? "text-ink4"}`}
                  >
                    {tr.status}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {q && totalResults > 0 && (
        <div className="border-t border-edge px-4 py-2">
          <p className="text-xs text-ink4">
            {t("common.nResults", { count: totalResults })}
          </p>
        </div>
      )}
    </Modal>
  );
};
