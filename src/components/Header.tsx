import { useState } from "react";
import { Bell, RefreshCw, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { SearchPanel } from "./SearchPanel";
import { NotificationsPanel } from "./NotificationsPanel";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header = ({ title, subtitle }: HeaderProps) => {
  const { t, i18n } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [unread, setUnread] = useState(2);

  const handleRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <>
      <header className="relative flex h-16 items-center justify-between border-b border-edge bg-card/80 px-6 backdrop-blur-sm">
        <div>
          <h1 className="text-base font-semibold text-ink">{title}</h1>
          {subtitle && <p className="text-xs text-ink4">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-ink3 hover:text-ink"
            onClick={() => setSearchOpen(true)}
            title={t("common.search")}
          >
            <Search className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-ink3 hover:text-ink"
            onClick={handleRefresh}
            title={t("common.refresh")}
          >
            <RefreshCw
              className={`h-4 w-4 transition-transform duration-700 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-ink3 hover:text-ink"
              onClick={() => setNotifOpen((o) => !o)}
              title={t("common.notifications")}
            >
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-500 text-[9px] font-bold text-white">
                  {unread}
                </span>
              )}
            </Button>
            {notifOpen && (
              <NotificationsPanel
                onClose={() => setNotifOpen(false)}
                onAllRead={() => setUnread(0)}
              />
            )}
          </div>

          <div className="ml-1 h-5 w-px bg-edge" />
          <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-semibold uppercase text-ink3">
            {i18n.language}
          </span>
          <span className="text-xs text-ink4">{t("common.live")}</span>
          <span
            className={`h-2 w-2 rounded-full ${refreshing ? "bg-amber-400" : "bg-emerald-500 animate-pulse"}`}
          />
        </div>
      </header>

      {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}
    </>
  );
};
