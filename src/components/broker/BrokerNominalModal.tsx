import { useState } from "react";
import { Paperclip } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormGroup } from "@/components/ui/form-group";
import { formatCurrency } from "@/lib/utils";
import type { BrokerOrder, BrokerNominalPayload } from "@/lib/api";

interface BrokerNominalModalProps {
  order: BrokerOrder;
  onConfirm: (payload: BrokerNominalPayload) => Promise<void>;
  onClose: () => void;
}

export const BrokerNominalModal = ({ order, onConfirm, onClose }: BrokerNominalModalProps) => {
  const [filledPrice, setFilledPrice] = useState("");
  const [rate, setRate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    const priceNum = parseFloat(filledPrice);
    const rateNum = parseFloat(rate);
    if (!priceNum || priceNum <= 0) { setError("Execution price is required"); return; }
    if (!rateNum || rateNum <= 0)   { setError("Rate is required"); return; }
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm({ filledPrice: priceNum, rate: rateNum });
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose} maxWidth="md">
      <div className="p-6">
        <h3 className="mb-1 text-base font-semibold text-ink">File Order</h3>
        <p className="mb-5 text-xs text-ink4">
          #{order.id} · {order.customerRegno}
        </p>

        {/* Order summary — read-only */}
        <div className="mb-5 rounded-lg border border-edge bg-muted/40 p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-ink4">Symbol</span>
            <span className="font-semibold text-ink">{order.symbol}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink4">Side</span>
            <span className={`font-semibold ${order.side === "buy" ? "text-emerald-500" : "text-red-500"}`}>
              {order.side.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink4">Order Type</span>
            <span className="text-ink2 capitalize">{order.orderType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink4">Quantity</span>
            <span className="text-ink2">{order.quantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink4">Order Price</span>
            <span className="text-ink2">
              {order.price != null ? formatCurrency(order.price) : "Market"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink4">Good Till</span>
            <span className="text-ink2 uppercase">{order.goodTill}</span>
          </div>
        </div>

        {/* Broker data entry */}
        <div className="space-y-4">
          <FormGroup label="Execution Price">
            <Input
              type="number"
              min="0"
              step="0.0001"
              placeholder="Broker enters"
              value={filledPrice}
              onChange={(e) => setFilledPrice(e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Rate (Exchange Rate)">
            <Input
              type="number"
              min="0"
              step="0.0001"
              placeholder="Broker enters"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </FormGroup>

          {/* Order Files — demo only */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-ink2">Order Files</p>
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-edge bg-muted/40 px-4 py-5 text-center transition-colors hover:bg-muted/70">
              <Paperclip className="h-4 w-4 text-ink4" />
              <span className="text-xs font-medium text-ink3">GTN, EXT, HUATAI screenshots</span>
              <span className="text-[11px] text-ink4">Visible to broker only — not shown to client</span>
              <input type="file" multiple accept="image/*,.pdf" className="hidden" disabled />
            </label>
            <p className="mt-1.5 text-[11px] text-ink4 italic">File upload not available in demo</p>
          </div>
        </div>

        {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

        <div className="mt-6 flex gap-3">
          <Button onClick={onClose} variant="outline" size="md" className="flex-1" disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant="default" size="md" className="flex-1 font-semibold" disabled={submitting}>
            {submitting ? "Filing…" : "Confirm File"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
