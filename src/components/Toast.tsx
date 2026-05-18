import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export const useToast = () => useContext(ToastContext);

let _nextId = 0;

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++_nextId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      4000,
    );
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5">
        {toasts.map((t) => (
          <ToastBanner
            key={t.id}
            item={t}
            onDismiss={(id) =>
              setToasts((prev) => prev.filter((x) => x.id !== id))
            }
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastBanner = ({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: number) => void;
}) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setVisible(true), 10);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const Icon =
    item.type === "success"
      ? CheckCircle2
      : item.type === "error"
        ? XCircle
        : Info;

  return (
    <div
      className={cn(
        "flex min-w-72 max-w-sm items-start gap-3 rounded-xl border px-4 py-3.5 shadow-xl transition-all duration-300 bg-card",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        {
          "border-emerald-500/30 text-emerald-600 dark:text-emerald-400":
            item.type === "success",
          "border-red-500/30 text-red-600 dark:text-red-400":
            item.type === "error",
          "border-blue-500/30 text-blue-600 dark:text-blue-400":
            item.type === "info",
        },
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{item.message}</p>
      <button
        onClick={() => onDismiss(item.id)}
        className="text-ink4 hover:text-ink3 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
