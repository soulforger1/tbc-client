import { TradeForm } from '@/components/TradeForm'
import { OpenOrders } from '@/components/OpenOrders'

export const TradePage = () => (
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
    <div className="lg:col-span-2"><TradeForm /></div>
    <div className="lg:col-span-3"><OpenOrders /></div>
  </div>
)
