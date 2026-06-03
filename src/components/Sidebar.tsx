import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useOpenOrders } from "@/hooks/useOpenOrders";
import { ShieldCheck } from "lucide-react";
import {
  BarChart3,
  ClipboardList,
  History,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Wallet,
} from "lucide-react";
import tbcLogo from "@/assets/tbc-logo.svg";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const IS_BROKER = !!import.meta.env.VITE_BROKER_REGNO;

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { t } = useTranslation();
  const { orders } = useOpenOrders();

  const primaryNav = [
    { id: "trade", label: t("nav.newTrade"), icon: TrendingUp },
    { id: "orders", label: t("nav.openOrders"), icon: ClipboardList },
  ];

  const secondaryNav = [
    { id: "dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { id: "history", label: t("nav.history"), icon: History },
    { id: "portfolio", label: t("nav.portfolio"), icon: BarChart3 },
    { id: "wallet", label: t("nav.wallet"), icon: Wallet },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-edge bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-edge px-5">
        <img
          src={tbcLogo}
          alt="Tavan Bogd"
          className="h-6 w-auto dark:invert-0 invert"
        />
        <span className="text-sm font-semibold text-ink2">Trade</span>
      </div>

      <nav className="flex-1 p-3">
        {/* Primary */}
        <div className="space-y-1">
          {primaryNav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                activeTab === id
                  ? id === "trade"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20"
                    : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  : id === "trade"
                    ? "text-ink2 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-300"
                    : "text-ink2 hover:bg-muted hover:text-ink",
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
              {id === "orders" && orders.length > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500/20 px-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                  {orders.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Broker panel — only shown when VITE_BROKER_REGNO is set */}
        {IS_BROKER && (
          <button
            onClick={() => onTabChange("broker")}
            className={cn(
              "mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
              activeTab === "broker"
                ? "bg-blue-600/15 text-blue-600 dark:text-blue-400"
                : "text-ink2 hover:bg-muted hover:text-ink",
            )}
          >
            <ShieldCheck className="h-4 w-4 flex-shrink-0" />
            Broker Panel
          </button>
        )}

        {/* Divider */}
        <div className="my-3 flex items-center gap-2">
          <div className="h-px flex-1 bg-edge" />
          <span className="text-xs text-ink4">{t("nav.more")}</span>
          <div className="h-px flex-1 bg-edge" />
        </div>

        {/* Secondary */}
        <div className="space-y-0.5">
          {secondaryNav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                activeTab === id
                  ? "bg-muted text-ink"
                  : "text-ink4 hover:bg-muted hover:text-ink2",
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Settings + User */}
      <div className="border-t border-edge p-3 space-y-1">
        <button
          onClick={() => onTabChange("settings")}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            activeTab === "settings"
              ? "bg-muted text-ink"
              : "text-ink4 hover:bg-muted hover:text-ink2",
          )}
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          {t("nav.settings")}
        </button>

        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-subtle text-xs font-semibold text-ink2">
            ZY
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">Zolboo Y.</p>
            <p className="truncate text-xs text-ink4">zolbooyuro@gmail.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
