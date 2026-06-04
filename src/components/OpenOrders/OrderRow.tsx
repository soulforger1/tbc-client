import { useTranslation } from "react-i18next";
import { Lock, PenLine, X } from "lucide-react";
import type { Trade } from "@/data/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "../ui/button";
import { TableRow, Td } from "../ui/table";
import { goodTillLabel } from "./utils";
import { StatusStepper } from "./StatusStepper";

interface OrderRowProps {
  trade: Trade;
  onCancel: (trade: Trade) => void;
  onAmend: (trade: Trade) => void;
}

export const OrderRow = ({ trade, onCancel, onAmend }: OrderRowProps) => {
  const { t } = useTranslation();
  const locked = trade.locked;
  const isMarket = trade.orderType === "market";

  const displayPrice = isMarket ? trade.filledPrice : trade.price;
  const displayTradeVal = isMarket
    ? trade.tradeValue
    : trade.price != null ? trade.quantity * trade.price : null;

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
        {displayPrice != null ? (
          formatCurrency(displayPrice)
        ) : (
          <span className="text-ink4 text-xs">—</span>
        )}
      </Td>
      <Td className="text-ink2">{trade.quantity}</Td>
      <Td className="text-ink2">
        {displayTradeVal != null ? (
          formatCurrency(displayTradeVal)
        ) : (
          <span className="text-ink4 text-xs">—</span>
        )}
      </Td>
      <Td className="text-xs text-ink3">{goodTillLabel(trade.goodTill)}</Td>
      <Td>
        <StatusStepper step={trade.step} status={trade.status} />
      </Td>
      {locked ? (
        <Td center colSpan={2}>
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-semibold text-red-500">
            <Lock className="h-3 w-3" />
            {t("orders.locked")}
          </span>
        </Td>
      ) : (
        <>
          <Td center>
            <Button onClick={() => onCancel(trade)} variant="destructive" size="sm">
              <X className="h-3 w-3" />
              {t("orders.cancel")}
            </Button>
          </Td>
          <Td center>
            {!isMarket && (
              <Button onClick={() => onAmend(trade)} variant="warning" size="sm">
                <PenLine className="h-3 w-3" />
                {t("orders.amend")}
              </Button>
            )}
          </Td>
        </>
      )}
    </TableRow>
  );
};
