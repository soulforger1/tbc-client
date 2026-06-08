import { useTranslation } from "react-i18next";
import { usePortfolio } from "@/hooks/usePortfolio";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export const Holdings = () => {
  const { t } = useTranslation();
  const { data, loading } = usePortfolio();
  const holdings = data?.holdings ?? [];

  return (
  <Card>
    <CardHeader>
      <CardTitle>{t("portfolio.holdings.title")}</CardTitle>
      <span className="text-xs text-ink4">{loading ? "…" : t("portfolio.holdings.positions", { count: holdings.length })}</span>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {holdings.map((h) => (
          <div
            key={h.symbol}
            className="flex items-center justify-between rounded-lg bg-muted px-3 py-2.5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-subtle text-xs font-bold text-ink2">
                {h.symbol.slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{h.symbol}</p>
                <p className="text-xs text-ink4">
                  {t("portfolio.holdings.sharesAvg", { qty: h.qty, price: formatCurrency(h.avgPrice) })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-ink">
                {formatCurrency(h.value)}
              </p>
              <p
                className={`text-xs font-medium ${h.pnl >= 0 ? "text-emerald-500" : "text-red-500"}`}
              >
                {h.pnl >= 0 ? "+" : ""}
                {formatCurrency(h.pnl)} ({formatPercent(h.pnlPct)})
              </p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
  );
};
