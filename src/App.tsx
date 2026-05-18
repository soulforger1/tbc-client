import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { ToastProvider } from "@/components/Toast";
import { ThemeProvider } from "@/context/ThemeContext";
import { DashboardPage } from "@/pages/DashboardPage";
import { TradePage } from "@/pages/TradePage";
import { HistoryPage } from "@/pages/HistoryPage";
import { PortfolioPage } from "@/pages/PortfolioPage";
import { OrdersPage } from "@/pages/OrdersPage";
import { SettingsPage } from "@/pages/SettingsPage";

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
  const [activeTab, setActiveTab] = useState("trade");

  const pageMeta: Record<string, { title: string; subtitle?: string }> = {
    dashboard: { title: t("page.dashboard"), subtitle: t("page.dashboardSub") },
    trade: { title: t("page.newTrade"), subtitle: t("page.newTradeSub") },
    history: { title: t("page.history"), subtitle: t("page.historySub") },
    portfolio: { title: t("page.portfolio"), subtitle: t("page.portfolioSub") },
    orders: { title: t("page.openOrders"), subtitle: t("page.openOrdersSub") },
    wallet: { title: t("page.wallet"), subtitle: t("page.walletSub") },
    settings: { title: t("page.settings"), subtitle: t("page.settingsSub") },
  };

  const meta = pageMeta[activeTab] ?? { title: activeTab };

  const renderPage = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage />;
      case "trade":
        return <TradePage />;
      case "history":
        return <HistoryPage />;
      case "portfolio":
        return <PortfolioPage />;
      case "orders":
        return <OrdersPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <PlaceholderPage title={meta.title} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 overflow-y-auto p-6">{renderPage()}</main>
      </div>
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  </ThemeProvider>
);

export default App;
