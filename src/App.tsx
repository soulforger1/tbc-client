import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryState, parseAsString } from "nuqs";
import type { Stock } from "@/lib/api";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ToastProvider } from "@/components/Toast";
import { ThemeProvider } from "@/context/ThemeContext";
import { OpenOrdersProvider } from "@/context/OpenOrdersContext";
import { TradePage } from "@/pages/TradePage";
import { HistoryPage } from "@/pages/HistoryPage";
import { PortfolioPage } from "@/pages/PortfolioPage";
import { OrdersPage } from "@/pages/OrdersPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { WalletPage } from "@/pages/WalletPage";

const PlaceholderPage = ({ title }: { title: string }) => {
  const { t } = useTranslation();
  return (
    <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-edge text-sm text-ink4">
      {t("page.comingSoon", { title })}
    </div>
  );
};

const AppInner = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsString.withDefault("trade"),
  );
  const [initialStock, setInitialStock] = useState<Stock | null>(null);

  const handleTabChange = (tab: string) => {
    void setActiveTab(tab);
  };

  const pageMeta: Record<string, { title: string; subtitle?: string }> = {
    trade: { title: t("page.newTrade"), subtitle: t("page.newTradeSub") },
    history: { title: t("page.history"), subtitle: t("page.historySub") },
    portfolio: { title: t("page.portfolio"), subtitle: t("page.portfolioSub") },
    orders: { title: t("page.openOrders"), subtitle: t("page.openOrdersSub") },
    wallet: { title: t("page.wallet"), subtitle: t("page.walletSub") },
    settings: { title: t("page.settings"), subtitle: t("page.settingsSub") },
  };

  const meta = pageMeta[activeTab] ?? { title: activeTab };

  useEffect(() => {
    document.title = `${meta.title} — TBC Trade`;
  }, [meta.title]);

  const renderPage = () => {
    switch (activeTab) {
      case "trade":
        return <TradePage initialStock={initialStock} onStockConsumed={() => setInitialStock(null)} />;
      case "history":
        return <HistoryPage />;
      case "portfolio":
        return <PortfolioPage />;
      case "orders":
        return <OrdersPage />;
      case "wallet":
        return <WalletPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <PlaceholderPage title={meta.title} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onLogoClick={() => handleTabChange("trade")}
          onNavigate={handleTabChange}
          onSelectStock={(stock) => { setInitialStock(stock); handleTabChange("trade"); }}
        />
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:p-6 md:pb-6">
          {renderPage()}
        </main>
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <ToastProvider>
      <OpenOrdersProvider>
        <AppInner />
      </OpenOrdersProvider>
    </ToastProvider>
  </ThemeProvider>
);

export default App;
