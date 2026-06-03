import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";

export const StatsCards = () => {
  const { data, loading } = usePortfolio();
  const stats = data?.stats;

  const portfolioValue = stats?.portfolioValue ?? 0;
  const totalPnl = stats?.totalPnl ?? 0;
  const availableCash = stats?.availableCash ?? 0;
  const totalPnlPct =
    portfolioValue - totalPnl > 0
      ? (totalPnl / (portfolioValue - totalPnl)) * 100
      : 0;

  const items = [
    {
      label: "Portfolio Value",
      value: loading ? "—" : formatCurrency(portfolioValue),
      change: "—",
      changeAmt: "total value",
      positive: true,
      icon: TrendingUp,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
    },
    {
      label: "Total P&L",
      value: loading ? "—" : formatCurrency(totalPnl),
      change: loading ? "—" : formatPercent(totalPnlPct),
      changeAmt: "all time",
      positive: totalPnl >= 0,
      icon: DollarSign,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
    },
    {
      label: "Stock Value",
      value: loading ? "—" : formatCurrency(stats?.stockValueUSD ?? 0),
      change: "—",
      changeAmt: "USD",
      positive: true,
      icon: Target,
      iconColor: "text-violet-500",
      iconBg: "bg-violet-500/10",
    },
    {
      label: "Available Cash",
      value: loading ? "—" : formatCurrency(availableCash),
      change: "—",
      changeAmt: "buying power",
      positive: true,
      icon: Wallet,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent>
            <div className="flex items-start justify-between">
              <div className={`rounded-lg p-2 ${item.iconBg}`}>
                <item.icon className={`h-4 w-4 ${item.iconColor}`} />
              </div>
              <span
                className={`flex items-center gap-0.5 text-xs font-medium ${item.positive ? "text-emerald-500" : "text-red-500"}`}
              >
                {item.positive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {item.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-ink">{item.value}</p>
              <p className="mt-1 text-xs text-ink3">{item.label}</p>
              <p className="mt-0.5 text-xs text-ink4">{item.changeAmt}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
