import { useTranslation } from "react-i18next";
import type { PartialFill } from "@/data/types";
import { formatCurrency } from "@/lib/utils";
import { nativeToUSD } from "@/lib/currency";

interface PartialFillsRowProps {
  fills: PartialFill[];
  originalRequest: { quantity: number; price: number | null } | null;
  rate: number;
  colSpan: number;
}

export const PartialFillsRow = ({
  fills,
  originalRequest,
  rate,
  colSpan,
}: PartialFillsRowProps) => {
  const { t } = useTranslation();
  if (fills.length === 0) return null;

  const totalQty = fills.reduce((s, f) => s + Number(f.quantity), 0);
  const totalValue = fills.reduce(
    (s, f) => s + nativeToUSD(Number(f.price) * Number(f.quantity), rate),
    0,
  );

  return (
    <tr className="bg-muted/30">
      <td colSpan={colSpan} className="px-4 pb-3 pt-0">
        <div className="rounded-lg border border-edge/60 overflow-hidden">
          {/* Header strip */}
          <div className="flex items-center gap-4 bg-muted/60 px-3 py-1.5 text-[11px] text-ink4">
            <span className="font-medium text-ink3 uppercase tracking-wide">
              {t("orders.fillsTitle")}
            </span>
            {originalRequest && (
              <>
                <span className="text-edge">·</span>
                <span>
                  {t("orders.originalRequest")}:{" "}
                  <span className="text-ink2 font-medium">
                    {originalRequest.quantity} {t("orders.cols.qty")}
                    {originalRequest.price != null && (
                      <>
                        {" "}
                        @{" "}
                        {formatCurrency(
                          nativeToUSD(originalRequest.price, rate),
                        )}
                      </>
                    )}
                  </span>
                </span>
                <span className="text-edge">·</span>
                <span>
                  Remaining:{" "}
                  <span
                    className={`font-medium ${
                      originalRequest.quantity - totalQty > 0
                        ? "text-amber-500"
                        : "text-emerald-500"
                    }`}
                  >
                    {Math.max(0, originalRequest.quantity - totalQty)}
                  </span>
                </span>
              </>
            )}
          </div>

          {/* Fills table */}
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-edge/60 text-ink4">
                <th className="px-3 py-1.5 text-left font-normal w-8">#</th>
                <th className="px-3 py-1.5 text-right font-normal">
                  {t("orders.cols.price")}
                </th>
                <th className="px-3 py-1.5 text-right font-normal">
                  {t("orders.cols.qty")}
                </th>
                <th className="px-3 py-1.5 text-right font-normal">
                  {t("orders.cols.tradeValue")}
                </th>
                <th className="px-3 py-1.5 text-right font-normal pr-3">
                  {t("history.cols.date")}
                </th>
              </tr>
            </thead>
            <tbody>
              {fills.map((fill, i) => (
                <tr
                  key={fill.id}
                  className="border-t border-edge/40 first:border-0"
                >
                  <td className="px-3 py-1.5 text-ink4">{i + 1}</td>
                  <td className="px-3 py-1.5 text-right text-ink2">
                    {formatCurrency(nativeToUSD(Number(fill.price), rate))}
                  </td>
                  <td className="px-3 py-1.5 text-right text-ink2">
                    {fill.quantity}
                  </td>
                  <td className="px-3 py-1.5 text-right text-ink2">
                    {formatCurrency(
                      nativeToUSD(
                        Number(fill.price) * Number(fill.quantity),
                        rate,
                      ),
                    )}
                  </td>
                  <td className="px-3 py-1.5 text-right text-ink4 pr-3">
                    {new Date(fill.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-edge/60 bg-muted/40 font-semibold">
              <tr>
                <td className="px-3 py-1.5 text-ink4" colSpan={2}>
                  {t("history.cols.total")}
                </td>
                <td className="px-3 py-1.5 text-right text-ink">{totalQty}</td>
                <td className="px-3 py-1.5 text-right text-ink">
                  {formatCurrency(totalValue)}
                </td>
                <td className="pr-3" />
              </tr>
            </tfoot>
          </table>
        </div>
      </td>
    </tr>
  );
};
