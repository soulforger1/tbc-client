import { Check } from "lucide-react";

interface StepIndicatorProps {
  current: number;
  total: number;
  labels: string[];
}

export const StepIndicator = ({
  current,
  total,
  labels,
}: StepIndicatorProps) => (
  <div className="flex items-start mb-6">
    {labels.map((label, i) => {
      const step = i + 1;
      const isCompleted = step < current;
      const isActive = step === current;
      return (
        <div
          key={step}
          className={`flex items-start ${step < total ? "flex-1" : ""}`}
        >
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                ${isCompleted ? "bg-emerald-500 text-white" : isActive ? "bg-blue-500 text-white" : "border border-edge text-ink4"}`}
            >
              {isCompleted ? <Check className="h-3.5 w-3.5" /> : step}
            </div>
            <span
              className={`text-xs whitespace-nowrap font-medium ${isActive ? "text-ink" : isCompleted ? "text-ink3" : "text-ink4"}`}
            >
              {label}
            </span>
          </div>
          {step < total && (
            <div
              className={`flex-1 h-px mt-3.5 mx-2 transition-colors ${isCompleted ? "bg-emerald-500" : "bg-edge"}`}
            />
          )}
        </div>
      );
    })}
  </div>
);
