import { useTranslation } from "react-i18next";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import type { Trade } from "@/data/types";

interface CancelModalProps {
  trade: Trade;
  onConfirm: () => void;
  onClose: () => void;
}

export const CancelModal = ({ trade, onConfirm, onClose }: CancelModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h3 className="mb-1 text-base font-semibold text-ink">
          {t("orders.cancelTitle")}
        </h3>
        <p className="mb-5 text-xs text-ink4">
          {trade.id} · {trade.symbol} · {trade.side.toUpperCase()}
        </p>
        <p className="mb-6 text-sm text-ink2">
          {t("orders.cancelConfirmText")}
        </p>
        <div className="flex gap-3">
          <Button onClick={onClose} variant="outline" size="md" className="flex-1">
            {t("orders.cancelNo")}
          </Button>
          <Button onClick={onConfirm} variant="destructive" size="md" className="flex-1 font-semibold">
            {t("orders.cancelYes")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
