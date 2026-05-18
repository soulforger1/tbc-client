import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { stats } from "@/data/dummy";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";

export const StatsCards = () => {
  const items = [
    {
      label: "Portfolio Value",
      value: formatCurrency(stats.portfolioValue),
      change: formatPercent(stats.portfolioChangePct),
      changeAmt: `${stats.portfolioChange >= 0 ? "+" : ""}${formatCurrency(stats.portfolioChange)} today`,
      positive: stats.portfolioChangePct >= 0,
      icon: TrendingUp,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
    },
    {
      label: "Total P&L",
      value: formatCurrency(stats.totalPnl),
      change: formatPercent(stats.totalPnlPct),
      changeAmt: "all time",
      positive: stats.totalPnl >= 0,
      icon: DollarSign,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
    },
    {
      label: "Win Rate",
      value: `${stats.winRate}%`,
      change: "+2.1%",
      changeAmt: "vs last month",
      positive: true,
      icon: Target,
      iconColor: "text-violet-500",
      iconBg: "bg-violet-500/10",
    },
    {
      label: "Available Cash",
      value: formatCurrency(stats.availableCash),
      change: `${stats.filledTrades}/${stats.totalTrades}`,
      changeAmt: "trades filled",
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
