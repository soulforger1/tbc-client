import { useEffect, useState } from "react";
import { Loader2, Lock, Wallet } from "lucide-react";
import { api, type WalletEntry } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const WalletPage = () => {
  const [wallets, setWallets] = useState<WalletEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getWallet()
      .then(setWallets)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wallets.map((w) => (
          <Card key={w.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                  <Wallet className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{w.currency}</p>
                  <p className="text-xs font-normal text-ink4">{w.currencyName}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-end justify-between">
                  <span className="text-xs text-ink4">Total Balance</span>
                  <span className="text-2xl font-bold text-ink">
                    {formatCurrency(w.balance)}
                  </span>
                </div>

                <div className="h-px bg-edge" />

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-ink3">
                      <Lock className="h-3 w-3" />
                      Locked in orders
                    </span>
                    <span className="font-medium text-ink2">
                      {formatCurrency(w.lockedAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink3">Available</span>
                    <span className="font-semibold text-emerald-500">
                      {formatCurrency(w.available)}
                    </span>
                  </div>
                </div>

                <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{
                      width:
                        w.balance > 0
                          ? `${Math.min(100, (w.available / w.balance) * 100)}%`
                          : "0%",
                    }}
                  />
                </div>
                <p className="text-xs text-ink4">
                  {w.balance > 0
                    ? `${Math.round((w.available / w.balance) * 100)}% available`
                    : "No balance"}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {wallets.length === 0 && (
          <div className="col-span-full flex h-48 items-center justify-center rounded-xl border border-dashed border-edge text-sm text-ink4">
            No wallets found
          </div>
        )}
      </div>
    </div>
  );
};
