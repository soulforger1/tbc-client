import { useTranslation } from "react-i18next";

interface SideSwitcherProps {
  side: "buy" | "sell";
  onChange: (side: "buy" | "sell") => void;
}

export const SideSwitcher = ({ side, onChange }: SideSwitcherProps) => {
  const { t } = useTranslation();
  return (
    <div className="mb-6 flex rounded-lg border border-edge p-1">
      <button
        type="button"
        onClick={() => onChange("buy")}
        className={`flex-1 rounded-md py-2.5 text-sm font-bold uppercase tracking-wide transition-colors ${side === "buy" ? "bg-emerald-600 text-white" : "text-ink3 hover:text-ink"}`}
      >
        {t("trade.buy")}
      </button>
      <button
        type="button"
        onClick={() => onChange("sell")}
        className={`flex-1 rounded-md py-2.5 text-sm font-bold uppercase tracking-wide transition-colors ${side === "sell" ? "bg-red-600 text-white" : "text-ink3 hover:text-ink"}`}
      >
        {t("trade.sell")}
      </button>
    </div>
  );
};
