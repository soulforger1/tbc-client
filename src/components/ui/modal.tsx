import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  align?: "center" | "top";
  maxWidth?: "sm" | "md" | "lg";
}

const widths = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg" } as const;

export const Modal = ({
  onClose,
  children,
  className,
  align = "center",
  maxWidth = "sm",
}: ModalProps) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex bg-black/50 backdrop-blur-sm",
        align === "center"
          ? "items-center justify-center"
          : "items-start justify-center pt-24",
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "w-full rounded-xl border border-edge bg-card shadow-2xl",
          widths[maxWidth],
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
