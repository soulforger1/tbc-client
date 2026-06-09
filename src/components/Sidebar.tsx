import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LogOut } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { useOpenOrders } from "@/hooks/useOpenOrders";
import { useAuth } from "@/context/AuthContext";
import {
  BarChart3,
  ClipboardList,
  History,
  Settings,
  TrendingUp,
  Wallet,
} from "lucide-react";
import tbcLogo from "@/assets/tbc-logo.svg";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { t } = useTranslation();
  const { orders } = useOpenOrders();
  const { user, logout } = useAuth();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const initials = user?.regno ? user.regno.slice(0, 2).toUpperCase() : "??";

  const primaryNav = [
    { id: "trade", label: t("nav.newTrade"), icon: TrendingUp },
    { id: "orders", label: t("nav.openOrders"), icon: ClipboardList },
  ];

  const secondaryNav = [
    { id: "history", label: t("nav.history"), icon: History },
    { id: "portfolio", label: t("nav.portfolio"), icon: BarChart3 },
    { id: "wallet", label: t("nav.wallet"), icon: Wallet },
  ];

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r border-edge bg-card">
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
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-subtle text-xs font-semibold text-ink2">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{user?.regno ?? "—"}</p>
            <p className="truncate text-xs text-ink4">{t("settings.signedInAs")}</p>
          </div>
          <button
            onClick={() => setLogoutOpen(true)}
            title={t("settings.signOut")}
            className="flex-shrink-0 rounded-md p-1.5 text-ink4 transition-colors hover:bg-muted hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        {logoutOpen && (
          <LogoutModal onCancel={() => setLogoutOpen(false)} onConfirm={() => void logout()} />
        )}
      </div>
    </aside>
  );
};

export const LogoutModal = ({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) => {
  const { t } = useTranslation();
  return (
    <Modal onClose={onCancel} maxWidth="sm">
      <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 ring-4 ring-destructive/10">
          <LogOut className="h-7 w-7 text-destructive" />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-ink">{t("settings.signOut")}</h2>
        <p className="mt-2 max-w-[260px] text-sm leading-relaxed text-ink4">
          {t("settings.signOutConfirm")}
        </p>

        <div className="mt-6 flex w-full gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-edge bg-card py-2.5 text-sm font-medium text-ink3 transition-colors hover:bg-muted hover:text-ink"
          >
            {t("settings.signOutNo")}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-destructive py-2.5 text-sm font-semibold text-white shadow-sm shadow-destructive/30 transition-all hover:opacity-90 active:scale-[0.98]"
          >
            {t("settings.signOutYes")}
          </button>
        </div>
      </div>
    </Modal>
  );
};
