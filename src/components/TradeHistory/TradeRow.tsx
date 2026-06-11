import { useTranslation } from "react-i18next";
import { TableRow, Td } from "../ui/table";
import { Badge } from "../ui/badge";
import { SideBadge } from "./SideBadge";
import { STATUS_VARIANT, formatDate } from "./utils";
import { formatCurrency } from "@/lib/utils";
import { PartialFillsRow } from "../OpenOrders/PartialFillsRow";
import type { Trade } from "@/data/types";

export const TradeRow = ({ trade }: { trade: Trade }) => {
  const { t } = useTranslation();
  const colSpan = 11;

  return (
    <>
      <TableRow>
        <Td className="text-xs font-mono text-ink4">{trade.id}</Td>
        <Td className="font-semibold text-ink">{trade.symbol}</Td>
        <Td>
          <SideBadge side={trade.side} />
        </Td>
        <Td className="text-xs capitalize text-ink3">{trade.orderType}</Td>
        <Td className="text-xs text-ink3 uppercase">{trade.goodTill}</Td>
        <Td right className="text-ink2">
          {trade.filledQty > 0 && trade.filledQty < trade.quantity
            ? `${trade.filledQty}/${trade.quantity}`
            : trade.quantity}
        </Td>
        <Td right className="text-ink2">
          {trade.filledPrice != null ? (
            formatCurrency(trade.filledPrice)
          ) : trade.price != null ? (
            formatCurrency(trade.price)
          ) : (
            <span className="text-ink4 text-xs">{t("trade.market")}</span>
          )}
        </Td>
        <Td right className="text-ink3 text-xs">
          {trade.commission != null ? formatCurrency(trade.commission) : "—"}
        </Td>
        <Td right className="font-medium text-ink">
          {formatCurrency(trade.total)}
        </Td>
        <Td>
          <Badge variant={STATUS_VARIANT[trade.status]}>{trade.status}</Badge>
        </Td>
        <Td right className="text-xs text-ink4">
          {formatDate(trade.createdAt)}
        </Td>
      </TableRow>
      <PartialFillsRow
        fills={trade.partialFills}
        originalRequest={trade.originalRequest}
        rate={trade.rate ?? 1}
        colSpan={colSpan}
      />
    </>
  );
};
