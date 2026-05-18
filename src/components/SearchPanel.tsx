import { useRef, useState } from "react";
import { Search, TrendingDown, TrendingUp, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Modal } from "./ui/modal";
import { trades } from "@/data/dummy";
import { formatCurrency } from "@/lib/utils";

export const SearchPanel = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const results = q
    ? trades.filter(
        (tr) =>
          tr.symbol.toLowerCase().includes(q) ||
          tr.id.toLowerCase().includes(q) ||
          tr.status.toLowerCase().includes(q),
      )
    : [];

  return (
    <Modal align="top" maxWidth="lg" onClose={onClose}>
      {/* Input */}
      <div className="flex items-center gap-3 border-b border-edge px-4 py-3">
        <Search className="h-4 w-4 flex-shrink-0 text-ink4" />
        <input
          ref={inputRef}
          autoFocus
          type="text"
          placeholder={t("common.searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink4 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-ink4 hover:text-ink3 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <kbd className="rounded border border-edge px-1.5 py-0.5 text-xs text-ink4">
          Esc
        </kbd>
      </div>

      {/* Results */}
      <div className="max-h-80 overflow-y-auto">
        {!q && (
          <p className="px-4 py-8 text-center text-sm text-ink4">
            {t("common.typeToSearch")}
          </p>
        )}
        {q && results.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-ink4">
            {t("common.noResults", { query })}
          </p>
        )}
        {results.map((tr) => (
          <div
            key={tr.id}
            className="flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors cursor-pointer border-b border-edge/50 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-md ${tr.side === "buy" ? "bg-emerald-500/15" : "bg-red-500/15"}`}
              >
                {tr.side === "buy" ? (
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">
                  {tr.symbol}
                  <span className="ml-2 text-xs font-normal text-ink4">
                    {tr.id}
                  </span>
                </p>
                <p className="text-xs text-ink4 capitalize">
                  {tr.orderType} · {tr.goodTill.toUpperCase()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-ink">
                {formatCurrency(tr.total)}
              </p>
              <span
                className={`text-xs font-medium capitalize ${
                  tr.status === "filled" || tr.status === "final"
                    ? "text-emerald-500"
                    : tr.status === "cancelled"
                      ? "text-ink4"
                      : tr.status === "open"
                        ? "text-blue-500"
                        : "text-amber-500"
                }`}
              >
                {tr.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {q && results.length > 0 && (
        <div className="border-t border-edge px-4 py-2">
          <p className="text-xs text-ink4">
            {t("common.nResults", { count: results.length })}
          </p>
        </div>
      )}
    </Modal>
  );
};
