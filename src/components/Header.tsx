import { useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { SearchPanel } from "./SearchPanel";
import { useOpenOrders } from "@/hooks/useOpenOrders";
import type { Stock } from "@/lib/api";
import tbcLogo from "@/assets/tbc-logo.svg";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onLogoClick?: () => void;
  onNavigate?: (tab: string) => void;
  onSelectStock?: (stock: Stock) => void;
}

export const Header = ({ title, subtitle, onLogoClick, onNavigate, onSelectStock }: HeaderProps) => {
  const { t, i18n } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { refetch } = useOpenOrders();

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>
      <header className="relative flex h-14 items-center justify-between border-b border-edge bg-card/80 px-4 backdrop-blur-sm md:h-16 md:px-6">
        {/* Mobile: logo button */}
        <button onClick={onLogoClick} className="md:hidden focus:outline-none">
          <img
            src={tbcLogo}
            alt="TBC"
            className="h-6 w-auto dark:invert-0 invert"
          />
        </button>
        {/* Desktop: page title */}
        <div className="hidden md:block">
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

          <div className="ml-1 h-5 w-px bg-edge" />
          <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-semibold uppercase text-ink3">
            {i18n.language}
          </span>
        </div>
      </header>

      {searchOpen && (
        <SearchPanel
          onClose={() => setSearchOpen(false)}
          onNavigate={onNavigate}
          onSelectStock={onSelectStock}
        />
      )}
    </>
  );
};
