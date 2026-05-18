import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { stats } from "@/data/dummy";

interface OrderSummaryProps {
  marketPrice: number;
  tradeValue: number;
  commission: number;
  goodTill: string;
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
    <span className="text-xs text-ink4">{label}</span>
    <span className={`text-xs font-medium ${highlight ? "text-emerald-500" : "text-ink3"}`}>
      {value}
    </span>
  </div>
);

export const OrderSummary = ({
  marketPrice,
  tradeValue,
  commission,
  goodTill,
}: OrderSummaryProps) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="rounded-lg border border-edge bg-muted/40 px-4 py-3 mb-4">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-ink4">
          {t("trade.createOrder")}
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
          <SummaryRow label={t("trade.currency")} value={t("trade.automatically")} />
          <SummaryRow label={t("trade.buyingPower")} value={formatCurrency(stats.buyingPower)} highlight />
          <SummaryRow label={t("trade.price")} value={formatCurrency(marketPrice)} />
          <SummaryRow
            label={t("trade.value")}
            value={tradeValue > 0 ? formatCurrency(tradeValue) : t("trade.automatically")}
          />
          <SummaryRow label={t("trade.goodTill")} value={goodTill} />
          <SummaryRow
            label={t("trade.commission")}
            value={commission > 0 ? `${formatCurrency(commission)} (1%)` : t("trade.commissionAuto")}
          />
          <SummaryRow
            label={t("trade.tradeValue")}
            value={tradeValue > 0 ? formatCurrency(tradeValue + commission) : t("trade.automatically")}
          />
          <SummaryRow label={t("trade.rate")} value={t("trade.rateDefault")} />
        </div>
        <div className="mt-3 pt-2.5 border-t border-edge flex items-center gap-1.5">
          <span className="text-xs text-ink4">{t("trade.description")}:</span>
          <span className="text-xs text-ink3">{t("trade.descriptionDefault")}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 pb-4 text-xs text-ink4">
        <Info className="h-3.5 w-3.5 flex-shrink-0" />
        {t("trade.marketPrice")}:{" "}
        <span className="text-ink3">{formatCurrency(marketPrice)}</span>
        {tradeValue > 0 && (
          <>
            {" "}· {t("trade.estTotal")}:{" "}
            <span className="font-medium text-ink2">
              {formatCurrency(tradeValue + commission)}
            </span>
          </>
        )}
      </div>
    </>
  );
};
