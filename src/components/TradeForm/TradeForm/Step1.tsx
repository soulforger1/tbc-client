import { useTranslation } from "react-i18next";
import { Button } from "../../ui/button";
import { SymbolPicker } from "../SymbolPicker";
import { HoldingsPicker } from "../HoldingsPicker";
import { TradeFormDefaultValues, type TradeFormType } from "./utils";
import type { HoldingData, Stock } from "@/lib/api";
import { OrderContextPanel } from "../OrderContextPanel";

type TradeFormStep1Props = {
  formData: TradeFormType;
  setFormData: React.Dispatch<React.SetStateAction<TradeFormType>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

export const TradeFormStep1 = (props: TradeFormStep1Props) => {
  const { formData, setFormData, setStep } = props;
  const { symbol, stock, quantity, limitPrice, orderType, side } = formData;
  const { feeResult, fetchingFee } = formData;
  const { t } = useTranslation();

  const marketPrice = stock?.price ?? 0;
  const qty = parseFloat(quantity) || 0;
  const limitPriceNum = parseFloat(limitPrice) || 0;
  const effectivePrice =
    orderType === "limit" && limitPriceNum > 0 ? limitPriceNum : marketPrice;
  const tradeValue = qty * effectivePrice;
  const commission = feeResult?.feeTrans ?? null;

  const handleClear = () => {
    setFormData(TradeFormDefaultValues);
    setStep(1);
  };

  const handleSymbolChange = (newSymbol: string) => {
    setFormData((prev) => ({ ...prev, symbol: newSymbol }));
  };
  const handleStockChange = (newStock: Stock) => {
    setFormData((prev) => ({ ...prev, stock: newStock }));
  };
  const handleHoldingSelect = (holding: HoldingData, resolvedStock: Stock) => {
    setFormData((prev) => ({
      ...prev,
      symbol: holding.symbol,
      stock: resolvedStock,
      holdingQty: holding.qty,
    }));
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
      <div className="lg:col-span-3 flex flex-col gap-4">
        {side === "sell" ? (
          <HoldingsPicker value={symbol} onSelect={handleHoldingSelect} />
        ) : (
          <SymbolPicker
            value={symbol}
            onChange={handleSymbolChange}
            onStockSelect={handleStockChange}
            initialStock={stock}
            alwaysOpen
          />
        )}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            className="flex-1"
            onClick={handleClear}
          >
            {t("trade.clear")}
          </Button>
          <Button
            type="button"
            size="md"
            className="flex-1"
            onClick={() => setStep(2)}
            disabled={!symbol}
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
        />
      </div>
    </div>
  );
};
