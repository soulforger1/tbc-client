import { useTranslation } from "react-i18next";
import { PenLine, X } from "lucide-react";
import { canCancel, type Trade } from "@/data/dummy";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { TableRow, Td } from "../ui/table";
import { goodTillLabel } from "./utils";

interface OrderRowProps {
  trade: Trade;
  onCancel: (id: string) => void;
  onAmend: (trade: Trade) => void;
}

export const OrderRow = ({ trade, onCancel, onAmend }: OrderRowProps) => {
  const { t } = useTranslation();
  const locked = !canCancel(trade.status);
  const tradeVal = trade.price != null ? trade.quantity * trade.price : null;

  return (
    <TableRow>
      <Td>
        <span className="font-semibold text-ink">{trade.symbol}</span>
        <span
          className={`ml-2 text-xs font-semibold ${trade.side === "buy" ? "text-emerald-500" : "text-red-500"}`}
        >
          {trade.side.toUpperCase()}
        </span>
        <p className="text-xs text-ink4 capitalize">{trade.orderType}</p>
      </Td>
      <Td className="text-xs capitalize text-ink3">{trade.orderType}</Td>
      <Td className="text-ink2">
        {trade.price != null ? (
          formatCurrency(trade.price)
        ) : (
          <span className="text-ink4 text-xs">{t("trade.market")}</span>
        )}
      </Td>
      <Td className="text-ink2">{trade.quantity}</Td>
      <Td className="text-ink2">
        {tradeVal != null ? (
          formatCurrency(tradeVal)
        ) : (
          <span className="text-ink4 text-xs">{t("trade.automatically")}</span>
        )}
      </Td>
      <Td className="text-xs text-ink3">{goodTillLabel(trade.goodTill)}</Td>
      <Td>
        <Badge variant={trade.status === "partial" ? "warning" : "outline"}>
          {trade.status}
        </Badge>
      </Td>
      <Td center>
        <Button
          onClick={() => onCancel(trade.id)}
          disabled={locked}
          variant="destructive"
          size="sm"
          title={locked ? t("orders.cancelLocked") : t("orders.cancel")}
        >
          <X className="h-3 w-3" />
          {t("orders.cancel")}
        </Button>
      </Td>
      <Td center>
        <Button
          onClick={() => onAmend(trade)}
          disabled={locked}
          variant="warning"
          size="sm"
          title={locked ? t("orders.amendLocked") : t("orders.amend")}
        >
          <PenLine className="h-3 w-3" />
          {t("orders.amend")}
        </Button>
      </Td>
    </TableRow>
  );
};
