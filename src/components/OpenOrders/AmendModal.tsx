import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FormGroup } from "../ui/form-group";
import type { Trade } from "@/data/types";

interface AmendModalProps {
  trade: Trade;
  onConfirm: (qty: number, price: number) => void;
  onClose: () => void;
}

export const AmendModal = ({ trade, onConfirm, onClose }: AmendModalProps) => {
  const { t } = useTranslation();
  const [qty, setQty] = useState(String(trade.quantity));
  const [price, setPrice] = useState(
    trade.price != null ? String(trade.price) : "",
  );

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h3 className="mb-1 text-base font-semibold text-ink">
          {t("orders.amendTitle")}
        </h3>
        <p className="mb-5 text-xs text-ink4">
          {trade.id} · {trade.symbol} · {trade.side.toUpperCase()}
        </p>
        <div className="space-y-4">
          <FormGroup label={t("trade.quantity")}>
            <Input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </FormGroup>
          {trade.orderType === "limit" && (
            <FormGroup label={t("trade.price")}>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </FormGroup>
          )}
        </div>
        <div className="mt-6 flex gap-3">
          <Button onClick={onClose} variant="outline" size="md" className="flex-1">
            {t("orders.cancel")}
          </Button>
          <Button
            onClick={() =>
              onConfirm(parseFloat(qty), parseFloat(price) || (trade.price ?? 0))
            }
            variant="warning"
            size="md"
            className="flex-1 font-semibold"
          >
            {t("orders.confirmAmend")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
