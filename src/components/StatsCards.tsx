import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePortfolio } from "@/hooks/usePortfolio";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";

export const StatsCards = () => {
  const { t } = useTranslation();
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
      label: t("portfolio.stats.portfolioValue"),
      value: loading ? "—" : formatCurrency(portfolioValue),
      change: "—",
      changeAmt: t("portfolio.stats.totalValue"),
      positive: true,
      icon: TrendingUp,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
    },
    {
      label: t("portfolio.stats.totalPnl"),
      value: loading ? "—" : formatCurrency(totalPnl),
      change: loading ? "—" : formatPercent(totalPnlPct),
      changeAmt: t("portfolio.stats.allTime"),
      positive: totalPnl >= 0,
      icon: DollarSign,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
    },
    {
      label: t("portfolio.stats.stockValue"),
      value: loading ? "—" : formatCurrency(stats?.stockValueUSD ?? 0),
      change: "—",
      changeAmt: t("portfolio.stats.usd"),
      positive: true,
      icon: Target,
      iconColor: "text-violet-500",
      iconBg: "bg-violet-500/10",
    },
    {
      label: t("portfolio.stats.availableCash"),
      value: loading ? "—" : formatCurrency(availableCash),
      change: "—",
      changeAmt: t("portfolio.stats.buyingPower"),
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
