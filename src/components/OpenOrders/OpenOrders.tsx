import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { Trade } from "@/data/types";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Alert } from "../ui/alert";
import { Table, TableHead, Th, TableBody } from "../ui/table";
import { useToast } from "../Toast";
import { useOpenOrders } from "@/hooks/useOpenOrders";
import { OrderRow } from "./OrderRow";
import { AmendModal } from "./AmendModal";
import { CancelModal } from "./CancelModal";

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
              Loading…
            </div>
          ) : orders.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-ink4">
              {t("orders.noOrders")}
            </div>
          ) : (
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
          onConfirm={(qty, price) => handleAmendConfirm(amendTarget.id, qty, price)}
          onClose={() => setAmendTarget(null)}
        />
      )}
    </>
  );
};
