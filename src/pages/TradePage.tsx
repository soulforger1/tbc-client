import { TradeForm } from "@/components/TradeForm";
import { OpenOrders } from "@/components/OpenOrders";
import { useOpenOrders } from "@/hooks/useOpenOrders";
import type { Stock } from "@/lib/api";

interface TradePageProps {
  initialStock?: Stock | null;
  onStockConsumed?: () => void;
}

export const TradePage = ({ initialStock, onStockConsumed }: TradePageProps) => {
  const { addOrder } = useOpenOrders();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <div className="lg:col-span-5">
        <TradeForm onOrderCreated={addOrder} initialStock={initialStock} onStockConsumed={onStockConsumed} />
      </div>
      <div className="lg:col-span-4">
        <OpenOrders />
      </div>
    </div>
  );
};
