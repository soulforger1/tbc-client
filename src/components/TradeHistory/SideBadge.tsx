import { useTranslation } from "react-i18next";
import type { TradeSide } from "@/data/types";

export const SideBadge = ({ side }: { side: TradeSide }) => {
  const { t } = useTranslation();
  return (
    <span
      className={`text-xs font-bold ${side === "buy" ? "text-emerald-500" : "text-red-500"}`}
    >
      {t(side === "buy" ? "history.sideLabels.buy" : "history.sideLabels.sell")}
    </span>
  );
};
