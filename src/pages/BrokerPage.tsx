import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { brokerApi, type BrokerOrder, type BrokerNominalPayload } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHead, Th, TableBody, TableRow, Td } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { StatusStepper } from "@/components/OpenOrders/StatusStepper";
import { BrokerNominalModal } from "@/components/broker/BrokerNominalModal";
import { BrokerCloseModal } from "@/components/broker/BrokerCloseModal";

export const BrokerPage = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<BrokerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nominalTarget, setNominalTarget] = useState<BrokerOrder | null>(null);
  const [closeTarget, setCloseTarget] = useState<BrokerOrder | null>(null);

  useEffect(() => {
    brokerApi
      .getOrders()
      .then(setOrders)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const updateOrder = (updated: BrokerOrder) =>
    setOrders((prev) =>
      updated.status === "closed"
        ? prev.filter((o) => o.id !== updated.id)
        : prev.map((o) => (o.id === updated.id ? updated : o))
    );

  const handleFile = async (order: BrokerOrder) => {
    setBusy(order.id);
    try {
      updateOrder(await brokerApi.fileOrder(order.id));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  };

  const handleNominal = async (order: BrokerOrder, payload: BrokerNominalPayload) => {
    const updated = await brokerApi.nominalOrder(order.id, payload);
    updateOrder(updated);
  };

  const handleClose = async (order: BrokerOrder) => {
    setBusy(order.id);
    try {
      updateOrder(await brokerApi.closeOrder(order.id));
      setCloseTarget(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Broker Panel</CardTitle>
          <span className="text-xs text-ink4">
            {loading ? "…" : `${orders.length} pending`}
          </span>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-500">
              {error}
            </div>
          )}
          {loading ? (
            <div className="flex h-40 items-center justify-center text-sm text-ink4">Loading…</div>
          ) : orders.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-ink4">No pending orders</div>
          ) : (
            <Table>
              <TableHead>
                <Th>Order</Th>
                <Th>Customer</Th>
                <Th>Symbol</Th>
                <Th>Side</Th>
                <Th>Type</Th>
                <Th>Qty</Th>
                <Th>Price</Th>
                <Th>Progress</Th>
                <Th center>Action</Th>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <Td className="text-xs text-ink3 font-mono">#{order.id}</Td>
                    <Td className="text-xs text-ink3">{order.customerRegno}</Td>
                    <Td><span className="font-semibold text-ink">{order.symbol}</span></Td>
                    <Td>
                      <Badge variant={order.side === "buy" ? "success" : "destructive"}>
                        {order.side.toUpperCase()}
                      </Badge>
                    </Td>
                    <Td className="text-xs capitalize text-ink3">{order.orderType}</Td>
                    <Td className="text-ink2">{order.quantity}</Td>
                    <Td className="text-ink2">
                      {order.price != null
                        ? formatCurrency(order.price)
                        : <span className="text-xs text-ink4">{t("trade.market")}</span>}
                    </Td>
                    <Td><StatusStepper status={order.status} /></Td>
                    <Td center>
                      {order.status === "open" && (
                        <Button size="sm" variant="warning" disabled={busy === order.id}
                          onClick={() => handleFile(order)}>
                          {busy === order.id ? "…" : "Start"}
                        </Button>
                      )}
                      {order.status === "filing" && (
                        <Button size="sm" variant="default"
                          onClick={() => setNominalTarget(order)}>
                          File
                        </Button>
                      )}
                      {order.status === "nominal" && (
                        <Button size="sm" variant="success"
                          onClick={() => setCloseTarget(order)}>
                          Review
                        </Button>
                      )}
                    </Td>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {nominalTarget && (
        <BrokerNominalModal
          order={nominalTarget}
          onConfirm={(payload) => handleNominal(nominalTarget, payload)}
          onClose={() => setNominalTarget(null)}
        />
      )}

      {closeTarget && (
        <BrokerCloseModal
          order={closeTarget}
          submitting={busy === closeTarget.id}
          onConfirm={() => handleClose(closeTarget)}
          onClose={() => setCloseTarget(null)}
        />
      )}
    </>
  );
};
