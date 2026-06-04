import { useTranslation } from "react-i18next";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Select } from "../../ui/select";
import { FormGroup } from "../../ui/form-group";
import type { TradeFormOrderType, TradeFormType } from "./utils";
import type { SetStateAction } from "react";
import { OrderContextPanel } from "../OrderContextPanel";

type TradeFormStep2Props = {
  formData: TradeFormType;
  setFormData: React.Dispatch<SetStateAction<TradeFormType>>;
  setStep: React.Dispatch<SetStateAction<number>>;
};

export const EnterTradeFormAmount = (props: TradeFormStep2Props) => {
  const { formData, setFormData } = props;
  const { quantity, orderType, limitPrice, stock, side, holdingQty } = formData;
  const { t } = useTranslation();

  const marketPrice = stock?.price ?? 0;
  const qty = parseFloat(quantity) || 0;
  const overHolding = side === "sell" && holdingQty != null && qty > holdingQty;

  const setQuantity = (value: string) =>
    setFormData((prev) => ({ ...prev, quantity: value }));

  const setOrderType = (value: TradeFormOrderType) =>
    setFormData((prev) => ({ ...prev, orderType: value }));

  const setLimitPrice = (value: string) =>
    setFormData((prev) => ({ ...prev, limitPrice: value }));

  return (
    <div className="grid grid-cols-2 gap-3">
      <FormGroup label={t("trade.quantity")}>
        <Input
          placeholder="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value.replace(/\D/g, ""))}
          className={`h-9 text-sm font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${overHolding ? "border-red-500 focus:ring-red-500" : ""}`}
          autoFocus
        />
        {side === "sell" && holdingQty != null && (
          <p className={`mt-1 text-xs ${overHolding ? "text-red-500" : "text-ink4"}`}>
            {overHolding
              ? `Exceeds your holding of ${holdingQty} shares`
              : `You own ${holdingQty} shares`}
          </p>
        )}
      </FormGroup>
      <FormGroup label={t("trade.orderType")}>
        <Select
          value={orderType}
          onChange={(e) => {
            setOrderType(e.target.value as "market" | "limit");
            setLimitPrice("");
          }}
          className="h-9 text-sm font-semibold"
        >
          <option value="market">{t("trade.market")}</option>
          <option value="limit">{t("trade.limit")}</option>
        </Select>
      </FormGroup>
      {orderType === "limit" && (
        <FormGroup label={t("trade.limitPrice")} className="col-span-2">
          <Input
            placeholder={marketPrice > 0 ? marketPrice.toFixed(2) : "0.00"}
            value={limitPrice}
            onChange={(e) =>
              setLimitPrice(
                e.target.value
                  .replace(/[^\d.]/g, "")
                  .replace(/^(\d*\.?\d*).*$/, "$1"),
              )
            }
            className="h-9 text-sm font-semibold"
          />
        </FormGroup>
      )}
    </div>
  );
};

export const TradeFormStep2 = (props: TradeFormStep2Props) => {
  const { formData, setStep } = props;
  const { quantity, orderType, limitPrice, stock, feeResult, fetchingFee, side, holdingQty } =
    formData;
  const { t } = useTranslation();

  const marketPrice = stock?.price ?? 0;
  const qty = parseFloat(quantity) || 0;
  const limitPriceNum = parseFloat(limitPrice) || 0;
  const effectivePrice =
    orderType === "limit" && limitPriceNum > 0 ? limitPriceNum : marketPrice;
  const tradeValue = qty * effectivePrice;
  const commission = feeResult?.feeTrans ?? null;
  const overHolding = side === "sell" && holdingQty != null && qty > holdingQty;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
      <div className="lg:col-span-3 flex flex-col gap-4">
        <EnterTradeFormAmount {...props} />

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            className="flex-1"
            onClick={() => setStep(1)}
          >
            {t("trade.back")}
          </Button>
          <Button
            type="button"
            size="md"
            className="flex-1"
            onClick={() => setStep(3)}
            disabled={
              !quantity ||
              qty <= 0 ||
              (orderType === "limit" && limitPriceNum <= 0) ||
              overHolding
            }
          >
            {t("trade.continue")}
          </Button>
        </div>
      </div>
      <div className="lg:col-span-2">
        <OrderContextPanel
          selectedStock={stock}
          marketPrice={effectivePrice}
          qty={qty}
          tradeValue={tradeValue}
          commission={commission}
          fetchingFee={fetchingFee}
          orderType={orderType}
        />
      </div>
    </div>
  );
};
