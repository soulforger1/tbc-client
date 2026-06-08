import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQueryState, parseAsString, parseAsStringLiteral } from "nuqs";
import { type Trade, type TradeStatus, type TradeSide } from "@/data/types";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Table, TableHead, Th, TableBody } from "../ui/table";
import { useOrders } from "@/hooks/useOrders";
import { TradeFilters } from "./TradeFilters";
import { TradeRow } from "./TradeRow";
import { SideBadge } from "./SideBadge";
import { STATUS_VARIANT, formatDate } from "./utils";
import { formatCurrency } from "@/lib/utils";

const STATUSES = ["all", "open", "closed", "filled", "cancelled", "partial", "final"] as const;
const SIDES = ["all", "buy", "sell"] as const;

export const TradeHistory = () => {
  const { t } = useTranslation();
  const { trades, loading } = useOrders();
  const [search, setSearch] = useQueryState("q", parseAsString.withDefault(""));
  const [statusFilter, setStatusFilter] = useQueryState(
    "status",
    parseAsStringLiteral(STATUSES).withDefault("all"),
  );
  const [sideFilter, setSideFilter] = useQueryState(
    "side",
    parseAsStringLiteral(SIDES).withDefault("all"),
  );

  const q = search.toLowerCase();
  const filtered = useMemo(
    () =>
      trades.filter((trade: Trade) => {
        const matchSearch =
          !q ||
          (trade.symbol ?? "").toLowerCase().includes(q) ||
          (trade.id ?? "").toLowerCase().includes(q);
        const matchStatus = statusFilter === "all" || (trade.status ?? "") === statusFilter;
        const matchSide = sideFilter === "all" || trade.side === sideFilter;
        return matchSearch && matchStatus && matchSide;
      }),
    [trades, q, statusFilter, sideFilter],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("history.title")}</CardTitle>
        <span className="text-xs text-ink4">
          {loading ? "…" : `${filtered.length} ${t("history.records")}`}
        </span>
      </CardHeader>
      <CardContent>
        <TradeFilters
          search={search}
          statusFilter={statusFilter as TradeStatus | "all"}
          sideFilter={sideFilter as TradeSide | "all"}
          onSearch={(v) => { void setSearch(v || null); }}
          onStatusChange={(v) => { void setStatusFilter(v === "all" ? null : v); }}
          onSideChange={(v) => { void setSideFilter(v === "all" ? null : v); }}
        />

        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-ink4">{t("history.noTrades")}</p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <Table>
                <TableHead>
                  <Th>{t("history.cols.id")}</Th>
                  <Th>{t("history.cols.symbol")}</Th>
                  <Th>{t("history.cols.side")}</Th>
                  <Th>{t("history.cols.type")}</Th>
                  <Th>{t("history.cols.goodTill")}</Th>
                  <Th right>{t("history.cols.qty")}</Th>
                  <Th right>{t("history.cols.price")}</Th>
                  <Th right>{t("history.cols.commission")}</Th>
                  <Th right>{t("history.cols.total")}</Th>
                  <Th>{t("history.cols.status")}</Th>
                  <Th right>{t("history.cols.date")}</Th>
                </TableHead>
                <TableBody>
                  {filtered.map((trade) => <TradeRow key={trade.id} trade={trade} />)}
                </TableBody>
              </Table>
            </div>

            {/* Mobile card list */}
            <div className="space-y-3 md:hidden">
              {filtered.map((trade) => (
                <TradeCard key={trade.id} trade={trade} />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const TradeCard = ({ trade }: { trade: Trade }) => {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl border border-edge bg-muted/40 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-ink">{trade.symbol}</span>
          <SideBadge side={trade.side} />
          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-ink3 capitalize border border-edge">
            {trade.orderType}
          </span>
        </div>
        <Badge variant={STATUS_VARIANT[trade.status]}>{trade.status}</Badge>
      </div>

      {/* Values */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <p className="text-ink4">{t("history.cols.qty")}</p>
          <p className="mt-0.5 font-medium text-ink">
            {trade.filledQty > 0 && trade.filledQty < trade.quantity
              ? `${trade.filledQty}/${trade.quantity}`
              : trade.quantity}
          </p>
        </div>
        <div>
          <p className="text-ink4">{t("history.cols.price")}</p>
          <p className="mt-0.5 font-medium text-ink">
            {trade.filledPrice != null
              ? formatCurrency(trade.filledPrice)
              : trade.price != null
                ? formatCurrency(trade.price)
                : <span className="text-ink4">{t("trade.market")}</span>}
          </p>
        </div>
        <div>
          <p className="text-ink4">{t("history.cols.total")}</p>
          <p className="mt-0.5 font-medium text-ink">{formatCurrency(trade.total)}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-ink4">
        <span className="font-mono">{trade.id}</span>
        <span>{formatDate(trade.createdAt)}</span>
      </div>
    </div>
  );
};
