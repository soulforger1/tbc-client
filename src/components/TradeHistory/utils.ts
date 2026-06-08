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

export const STATUS_TEXT_COLOR: Record<TradeStatus, string> = {
  open: "text-blue-500",
  filled: "text-emerald-500",
  final: "text-emerald-500",
  cancelled: "text-ink4",
  closed: "text-emerald-500",
  partial: "text-amber-500",
};

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
