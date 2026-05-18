import { useState } from "react";
import { useTranslation } from "react-i18next";
import { trades, type Trade, type TradeStatus, type TradeSide } from "@/data/dummy";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Table, TableHead, Th, TableBody } from "../ui/table";
import { TradeFilters } from "./TradeFilters";
import { TradeRow } from "./TradeRow";

export const TradeHistory = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TradeStatus | "all">("all");
  const [sideFilter, setSideFilter] = useState<TradeSide | "all">("all");

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
          {filtered.length} {t("history.records")}
        </span>
      </CardHeader>
      <CardContent>
        <TradeFilters
          search={search}
          statusFilter={statusFilter}
          sideFilter={sideFilter}
          onSearch={setSearch}
          onStatusChange={setStatusFilter}
          onSideChange={setSideFilter}
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
                <td colSpan={11} className="py-10 text-center text-sm text-ink4">
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
