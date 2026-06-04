import {
  BarChart3,
  ClipboardList,
  History,
  Settings,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useOpenOrders } from "@/hooks/useOpenOrders";
import { useTranslation } from "react-i18next";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const { orders } = useOpenOrders();
  const { t } = useTranslation();

  const items = [
    { id: "trade", icon: TrendingUp, label: t("nav.newTrade") },
    {
      id: "orders",
      icon: ClipboardList,
      label: t("nav.openOrders"),
      badge: orders.length,
    },
    { id: "portfolio", icon: BarChart3, label: t("nav.portfolio") },
    { id: "history", icon: History, label: t("nav.history") },
    { id: "settings", icon: Settings, label: t("nav.settings") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-stretch border-t border-edge bg-card/95 backdrop-blur-md md:hidden">
      {items.map(({ id, icon: Icon, label, badge }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors",
              active ? "text-blue-500" : "text-ink4 active:text-ink3",
            )}
          >
            <div className="relative">
              <Icon
                className={cn(
                  "h-5 w-5",
                  active && id === "trade" && "stroke-[2.5px]",
                )}
              />
              {badge != null && badge > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-0.5 text-[9px] font-bold text-black">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </div>
            <span
              className={cn(
                "max-w-[52px] text-center text-[9px] font-medium leading-tight",
                active ? "text-blue-500" : "text-ink4",
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
