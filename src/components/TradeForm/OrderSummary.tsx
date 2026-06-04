import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";
import { formatCurrency, formatLocalCurrency } from "@/lib/utils";
import type { Stock, FeeResponse } from "@/lib/api";

interface OrderSummaryProps {
  selectedStock: Stock | null;
  marketPrice: number;
  tradeValue: number;
  commission: number | null;
  feeResult: FeeResponse | null;
  buyingPower: number | null;
  goodTill: string;
  orderType?: "market" | "limit";
}

const SummaryRow = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="flex items-center justify-between gap-2">
    <span className="text-sm text-ink3">{label}</span>
    <span
      className={`text-sm font-medium ${highlight ? "text-emerald-500" : "text-ink2"}`}
    >
      {value}
    </span>
  </div>
);

export const OrderSummary = ({
  selectedStock,
  marketPrice,
  tradeValue,
  commission,
  feeResult,
  buyingPower,
  goodTill,
  orderType = "limit",
}: OrderSummaryProps) => {
  const { t } = useTranslation();
  const isMarket = orderType === "market";

  const ccy = selectedStock?.ccy ?? "USD";
  const fmt = (v: number) => formatLocalCurrency(v, ccy);

  const rateLabel =
    feeResult && feeResult.rate !== 1
      ? `${feeResult.rate.toFixed(4)} ${ccy}/USD`
      : ccy === "USD"
        ? "1.0000 USD"
        : "—";

  const commissionLabel =
    commission != null
      ? feeResult
        ? `${fmt(commission)} (${(feeResult.feeRate * 100).toFixed(2)}%)`
        : fmt(commission)
      : t("trade.automatically");

  return (
    <>
      <div className="rounded-lg border border-edge bg-muted/40 px-4 py-3 mb-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink3">
          {t("trade.createOrder")}
        </p>
        <div className="grid grid-cols-1 gap-y-2.5 md:grid-cols-2 md:gap-x-6">
          <SummaryRow label={t("trade.currency")} value={ccy} />
          <SummaryRow
            label={t("trade.buyingPower")}
            value={buyingPower != null ? formatCurrency(buyingPower) : "—"}
            highlight
          />
          {!isMarket && (
            <>
              <SummaryRow label={t("trade.price")} value={fmt(marketPrice)} />
              <SummaryRow
                label={t("trade.value")}
                value={tradeValue > 0 ? fmt(tradeValue) : "—"}
              />
            </>
          )}
          <SummaryRow label={t("trade.goodTill")} value={goodTill} />
          {!isMarket && (
            <>
              <SummaryRow label={t("trade.commission")} value={commissionLabel} />
              <SummaryRow
                label={t("trade.tradeValue")}
                value={
                  tradeValue > 0 && commission != null
                    ? fmt(tradeValue + commission)
                    : "—"
                }
              />
            </>
          )}
          <SummaryRow label={t("trade.rate")} value={rateLabel} />
        </div>
        <div className="mt-3 pt-2.5 border-t border-edge flex items-center gap-1.5">
          <span className="text-sm text-ink3">{t("trade.description")}:</span>
          <span className="text-sm text-ink2">
            {t("trade.descriptionDefault")}
          </span>
        </div>
      </div>

      {!isMarket && (
        <div className="flex items-center gap-1.5 pb-4 text-sm text-ink3">
          <Info className="h-4 w-4 shrink-0" />
          {t("trade.marketPrice")}:{" "}
          <span className="text-ink2">{fmt(marketPrice)}</span>
          {tradeValue > 0 && commission != null && (
            <>
              {" "}
              · {t("trade.estTotal")}:{" "}
              <span className="font-semibold text-ink">
                {fmt(tradeValue + commission)}
              </span>
            </>
          )}
        </div>
      )}
    </>
  );
};
