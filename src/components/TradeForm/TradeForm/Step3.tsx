import { useState, type SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import type { Trade } from "@/data/types";
import { Button } from "../../ui/button";
import { Alert } from "../../ui/alert";
import { OrderSummary } from "../OrderSummary";
import type { TradeFormType } from "./utils";
import { ConfirmOrderDialog } from "./ConfirmOrderDialog";
import { TradeFormAmountFields } from "./Step2";
import { formatLocalCurrency, formatCurrency } from "@/lib/utils";
import { nativeToUSD, limitPriceToNative } from "@/lib/currency";

type TradeFormStep3Props = {
  formData: TradeFormType;
  setFormData: React.Dispatch<SetStateAction<TradeFormType>>;
  setStep: React.Dispatch<SetStateAction<number>>;
  onOrderCreated?: (order: Trade) => void;
};

export const TradeFormStep3 = (props: TradeFormStep3Props) => {
  const { formData, setStep, onOrderCreated } = props;
  const { symbol, formState, side, orderType, stock, feeResult, goodTill } =
    formData;
  const { quantity, limitPrice, buyingPower, errorMessage } = formData;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const marketPrice = stock?.price ?? 0;
  const qty = parseFloat(quantity) || 0;
  const limitPriceNum = parseFloat(limitPrice) || 0;
  const ccy = stock?.ccy ?? "USD";
  const rate = feeResult?.rate ?? stock?.rate ?? undefined;
  const isNonUsdNonHkd = ccy !== "USD" && ccy !== "HKD";
  const convertingToUsd = ccy !== "USD" && rate != null && rate > 0;
  const limitPriceLocal = limitPriceToNative(limitPriceNum, ccy, rate);
  const effectivePrice =
    orderType === "limit" && limitPriceNum > 0
      ? isNonUsdNonHkd && !rate
        ? marketPrice
        : limitPriceLocal
      : marketPrice;
  const tradeValue = qty * effectivePrice;
  const commission = feeResult?.feeTrans ?? null;
  // non-USD non-HKD: user types USD (no conversion); HKD: user types HKD, convert to USD
  const fmtPrice = (v: number) => {
    if (!convertingToUsd) return formatLocalCurrency(v, ccy);
    return formatCurrency(isNonUsdNonHkd ? v : nativeToUSD(v, rate!));
  };
  const goodTillLabel =
    orderType === "market" || goodTill === "day"
      ? t("trade.dayGoodTill")
      : t("trade.gtc");

  const { setFormData } = props;
  const handleSubmit = async () => {
    setFormData((prev) => ({ ...prev, formState: "submitting" }));
    setOpen(false);
    try {
      const created = await api.createOrder({
        symbol,
        side,
        orderType,
        quantity: qty,
        price:
          orderType === "limit" && limitPriceNum > 0
            ? limitPriceLocal
            : undefined,
        rate: rate ?? undefined,
        goodTill: orderType === "market" ? "day" : goodTill,
      });
      onOrderCreated?.(created);
      setFormData((prev) => ({
        ...prev,
        formState: "success",
        errorMessage: null,
      }));
    } catch (err) {
      setFormData((prev) => ({
        ...prev,
        formState: "error",
        errorMessage: err instanceof Error ? err.message : null,
      }));
    }
  };
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <div>
        <div className="mb-4">
          <TradeFormAmountFields {...props} />
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4 px-3 py-2.5 rounded-lg border border-edge bg-muted/40 text-sm">
          <span
            className={`text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded ${
              side === "buy"
                ? "bg-emerald-500/15 text-emerald-500"
                : "bg-red-500/15 text-red-500"
            }`}
          >
            {t(side === "buy" ? "trade.buy" : "trade.sell")}
          </span>
          <span className="font-semibold text-ink">{symbol}</span>
          <span className="text-ink4">·</span>
          <span className="text-ink2">
            {qty} {t("trade.quantity").toLowerCase()}
          </span>
          <span className="text-ink4">·</span>
          <span className="text-ink2">
            {t(orderType === "market" ? "trade.market" : "trade.limit")}
          </span>
          {orderType === "limit" && limitPriceNum > 0 && (
            <>
              <span className="text-ink4">·</span>
              <span className="text-ink2">
                {t("trade.limitPrice")} {fmtPrice(limitPriceNum)}
              </span>
            </>
          )}
        </div>

        <OrderSummary
          selectedStock={stock}
          marketPrice={effectivePrice}
          tradeValue={tradeValue}
          commission={commission}
          feeResult={feeResult}
          buyingPower={buyingPower}
          goodTill={goodTillLabel}
          orderType={orderType}
        />

        {formState === "success" && (
          <Alert variant="success" className="mb-3">
            {t("trade.placed")}
          </Alert>
        )}
        {formState === "error" && (
          <Alert variant="error" className="mb-3">
            {errorMessage ?? t("trade.failed")}
          </Alert>
        )}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            className="flex-1"
            onClick={() => setStep(2)}
            disabled={formState === "submitting"}
          >
            {t("trade.back")}
          </Button>
          <Button
            type="button"
            size="md"
            className="flex-1"
            variant={side === "buy" ? "success" : "destructive"}
            onClick={() => setOpen(true)}
            disabled={formState === "submitting"}
          >
            {formState === "submitting" ? (
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

      {open && (
        <ConfirmOrderDialog
          formData={formData}
          submitting={formState === "submitting"}
          onConfirm={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};
