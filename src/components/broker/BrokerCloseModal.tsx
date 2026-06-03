import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { BrokerOrder } from "@/lib/api";

interface BrokerCloseModalProps {
  order: BrokerOrder;
  onConfirm: () => Promise<void>;
  onClose: () => void;
  submitting: boolean;
}

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between py-1.5 text-sm border-b border-edge last:border-0">
    <span className="text-ink4">{label}</span>
    <span className="font-medium text-ink">{value}</span>
  </div>
);

export const BrokerCloseModal = ({ order, onConfirm, onClose, submitting }: BrokerCloseModalProps) => (
  <Modal onClose={onClose} maxWidth="md">
    <div className="p-6">
      <h3 className="mb-1 text-base font-semibold text-ink">Review Order</h3>
      <p className="mb-5 text-xs text-ink4">#{order.id} · {order.customerRegno}</p>

      <div className="rounded-lg border border-edge bg-muted/40 px-4 py-2 mb-6">
        <Row label="Symbol" value={order.symbol} />
        <Row
          label="Side"
          value={
            <span className={order.side === "buy" ? "text-emerald-500" : "text-red-500"}>
              {order.side.toUpperCase()}
            </span>
          }
        />
        <Row label="Order Type" value={<span className="capitalize">{order.orderType}</span>} />
        <Row label="Quantity" value={order.quantity} />
        <Row
          label="Order Price"
          value={order.price != null ? formatCurrency(order.price) : "Market"}
        />
        <Row
          label="Execution Price"
          value={order.filledPrice != null ? formatCurrency(order.filledPrice) : "—"}
        />
        <Row
          label="Rate"
          value={order.rate != null ? order.rate : "—"}
        />
        <Row
          label="Trade Value"
          value={order.tradeValue != null ? formatCurrency(order.tradeValue) : "—"}
        />
        <Row label="Good Till" value={<span className="uppercase">{order.goodTill}</span>} />
      </div>

      <div className="flex gap-3">
        <Button onClick={onClose} variant="outline" size="md" className="flex-1" disabled={submitting}>
          Back
        </Button>
        <Button onClick={onConfirm} variant="success" size="md" className="flex-1 font-semibold" disabled={submitting}>
          {submitting ? "Closing…" : "Confirm Close"}
        </Button>
      </div>
    </div>
  </Modal>
);
