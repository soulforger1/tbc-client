import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertVariant = "success" | "error" | "warning" | "muted";

const config: Record<
  AlertVariant,
  {
    bg: string;
    textColor: string;
    iconColor: string;
    Icon: React.ComponentType<{ className: string }>;
  }
> = {
  success: {
    bg: "bg-emerald-500/10",
    textColor: "text-emerald-600 dark:text-emerald-400",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    Icon: CheckCircle2,
  },
  error: {
    bg: "bg-red-500/10",
    textColor: "text-red-600 dark:text-red-400",
    iconColor: "text-red-600 dark:text-red-400",
    Icon: AlertCircle,
  },
  warning: {
    bg: "bg-amber-500/10",
    textColor: "text-amber-600 dark:text-amber-400",
    iconColor: "text-amber-600 dark:text-amber-400",
    Icon: AlertTriangle,
  },
  muted: {
    bg: "bg-muted/40 border border-edge",
    textColor: "text-ink4",
    iconColor: "text-amber-500",
    Icon: AlertTriangle,
  },
};

interface AlertProps {
  variant?: AlertVariant;
  className?: string;
  children: React.ReactNode;
}

export const Alert = ({
  variant = "muted",
  className,
  children,
}: AlertProps) => {
  const { bg, textColor, iconColor, Icon } = config[variant];
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg px-3 py-2.5",
        bg,
        className,
      )}
    >
      <Icon className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", iconColor)} />
      <span className={cn("text-xs leading-relaxed", textColor)}>
        {children}
      </span>
    </div>
  );
};
