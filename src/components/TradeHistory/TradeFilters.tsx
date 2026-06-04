import { useTranslation } from "react-i18next";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import type { TradeStatus, TradeSide } from "@/data/types";

interface TradeFiltersProps {
  search: string;
  statusFilter: TradeStatus | "all";
  sideFilter: TradeSide | "all";
  onSearch: (value: string) => void;
  onStatusChange: (value: TradeStatus | "all") => void;
  onSideChange: (value: TradeSide | "all") => void;
}

export const TradeFilters = ({
  search,
  statusFilter,
  sideFilter,
  onSearch,
  onStatusChange,
  onSideChange,
}: TradeFiltersProps) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4 flex flex-wrap gap-3">
      <div className="relative flex-1 min-w-40">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink4" />
        <Input
          placeholder={t("history.search")}
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-8 h-8 text-xs"
        />
      </div>
      <Select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as TradeStatus | "all")}
        className="w-32 h-8 text-xs"
      >
        <option value="all">{t("history.allStatus")}</option>
        <option value="open">{t("history.statusLabels.open")}</option>
        <option value="closed">{t("history.statusLabels.closed")}</option>
        <option value="filled">{t("history.statusLabels.filled")}</option>
        <option value="partial">{t("history.statusLabels.partial")}</option>
        <option value="final">{t("history.statusLabels.final")}</option>
        <option value="cancelled">{t("history.statusLabels.cancelled")}</option>
      </Select>
      <Select
        value={sideFilter}
        onChange={(e) => onSideChange(e.target.value as TradeSide | "all")}
        className="w-28 h-8 text-xs"
      >
        <option value="all">{t("history.allSides")}</option>
        <option value="buy">{t("history.sideLabels.buy")}</option>
        <option value="sell">{t("history.sideLabels.sell")}</option>
      </Select>
      <button className="flex items-center gap-1.5 rounded-lg border border-edge px-3 py-1.5 text-xs text-ink3 hover:bg-muted transition-colors">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        {t("history.filters")}
      </button>
    </div>
  );
};
