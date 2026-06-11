import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import type { Trade, PartialFill } from "@/data/types";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { nativeToUSD } from "@/lib/currency";

interface PartialFillsModalProps {
  trade: Trade;
  onClose: () => void;
}

export const PartialFillsModal = ({
  trade,
  onClose,
}: PartialFillsModalProps) => {
  const { t } = useTranslation();
  const [fills, setFills] = useState<PartialFill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getPartialFills(trade.id)
      .then(setFills)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [trade.id]);

  const rate = trade.rate ?? 1;
  const original = trade.originalRequest;
  const totalQty = fills.reduce((s, f) => s + f.quantity, 0);
  const totalValue = fills.reduce(
    (s, f) => s + nativeToUSD(f.price * f.quantity, rate),
    0,
  );

  return (
    <Modal onClose={onClose} maxWidth="md">
      <div className="p-6">
        <h3 className="mb-1 text-base font-semibold text-ink">
          {t("orders.fillsTitle")}
        </h3>
        <p className="mb-5 text-xs text-ink4">
          {trade.id} · {trade.symbol} · {trade.side.toUpperCase()}
        </p>

        {original && (
          <div className="mb-4 rounded-lg border border-edge bg-muted/50 px-4 py-3">
            <p className="mb-1 text-[11px] text-ink4 uppercase tracking-wide">
              {t("orders.originalRequest")}
            </p>
            <p className="text-sm font-medium text-ink">
              {original.quantity} {t("orders.cols.qty")}
              {original.price != null && (
                <span className="text-ink3">
                  {" "}
                  @ {formatCurrency(nativeToUSD(original.price, rate))}
                </span>
              )}
            </p>
          </div>
        )}

        {loading ? (
          <p className="py-8 text-center text-sm text-ink4">
            {t("common.loading")}
          </p>
        ) : fills.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink4">
            {t("orders.noFills")}
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-edge">
            <table className="w-full text-sm">
              <thead className="bg-muted/60">
                <tr>
                  <th className="px-3 py-2 text-left text-[11px] text-ink4">
                    #
                  </th>
                  <th className="px-3 py-2 text-right text-[11px] text-ink4">
                    {t("orders.cols.price")}
                  </th>
                  <th className="px-3 py-2 text-right text-[11px] text-ink4">
                    {t("orders.cols.qty")}
                  </th>
                  <th className="px-3 py-2 text-right text-[11px] text-ink4">
                    {t("orders.cols.tradeValue")}
                  </th>
                  <th className="px-3 py-2 text-right text-[11px] text-ink4">
                    {t("history.cols.date")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {fills.map((fill, i) => (
                  <tr key={fill.id} className="border-t border-edge">
                    <td className="px-3 py-2 text-ink4">{i + 1}</td>
                    <td className="px-3 py-2 text-right text-ink2">
                      {formatCurrency(nativeToUSD(fill.price, rate))}
                    </td>
                    <td className="px-3 py-2 text-right text-ink2">
                      {fill.quantity}
                    </td>
                    <td className="px-3 py-2 text-right text-ink2">
                      {formatCurrency(
                        nativeToUSD(fill.price * fill.quantity, rate),
                      )}
                    </td>
                    <td className="px-3 py-2 text-right text-xs text-ink4">
                      {new Date(fill.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-edge bg-muted/40 text-xs font-semibold">
                <tr>
                  <td className="px-3 py-2 text-ink4" colSpan={2}>
                    {t("history.cols.total")}
                  </td>
                  <td className="px-3 py-2 text-right text-ink">{totalQty}</td>
                  <td className="px-3 py-2 text-right text-ink">
                    {formatCurrency(totalValue)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <div className="mt-5">
          <Button
            onClick={onClose}
            variant="outline"
            size="md"
            className="w-full"
          >
            {t("common.close")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
