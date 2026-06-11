import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Lock, PenLine, X } from "lucide-react";
import type { Trade } from "@/data/types";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Alert } from "../ui/alert";
import { Table, TableHead, Th, TableBody } from "../ui/table";
import { Button } from "../ui/button";
import { useToast } from "../Toast";
import { useOpenOrders } from "@/hooks/useOpenOrders";
import { OrderRow } from "./OrderRow";
import { AmendModal } from "./AmendModal";
import { CancelModal } from "./CancelModal";
import { StatusStepper } from "./StatusStepper";
import { goodTillLabel } from "./utils";
import { formatCurrency } from "@/lib/utils";
import { nativeToUSD, calcTradeValueUSD } from "@/lib/currency";

export const OpenOrders = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { orders, loading, cancel, amend } = useOpenOrders();
  const [cancelTarget, setCancelTarget] = useState<Trade | null>(null);
  const [amendTarget, setAmendTarget] = useState<Trade | null>(null);

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    try {
      await cancel(cancelTarget.id);
      toast(t("orders.cancelled"), "error");
    } catch {
      toast(t("trade.failed"), "error");
    } finally {
      setCancelTarget(null);
    }
  };

  const handleAmendConfirm = async (id: string, qty: number, price: number) => {
    try {
      await amend(id, qty, price);
      setAmendTarget(null);
      toast(t("orders.amended"), "info");
    } catch {
      toast(t("trade.failed"), "error");
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("orders.title")}</CardTitle>
          <span className="text-xs text-ink4">
            {loading ? "…" : `${orders.length} ${t("orders.active")}`}
          </span>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-40 items-center justify-center text-sm text-ink4">
              {t("common.loading")}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-ink4">
              {t("orders.noOrders")}
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block">
                <Table>
                  <TableHead>
                    <Th>{t("orders.cols.symbol")}</Th>
                    <Th>{t("orders.cols.orderType")}</Th>
                    <Th>{t("orders.cols.price")}</Th>
                    <Th>{t("orders.cols.qty")}</Th>
                    <Th>{t("orders.cols.tradeValue")}</Th>
                    <Th>{t("orders.cols.goodTill")}</Th>
                    <Th>{t("orders.cols.status")}</Th>
                    <Th center />
                    <Th center />
                  </TableHead>
                  <TableBody>
                    {orders.map((trade) => (
                      <OrderRow
                        key={trade.id}
                        trade={trade}
                        onCancel={setCancelTarget}
                        onAmend={setAmendTarget}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile card list */}
              <div className="space-y-3 md:hidden">
                {orders.map((trade) => (
                  <OrderCard
                    key={trade.id}
                    trade={trade}
                    onCancel={setCancelTarget}
                    onAmend={setAmendTarget}
                  />
                ))}
              </div>
            </>
          )}
          <Alert variant="muted" className="mt-4">
            {t("orders.rule")}
          </Alert>
        </CardContent>
      </Card>

      {cancelTarget && (
        <CancelModal
          trade={cancelTarget}
          onConfirm={handleCancelConfirm}
          onClose={() => setCancelTarget(null)}
        />
      )}

      {amendTarget && (
        <AmendModal
          trade={amendTarget}
          onConfirm={(qty, price) =>
            handleAmendConfirm(amendTarget.id, qty, price)
          }
          onClose={() => setAmendTarget(null)}
        />
      )}
    </>
  );
};

interface OrderCardProps {
  trade: Trade;
  onCancel: (trade: Trade) => void;
  onAmend: (trade: Trade) => void;
}

