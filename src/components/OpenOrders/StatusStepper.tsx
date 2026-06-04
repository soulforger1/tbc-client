import { cn } from "@/lib/utils";
import type { TradeStatus } from "@/data/types";

const STEP_LABELS = ["Open", "Filed", "Nominal", "Closed"];

interface StatusStepperProps {
  step: number;
  status: TradeStatus;
}

export const StatusStepper = ({ step, status }: StatusStepperProps) => {
  if (status === "cancelled") {
    return (
      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-red-500/15 text-red-600 dark:text-red-400">
        Cancelled
      </span>
    );
  }

  return (
    <div className="flex items-center gap-0.5">
      {STEP_LABELS.map((label, i) => {
        const done = step > i;
        const active = step === i;
        return (
          <div key={label} className="flex items-center gap-0.5">
            <div className="flex flex-col items-center">
              <div
                title={label}
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
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={cn("mb-2.5 h-px w-3", done ? "bg-emerald-500" : "bg-edge")} />
            )}
          </div>
        );
      })}
    </div>
  );
};
