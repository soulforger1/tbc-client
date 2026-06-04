import type { TradeStatus } from "@/data/types";

export const STATUS_VARIANT: Record<
  TradeStatus,
  "success" | "warning" | "outline" | "secondary" | "default"
> = {
  open: "outline",
  closed: "success",
  filled: "success",
  cancelled: "secondary",
  partial: "warning",
  final: "success",
};

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
