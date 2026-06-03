import { TradeForm } from "@/components/TradeForm";
import { OpenOrders } from "@/components/OpenOrders";
import { useOpenOrders } from "@/hooks/useOpenOrders";

export const TradePage = () => {
  const { addOrder } = useOpenOrders();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <div className="lg:col-span-5">
        <TradeForm onOrderCreated={addOrder} />
      </div>
      <div className="lg:col-span-4">
        <OpenOrders />
      </div>
    </div>
  );
};
