import { useState } from "react";
import { useTranslation } from "react-i18next";
import { trades as initialTrades, type Trade } from "@/data/dummy";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Alert } from "../ui/alert";
import { Table, TableHead, Th, TableBody } from "../ui/table";
import { useToast } from "../Toast";
import { OrderRow } from "./OrderRow";
import { AmendModal } from "./AmendModal";
import { isOpenOrder } from "./utils";

export const OpenOrders = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Trade[]>(initialTrades);
  const [amendTarget, setAmendTarget] = useState<Trade | null>(null);

  const openOrders = orders.filter(isOpenOrder);

  const handleCancel = (id: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: "cancelled" as const } : order,
      ),
    );
    toast(t("orders.cancelled"), "error");
  };

  const handleAmendConfirm = (id: string, qty: number, price: number) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? { ...order, quantity: qty, price, total: qty * price, updatedAt: new Date().toISOString() }
          : order,
      ),
    );
    setAmendTarget(null);
    toast(t("orders.amended"), "info");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("orders.title")}</CardTitle>
          <span className="text-xs text-ink4">
            {openOrders.length} {t("orders.active")}
          </span>
        </CardHeader>
        <CardContent>
          {openOrders.length === 0 ? (
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
                {openOrders.map((trade) => (
                  <OrderRow
                    key={trade.id}
                    trade={trade}
                    onCancel={handleCancel}
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
