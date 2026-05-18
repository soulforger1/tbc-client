import { useTranslation } from "react-i18next";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { FormGroup } from "../ui/form-group";
import { SYMBOLS } from "./constants";

interface OrderFieldsProps {
  symbol: string;
  quantity: string;
  orderType: "market" | "limit";
  onSymbolChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  onOrderTypeChange: (value: "market" | "limit") => void;
}

export const OrderFields = ({
  symbol,
  quantity,
  orderType,
  onSymbolChange,
  onQuantityChange,
  onOrderTypeChange,
}: OrderFieldsProps) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-3 gap-3 mb-5">
      <FormGroup label={t("trade.symbol")}>
        <Select
          value={symbol}
          onChange={(e) => onSymbolChange(e.target.value)}
          className="h-9 text-sm font-semibold"
        >
          {SYMBOLS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </FormGroup>
      <FormGroup label={t("trade.quantity")}>
        <Input
          type="number"
          min="1"
          placeholder="0"
          value={quantity}
          onChange={(e) => onQuantityChange(e.target.value)}
          className="h-9 text-sm font-semibold"
        />
      </FormGroup>
      <FormGroup label={t("trade.orderType")}>
        <Select
          value={orderType}
          onChange={(e) => onOrderTypeChange(e.target.value as "market" | "limit")}
          className="h-9 text-sm font-semibold"
        >
          <option value="market">{t("trade.market")}</option>
          <option value="limit">{t("trade.limit")}</option>
        </Select>
      </FormGroup>
    </div>
  );
};
