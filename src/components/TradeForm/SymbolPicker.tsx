import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  Search,
  Loader2,
  Check,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { type Stock } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { stockPriceToUSD } from "@/lib/currency";
import { useStockList } from "@/hooks/useStockList";

interface SymbolPickerProps {
  value: string;
  onChange: (symbol: string) => void;
  onStockSelect?: (stock: Stock) => void;
  initialStock?: Stock | null;
  alwaysOpen?: boolean;
}

const PriceChange = ({ pc }: { pc: number | null }) => {
  if (pc == null) return null;
  const positive = pc >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${positive ? "text-emerald-500" : "text-red-500"}`}
    >
      {positive ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {positive ? "+" : ""}
      {pc.toFixed(2)}%
    </span>
  );
};

export const SymbolPicker = ({
  value,
  onChange,
  onStockSelect,
  initialStock,
  alwaysOpen,
}: SymbolPickerProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    query,
    setQuery,
    stocks,
    loading,
    loadingMore,
    hasMore,
    sentinelRef,
  } = useStockList(!!alwaysOpen);

  const bannerStock =
    initialStock ?? stocks.find((s) => s.prefix === value) ?? null;
  const selectedStock = stocks.find((s) => s.prefix === value);

  // ── dropdown open/close helpers ───────────────────────────────────────────
  useEffect(() => {
    if (open) {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (rect) {
        setDropdownStyle({
          position: "fixed",
          top: rect.bottom + 6,
          left: rect.left,
          width: Math.max(rect.width, 340),
          zIndex: 9999,
        });
      }
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        buttonRef.current?.contains(e.target as Node) ||
        document
          .getElementById("symbol-picker-dropdown")
          ?.contains(e.target as Node)
      )
        return;
      setOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // client-side filter for dropdown only (alwaysOpen uses server-side)
  const filtered = alwaysOpen
    ? stocks
    : query.trim()
      ? stocks.filter(
          (s) =>
            s.prefix?.toLowerCase().includes(query.toLowerCase()) ||
            s.name?.toLowerCase().includes(query.toLowerCase()),
        )
      : stocks;

  // ── alwaysOpen render ─────────────────────────────────────────────────────
  if (alwaysOpen) {
    return (
      <div className="rounded-xl border border-edge bg-card overflow-hidden">
        {/* Selected stock banner */}
        {bannerStock ? (
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-blue-500/10 border-b border-blue-500/30">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-blue-500 truncate">
                  {bannerStock.prefix}
                </div>
                <div className="text-xs text-ink3 truncate">
                  {bannerStock.name}
                </div>
              </div>
            </div>
            <div className="shrink-0 text-right ml-2">
              <div className="text-sm font-bold text-ink">
                {stockPriceToUSD(bannerStock.price, bannerStock.rate) != null
                  ? formatCurrency(
                      stockPriceToUSD(bannerStock.price, bannerStock.rate)!,
                    )
                  : "—"}
              </div>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <PriceChange pc={bannerStock.pc} />
                <span className="text-xs text-ink4">{bannerStock.ccy}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-3 border-b border-edge bg-muted/40 text-sm text-ink4">
            <div className="w-6 h-6 rounded-full border-2 border-dashed border-ink4 shrink-0" />
            {t("symbol.noStockSelected")}
          </div>
        )}

        {/* Search bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-edge bg-muted/60">
          <Search className="h-4 w-4 shrink-0 text-ink3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("symbol.searchPlaceholder")}
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink4 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-ink4 hover:text-ink text-xs shrink-0"
            >
              {t("symbol.clear")}
            </button>
          )}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-ink3" />
          </div>
        ) : (
          <ul className="max-h-64 overflow-y-auto">
            {stocks.length === 0 ? (
              <li className="px-4 py-4 text-sm text-ink4 text-center">
                {query
                  ? t("symbol.noStocksFoundFor", { query })
                  : t("symbol.noStocksFound")}
              </li>
            ) : (
              <>
                {stocks.map((s) => {
                  const isSelected = s.prefix === value;
                  return (
                    <li
                      key={s.id}
                      className="border-b border-edge last:border-0"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onChange(s.prefix);
                          onStockSelect?.(s);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors border-l-2 ${isSelected ? "bg-blue-500/10 border-blue-500" : "hover:bg-muted border-transparent"}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`text-sm font-bold shrink-0 max-w-[8rem] truncate rounded px-1.5 py-0.5 ${isSelected ? "bg-blue-500/20 text-blue-500" : "bg-subtle/60 text-ink"}`}
                          >
                            {s.prefix}
                          </span>
                          <div className="min-w-0">
                            <div
                              className={`text-sm truncate ${isSelected ? "text-ink font-medium" : "text-ink2"}`}
                            >
                              {s.name}
                            </div>
                            <div className="text-xs text-ink4 truncate">
                              {s.exchange} · {s.ccy}
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 ml-3 flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm font-semibold text-ink">
                              {stockPriceToUSD(s.price, s.rate) != null
                                ? formatCurrency(
                                    stockPriceToUSD(s.price, s.rate)!,
                                  )
                                : "—"}
                            </div>
                            <PriceChange pc={s.pc} />
                          </div>
                          <div className="w-4 flex items-center justify-center">
                            {isSelected && (
                              <Check className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
                {/* Infinite scroll sentinel */}
                <div
                  ref={sentinelRef}
                  className="py-2 flex items-center justify-center"
                >
                  {loadingMore && (
                    <Loader2 className="h-4 w-4 animate-spin text-ink4" />
                  )}
                </div>
              </>
            )}
          </ul>
        )}

        <div className="px-4 py-2 border-t border-edge bg-muted/40 text-xs text-ink4">
          {query
            ? t("symbol.stocksMatching", { count: stocks.length, query })
            : t("symbol.stocksLoaded", { count: stocks.length })}
          {hasMore && !loading && ` · ${t("symbol.scrollForMore")}`}
        </div>
      </div>
    );
  }

  // ── dropdown render ───────────────────────────────────────────────────────
  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full h-9 flex items-center justify-between gap-1 rounded-lg border border-edge bg-muted px-3 text-sm text-ink transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <span className="font-semibold truncate">
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-ink3" />
          ) : (
            (selectedStock?.prefix ?? value)
          )}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-ink3 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open &&
        createPortal(
          <div
            id="symbol-picker-dropdown"
            style={dropdownStyle}
            className="rounded-xl border border-edge bg-card shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-edge bg-muted/60">
              <Search className="h-4 w-4 shrink-0 text-ink3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("symbol.searchPlaceholder")}
                className="w-full bg-transparent text-sm text-ink placeholder:text-ink4 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-ink4 hover:text-ink text-xs shrink-0"
                >
                  {t("symbol.clear")}
                </button>
              )}
            </div>

            <ul className="max-h-64 overflow-y-auto">
              {filtered.length === 0 ? (
                <li className="px-4 py-4 text-sm text-ink4 text-center">
                  {t("symbol.noStocksFoundFor", { query })}
                </li>
              ) : (
                filtered.map((s) => (
                  <li key={s.id} className="border-b border-edge last:border-0">
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onChange(s.prefix);
                        onStockSelect?.(s);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted transition-colors ${s.prefix === value ? "bg-muted/80" : ""}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-sm font-bold text-ink shrink-0 max-w-[8rem] truncate bg-subtle/60 rounded px-1.5 py-0.5">
                          {s.prefix}
                        </span>
                        <span className="text-sm text-ink2 truncate">
                          {s.name}
                        </span>
                      </div>
                      <div className="shrink-0 ml-3 flex flex-col items-end gap-0.5">
                        <span className="text-xs font-semibold text-ink">
                          {stockPriceToUSD(s.price, s.rate) != null
                            ? formatCurrency(stockPriceToUSD(s.price, s.rate)!)
                            : "—"}
                        </span>
                        <PriceChange pc={s.pc} />
                      </div>
                    </button>
                  </li>
                ))
              )}
            </ul>

            <div className="px-4 py-2 border-t border-edge bg-muted/40 text-xs text-ink4">
              {query
                ? t("symbol.stocksMatching", { count: filtered.length, query })
                : t("symbol.stocksAvailable", { count: filtered.length })}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};
