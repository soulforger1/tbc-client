import { Shield, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import tbcLogo from "@/assets/tbc-logo.svg";

export const LoginPage = () => {
  const { login } = useAuth();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* Ambient glow decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[350px] w-[350px] translate-x-1/3 translate-y-1/3 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
            <img src={tbcLogo} alt="TBC" className="h-8 w-auto" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight text-ink">
              TBC Trade
            </h1>
            <p className="text-xs text-ink4">Capital Markets Platform</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-edge bg-card shadow-2xl">
          <div className="p-6 pb-5">
            <h2 className="text-base font-semibold text-ink">Welcome back</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink4">
              Sign in with your TBC account to access your portfolio and trading
              dashboard.
            </p>
          </div>

          <div className="border-t border-edge px-6 pb-6 pt-5">
            <button
              onClick={login}
              className="group flex w-full items-center justify-between rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              <div className="flex items-center gap-2.5">
                <Shield className="h-4 w-4 opacity-80" />
                Sign in with TBC SSO
              </div>
              <ArrowRight className="h-4 w-4 opacity-60 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-5 text-center text-xs text-ink4">
          Secured with TBC Single Sign-On
        </p>
      </div>
    </div>
  );
};
