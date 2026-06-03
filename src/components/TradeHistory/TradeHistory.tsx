import { useTranslation } from "react-i18next";
import { useQueryState, parseAsString, parseAsStringLiteral } from "nuqs";
import { type Trade, type TradeStatus, type TradeSide } from "@/data/dummy";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Table, TableHead, Th, TableBody } from "../ui/table";
import { useOrders } from "@/hooks/useOrders";
import { TradeFilters } from "./TradeFilters";
import { TradeRow } from "./TradeRow";

const STATUSES = ["all", "open", "filled", "cancelled", "partial", "nominal", "final"] as const;
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

  console.log(trades);

  const filtered = trades.filter((trade: Trade) => {
    const matchSearch =
      trade.symbol.toLowerCase().includes(search.toLowerCase()) ||
      trade.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || trade.status === statusFilter;
    const matchSide = sideFilter === "all" || trade.side === sideFilter;
    return matchSearch && matchStatus && matchSide;
  });

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
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="py-10 text-center text-sm text-ink4"
                >
                  {t("history.noTrades")}
                </td>
              </tr>
            ) : (
              filtered.map((trade) => <TradeRow key={trade.id} trade={trade} />)
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
