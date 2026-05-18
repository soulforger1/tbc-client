import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Alert } from "../ui/alert";
import { useToast } from "../Toast";
import { SideSwitcher } from "./SideSwitcher";
import { OrderFields } from "./OrderFields";
import { OrderSummary } from "./OrderSummary";
import { MOCK_PRICES, COMMISSION_PCT, type FormState } from "./constants";

export const TradeForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [symbol, setSymbol] = useState("AAPL");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [quantity, setQuantity] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");

  const marketPrice = MOCK_PRICES[symbol] ?? 0;
  const qty = parseFloat(quantity) || 0;
  const tradeValue = qty * marketPrice;
  const commission = tradeValue > 0 ? tradeValue * COMMISSION_PCT : 0;
  const goodTill =
    orderType === "market" ? t("trade.dayGoodTill") : t("trade.gtc");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || qty <= 0) return;
    setFormState("submitting");
    setTimeout(() => {
      setFormState("success");
      toast(t("trade.placed"), "success");
      setTimeout(() => {
        setFormState("idle");
        setQuantity("");
      }, 1800);
    }, 1200);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t("trade.section")}</CardTitle>
        <span className="text-xs text-ink4">{t("trade.createOrder")}</span>
      </CardHeader>
      <CardContent>
        <SideSwitcher side={side} onChange={setSide} />

        <form onSubmit={handleSubmit}>
          <OrderFields
            symbol={symbol}
            quantity={quantity}
            orderType={orderType}
            onSymbolChange={setSymbol}
            onQuantityChange={setQuantity}
            onOrderTypeChange={setOrderType}
          />

          <OrderSummary
            marketPrice={marketPrice}
            tradeValue={tradeValue}
            commission={commission}
            goodTill={goodTill}
          />

          {formState === "success" && (
            <Alert variant="success" className="mb-3">
              {t("trade.placed")}
            </Alert>
          )}
          {formState === "error" && (
            <Alert variant="error" className="mb-3">
              {t("trade.failed")}
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              className="flex-1"
              onClick={() => {
                setQuantity("");
                setFormState("idle");
              }}
              disabled={formState === "submitting"}
            >
              {t("trade.clear")}
            </Button>
            <Button
              type="submit"
              size="md"
              className="flex-1"
              variant={side === "buy" ? "success" : "destructive"}
              disabled={formState === "submitting" || !quantity || qty <= 0}
            >
              {formState === "submitting" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("trade.placing")}
                </>
              ) : (
                `${t(side === "buy" ? "trade.buy" : "trade.sell")} ${symbol}`
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