const OrderCard = ({ trade, onCancel, onAmend }: OrderCardProps) => {
  const { t } = useTranslation();
  const isMarket = trade.orderType === "market";
  const rate = trade.rate ?? 1;
  const rawPrice = isMarket ? trade.filledPrice : trade.price;
  const displayPrice = rawPrice != null ? nativeToUSD(rawPrice, rate) : null;
  const displayTradeVal = isMarket
    ? (trade.tradeValueUSD ??
      (trade.tradeValue != null ? nativeToUSD(trade.tradeValue, rate) : null))
    : trade.price != null
      ? calcTradeValueUSD(trade.quantity, trade.price, rate)
      : null;

  return (
    <div className="rounded-xl border border-edge bg-muted/40 p-3 space-y-3">
      {/* Symbol + side */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-semibold text-ink">{trade.symbol}</span>
        <span
          className={`text-xs font-bold ${trade.side === "buy" ? "text-emerald-500" : "text-red-500"}`}
        >
          {trade.side.toUpperCase()}
        </span>
        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-ink3 capitalize border border-edge">
          {trade.orderType}
        </span>
        <span className="text-xs text-ink4">
          {goodTillLabel(trade.goodTill)}
        </span>
      </div>

      {/* Status stepper */}
      <StatusStepper step={trade.step} status={trade.status} />

      {/* Values row */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <p className="text-ink4">{t("orders.cols.price")}</p>
          <p className="mt-0.5 font-medium text-ink">
            {displayPrice != null ? (
              formatCurrency(displayPrice)
            ) : (
              <span className="text-ink4">—</span>
            )}
          </p>
        </div>
        <div>
          <p className="text-ink4">{t("orders.cols.qty")}</p>
          <p className="mt-0.5 font-medium text-ink">{trade.quantity}</p>
        </div>
        <div>
          <p className="text-ink4">{t("orders.cols.tradeValue")}</p>
          <p className="mt-0.5 font-medium text-ink">
            {displayTradeVal != null ? (
              formatCurrency(displayTradeVal)
            ) : (
              <span className="text-ink4">—</span>
            )}
          </p>
        </div>
      </div>

      {/* Partial fills inline (mobile) */}
      {trade.partialFills.length > 0 && (
        <div className="rounded-lg border border-edge/60 overflow-hidden text-xs">
          <div className="bg-muted/60 px-3 py-1.5 text-[11px] font-medium text-ink3 uppercase tracking-wide">
            {t("orders.fillsTitle")}
            {trade.originalRequest && (
              <span className="ml-2 font-normal text-ink4 normal-case tracking-normal">
                — {t("orders.originalRequest")}:{" "}
                {trade.originalRequest.quantity} {t("orders.cols.qty")}
                {trade.originalRequest.price != null &&
                  ` @ ${formatCurrency(nativeToUSD(trade.originalRequest.price, rate))}`}
              </span>
            )}
          </div>
          <div className="divide-y divide-edge/40">
            {trade.partialFills.map((fill, i) => (
              <div
                key={fill.id}
                className="flex items-center justify-between px-3 py-1.5"
              >
                <span className="text-ink4">#{i + 1}</span>
                <span className="text-ink2">
                  {formatCurrency(nativeToUSD(Number(fill.price), rate))}
                </span>
                <span className="text-ink2">
                  {fill.quantity} {t("orders.cols.qty")}
                </span>
                <span className="text-ink4">
                  {new Date(fill.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {trade.locked ? (
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-500">
            <Lock className="h-3 w-3" />
            {t("orders.locked")}
          </span>
          <p className="text-[11px] text-ink4">
            {t("orders.brokerContact")}{" "}
            <a
              href={`tel:${import.meta.env.VITE_SUPPORT_PHONE}`}
              className="font-medium text-ink2 underline"
            >
              {import.meta.env.VITE_SUPPORT_PHONE}
            </a>
          </p>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            onClick={() => onCancel(trade)}
            variant="destructive"
            size="sm"
            className="flex-1"
          >
            <X className="h-3 w-3" />
            {t("orders.cancel")}
          </Button>
          {!isMarket && (
            <Button
              onClick={() => onAmend(trade)}
              variant="warning"
              size="sm"
              className="flex-1"
            >
              <PenLine className="h-3 w-3" />
              {t("orders.amend")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
