import { useTranslation } from "react-i18next";
import { TrendingUp, Loader2 } from "lucide-react";
import { formatLocalCurrency } from "@/lib/utils";
import type { Stock } from "@/lib/api";

interface OrderContextPanelProps {
  selectedStock: Stock | null;
  marketPrice: number | null;
  qty: number;
  tradeValue: number;
  commission: number | null;
  fetchingFee?: boolean;
}

const Row = ({ label, value, bold, loading }: { label: string; value: string; bold?: boolean; loading?: boolean }) => (
  <div className="flex items-center justify-between gap-2 py-1.5">
    <span className="text-xs text-ink3">{label}</span>
    {loading ? (
      <Loader2 className="h-3 w-3 animate-spin text-ink4" />
    ) : (
      <span className={`text-xs ${bold ? "font-bold text-ink" : "text-ink2"}`}>{value}</span>
    )}
  </div>
);

export const OrderContextPanel = ({
  selectedStock,
  marketPrice,
  qty,
  tradeValue,
  commission,
  fetchingFee,
}: OrderContextPanelProps) => {
  const { t } = useTranslation();

  if (!selectedStock) {
    return (
      <div className="rounded-xl border border-edge bg-muted/30 h-full flex flex-col items-center justify-center gap-3 py-12 px-6 text-center">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <TrendingUp className="h-5 w-5 text-ink4" />
        </div>
        <p className="text-sm text-ink4 leading-relaxed">
          Select a stock to see price and order details here
        </p>
      </div>
    );
  }

  const ccy = selectedStock.ccy;
  const fmt = (v: number) => formatLocalCurrency(v, ccy);
  const isFeeLoading = fetchingFee && qty > 0 && (marketPrice ?? 0) > 0;
  const total = commission != null ? tradeValue + commission : null;

  return (
    <div className="rounded-xl border border-edge bg-card overflow-hidden h-full flex flex-col">
      {/* Stock info */}
      <div className="px-4 pt-4 pb-3 border-b border-edge">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-base font-bold text-ink">{selectedStock.prefix}</span>
          <span className="text-xs bg-subtle/60 text-ink3 rounded px-1.5 py-0.5 shrink-0">
            {selectedStock.exchange}
          </span>
        </div>
        <p className="text-xs text-ink3 truncate mb-3">{selectedStock.name}</p>
        <div className="flex items-end justify-between gap-2">
          <span className="text-2xl font-bold text-ink">
            {marketPrice != null && marketPrice > 0 ? fmt(marketPrice) : "—"}
          </span>
          <span className="text-xs text-ink4 mb-0.5">{ccy}</span>
        </div>
      </div>

      {/* Order preview */}
      <div className="px-4 py-3 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink4 mb-1">
          {t("trade.createOrder")}
        </p>
        <div className="divide-y divide-edge">
          <Row label={t("trade.quantity")} value={qty > 0 ? `${qty}` : "—"} />
          <Row label={t("trade.price")} value={(marketPrice ?? 0) > 0 ? fmt(marketPrice!) : "—"} />
          <Row
            label={t("trade.value")}
            value={tradeValue > 0 ? fmt(tradeValue) : "—"}
          />
          <Row
            label={t("trade.commission")}
            value={commission != null ? fmt(commission) : "—"}
            loading={isFeeLoading}
          />
        </div>

        {tradeValue > 0 && (
          <div className="mt-3 pt-3 border-t border-edge flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-ink3">{t("trade.estTotal")}</span>
            {isFeeLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-ink4" />
            ) : (
              <span className="text-base font-bold text-ink">
                {total != null ? fmt(total) : "—"}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
