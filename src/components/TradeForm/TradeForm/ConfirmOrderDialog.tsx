import { useTranslation } from "react-i18next";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Modal } from "../../ui/modal";
import { Button } from "../../ui/button";
import { formatLocalCurrency } from "@/lib/utils";
import type { TradeFormType } from "./utils";

interface ConfirmOrderDialogProps {
  formData: TradeFormType;
  submitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between py-1.5 text-sm">
    <span className="text-ink3">{label}</span>
    <span className="text-ink2 font-medium">{value}</span>
  </div>
);

export const ConfirmOrderDialog = ({
  formData,
  submitting,
  onConfirm,
  onCancel,
}: ConfirmOrderDialogProps) => {
  const { t } = useTranslation();
  const { stock, orderType, limitPrice, quantity, feeResult, side, symbol } =
    formData;
  const ccy = stock.ccy;
  const fmt = (v: number) => formatLocalCurrency(v, ccy);

  const marketPrice = stock?.price ?? 0;
  const qty = parseFloat(quantity) || 0;
  const limitPriceNum = parseFloat(limitPrice) || 0;
  const effectivePrice =
    orderType === "limit" && limitPriceNum > 0 ? limitPriceNum : marketPrice;
  const tradeValue = qty * effectivePrice;
  const commission = feeResult?.feeTrans ?? null;
  const total = commission != null ? tradeValue + commission : tradeValue;

  return (
    <Modal onClose={onCancel} maxWidth="sm">
      <div className="px-5 pt-5 pb-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <p className="font-semibold text-ink">
              {t("trade.confirmOrderTitle")}
            </p>
            <p className="text-xs text-ink3 mt-0.5">
              {t("trade.confirmOrderSubtitle")}
            </p>
          </div>
        </div>

        {/* Order details */}
        <div className="rounded-lg border border-edge bg-muted/40 px-4 py-2 mb-4 divide-y divide-edge">
          <Row
            label={t("trade.side")}
            value={t(side === "buy" ? "trade.buy" : "trade.sell")}
          />
          <Row label={t("trade.symbol")} value={symbol} />
          <Row label={t("trade.quantity")} value={`${qty}`} />
          <Row
            label={t("trade.orderType")}
            value={t(orderType === "market" ? "trade.market" : "trade.limit")}
          />
          {orderType === "limit" && effectivePrice > 0 && (
            <Row label={t("trade.limitPrice")} value={fmt(effectivePrice)} />
          )}
          {orderType === "limit" && (
            <>
              <Row
                label={t("trade.value")}
                value={tradeValue > 0 ? fmt(tradeValue) : "—"}
              />
              <Row
                label={t("trade.commission")}
                value={
                  commission != null
                    ? feeResult
                      ? `${fmt(commission)} (${(feeResult.feeRate * 100).toFixed(2)}%)`
                      : fmt(commission)
                    : "—"
                }
              />
              <div className="flex items-center justify-between pt-2.5 pb-1">
                <span className="text-sm font-semibold text-ink">
                  {t("trade.estTotal")}
                </span>
                <span className="text-base font-bold text-ink">{fmt(total)}</span>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            className="flex-1"
            onClick={onCancel}
            disabled={submitting}
          >
            {t("trade.back")}
          </Button>
          <Button
            type="button"
            size="md"
            className="flex-1"
            variant={side === "buy" ? "success" : "destructive"}
            onClick={onConfirm}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("trade.placing")}
              </>
            ) : (
              t("trade.confirmOrder")
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
