import { cn } from "@/lib/utils";
import type { TradeStatus } from "@/data/types";

const STEPS: TradeStatus[] = ["open", "filing", "nominal", "closed"];

const stepLabel: Record<string, string> = {
  open: "Open",
  filing: "Filing",
  nominal: "Nominal",
  closed: "Closed",
};

interface StatusStepperProps {
  status: TradeStatus;
}

export const StatusStepper = ({ status }: StatusStepperProps) => {
  const currentIndex = STEPS.indexOf(status);
  const isCancelled = status === "cancelled";

  if (isCancelled) {
    return (
      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-red-500/15 text-red-600 dark:text-red-400">
        Cancelled
      </span>
    );
  }

  return (
    <div className="flex items-center gap-0.5">
      {STEPS.map((step, i) => {
        const done = currentIndex > i;
        const active = currentIndex === i;
        return (
          <div key={step} className="flex items-center gap-0.5">
            <div className="flex flex-col items-center">
              <div
                title={stepLabel[step]}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  done && "bg-emerald-500",
                  active && "bg-amber-400 ring-2 ring-amber-400/30",
                  !done && !active && "bg-edge",
                )}
              />
              <span className={cn(
                "mt-0.5 text-[9px] leading-none",
                active ? "text-amber-500 font-semibold" : done ? "text-emerald-500" : "text-ink4",
              )}>
                {stepLabel[step]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("mb-2.5 h-px w-3", done ? "bg-emerald-500" : "bg-edge")} />
            )}
          </div>
        );
      })}
    </div>
  );
};
