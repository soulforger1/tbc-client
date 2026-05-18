import { PortfolioChart } from '@/components/PortfolioChart'
import { Holdings } from '@/components/Holdings'
import { StatsCards } from '@/components/StatsCards'

export const PortfolioPage = () => (
  <div className="space-y-6">
    <StatsCards />
    <PortfolioChart />
    <Holdings />
  </div>
)
