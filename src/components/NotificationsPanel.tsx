import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    title: "Order filled",
    body: "TRD-001 · AAPL 50 shares @ $189.50",
    time: "2m ago",
    read: false,
  },
  {
    id: 2,
    icon: TrendingUp,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    title: "Order placed",
    body: "TRD-009 · AAPL SELL 20 shares (limit)",
    time: "1h ago",
    read: false,
  },
  {
    id: 3,
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    title: "Order pending",
    body: "TRD-003 · NVDA BUY 20 shares @ $875.00",
    time: "2h ago",
    read: true,
  },
  {
    id: 4,
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    title: "Order filled",
    body: "TRD-004 · MSFT 25 shares @ $415.20",
    time: "1d ago",
    read: true,
  },
];

export const NotificationsPanel = ({
  onClose,
  onAllRead,
}: {
  onClose: () => void;
  onAllRead: () => void;
}) => {
  const { t } = useTranslation();
  const [items, setItems] = useState(INITIAL_NOTIFICATIONS);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [onClose]);

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    onAllRead();
  };

  return (
    <div
      ref={ref}
      className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-edge bg-card shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-edge px-4 py-3">
        <h3 className="text-sm font-semibold text-ink">
          {t("common.notifications")}
        </h3>
        <button
          onClick={markAllRead}
          className="text-xs text-blue-500 hover:text-blue-400 transition-colors"
        >
          {t("common.markAllRead")}
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {items.map((n) => (
          <div
            key={n.id}
            onClick={() =>
              setItems((prev) =>
                prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
              )
            }
            className={`flex gap-3 border-b border-edge/50 px-4 py-3 last:border-0 cursor-pointer transition-colors hover:bg-muted ${!n.read ? "bg-muted/50" : ""}`}
          >
            <div
              className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${n.bg}`}
            >
              <n.icon className={`h-3.5 w-3.5 ${n.color}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-ink">{n.title}</p>
                <span className="flex-shrink-0 text-xs text-ink4">
                  {n.time}
                </span>
              </div>
              <p className="mt-0.5 truncate text-xs text-ink3">{n.body}</p>
            </div>
            {!n.read && (
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-edge px-4 py-2.5">
        <button className="text-xs text-ink4 hover:text-ink3 transition-colors">
          {t("common.viewAll")}
        </button>
      </div>
    </div>
  );
};
