/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { api } from "@/lib/api";
import type { Trade } from "@/data/types";
import { SideSwitcher } from "../SideSwitcher";
import { StepIndicator } from "../StepIndicator";
import { TradeFormDefaultValues, type TradeFormType } from "./utils";
import { TradeFormStep1 } from "./Step1";
import { TradeFormStep2 } from "./Step2";
import { TradeFormStep3 } from "./Step3";

type Step = 1 | 2 | 3;

interface TradeFormProps {
  onOrderCreated?: (order: Trade) => void;
}

export const TradeForm = ({ onOrderCreated }: TradeFormProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<TradeFormType>(
    TradeFormDefaultValues,
  );
  const { side, stock, quantity, limitPrice, orderType } = formData;
  const feeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    api
      .getPortfolio()
      .then((p) =>
        setFormData((prev) => ({ ...prev, buyingPower: p.stats.buyingPower })),
      )
      .catch(() => {});
  }, []);

  const marketPrice = stock?.price ?? 0;
  const qty = parseFloat(quantity) || 0;
  const limitPriceNum = parseFloat(limitPrice) || 0;
  const effectivePrice =
    orderType === "limit" && limitPriceNum > 0 ? limitPriceNum : marketPrice;

  useEffect(() => {
    if (!stock || qty <= 0 || effectivePrice <= 0) {
      setFormData((prev) => ({ ...prev, feeResult: null }));

      return;
    }
    if (feeTimerRef.current) clearTimeout(feeTimerRef.current);
    feeTimerRef.current = setTimeout(() => {
      setFormData((prev) => ({ ...prev, fetchingFee: null }));
      api
        .getFee({ size: qty, price: effectivePrice, ccy: stock.ccy })
        .then((result) =>
          setFormData((prev) => ({ ...prev, feeResult: result })),
        )
        .catch(() => setFormData((prev) => ({ ...prev, feeResult: null })))
        .finally(() =>
          setFormData((prev) => ({ ...prev, fetchingFee: false })),
        );
    }, 400);
    return () => {
      if (feeTimerRef.current) clearTimeout(feeTimerRef.current);
    };
  }, [stock, qty, effectivePrice]);

  useEffect(() => {
    if (formData.formState !== "success") return;
    setFormData(TradeFormDefaultValues);
    setStep(1);
  }, [formData.formState]);

  const handleSideChange = (newSide: "buy" | "sell") =>
    setFormData((prev) => ({
      ...prev,
      side: newSide,
      symbol: "",
      stock: null as any,
      holdingQty: null,
      quantity: "",
      feeResult: null,
    }));

  const stepLabels = [
    t("trade.step1Label"),
    t("trade.step2Label"),
    t("trade.step3Label"),
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t("trade.section")}</CardTitle>
      </CardHeader>
      <CardContent>
        <SideSwitcher side={side} onChange={handleSideChange} />
        <StepIndicator current={step} total={3} labels={stepLabels} />

        {step === 1 && (
          <TradeFormStep1
            formData={formData}
            setFormData={setFormData}
            setStep={setStep}
          />
        )}

        {step === 2 && (
          <TradeFormStep2
            formData={formData}
            setFormData={setFormData}
            setStep={setStep}
          />
        )}

        {step === 3 && (
          <TradeFormStep3
            formData={formData}
            setFormData={setFormData}
            setStep={setStep}
            onOrderCreated={onOrderCreated}
          />
        )}
      </CardContent>
    </Card>
  );
};
