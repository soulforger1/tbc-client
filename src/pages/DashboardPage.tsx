import { StatsCards } from '@/components/StatsCards'
import { PortfolioChart } from '@/components/PortfolioChart'
import { Holdings } from '@/components/Holdings'
import { TradeForm } from '@/components/TradeForm'
import { TradeHistory } from '@/components/TradeHistory'

export const DashboardPage = () => (
  <div className="space-y-6">
    <StatsCards />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2"><PortfolioChart /></div>
      <div><Holdings /></div>
    </div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2"><TradeHistory /></div>
      <div><TradeForm /></div>
    </div>
  </div>
)
