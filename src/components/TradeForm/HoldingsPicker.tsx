import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Loader2 } from "lucide-react";
import { api, type HoldingData, type Stock } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

interface HoldingsPickerProps {
  value: string;
  onSelect: (holding: HoldingData, stock: Stock) => void;
}

export const HoldingsPicker = ({ value, onSelect }: HoldingsPickerProps) => {
  const { t } = useTranslation();
  const [holdings, setHoldings] = useState<HoldingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getPortfolio()
      .then((p) => setHoldings(p.holdings))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (h: HoldingData) => {
    const stock: Stock = {
      id: h.stockId,
      name: h.symbol,
      prefix: h.symbol,
      exchange: "",
      ccy: h.ccy,
      price: h.currentPrice,
      pc: null,
      mp: null,
      value_date: null,
    };
    onSelect(h, stock);
  };

  return (
    <div className="rounded-xl border border-edge bg-card overflow-hidden">
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-ink3" />
        </div>
      ) : holdings.length === 0 ? (
        <div className="px-4 py-10 text-center text-sm text-ink4">
          {t("trade.noHoldings")}
        </div>
      ) : (
        <ul className="max-h-72 overflow-y-auto">
          {holdings.map((h) => {
            const selected = h.symbol === value;
            const pnlPositive = h.pnl >= 0;
            return (
              <li key={h.symbol} className="border-b border-edge last:border-0">
                <button
                  type="button"
                  onClick={() => handleSelect(h)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors border-l-2 ${
                    selected
                      ? "bg-blue-500/10 border-blue-500"
                      : "hover:bg-muted border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`text-sm font-bold shrink-0 rounded px-1.5 py-0.5 ${
                        selected
                          ? "bg-blue-500/20 text-blue-500"
                          : "bg-subtle/60 text-ink"
                      }`}
                    >
                      {h.symbol}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm text-ink2">{t("trade.holdingShares", { count: h.qty })}</p>
                      <p className="text-xs text-ink4">
                        {t("trade.holdingAvg", { price: formatCurrency(h.avgPrice), ccy: h.ccy })}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 ml-3 flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-ink">
                        {formatCurrency(h.currentPrice)}
                      </p>
                      <p className={`text-xs font-medium ${pnlPositive ? "text-emerald-500" : "text-red-500"}`}>
                        {pnlPositive ? "+" : ""}{h.pnlPct.toFixed(2)}%
                      </p>
                    </div>
                    <div className="w-4 flex items-center justify-center">
                      {selected && <Check className="h-4 w-4 text-blue-500" />}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <div className="px-4 py-2 border-t border-edge bg-muted/40 text-xs text-ink4">
        {loading ? t("trade.holdingsLoading") : t("trade.holdingCount", { count: holdings.length })}
      </div>
    </div>
  );
};
