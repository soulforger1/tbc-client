import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { portfolioHistory } from "@/data/dummy";
import { formatCurrency } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-edge bg-card px-3 py-2.5 shadow-xl">
      <p className="mb-1 text-xs text-ink4">{label}</p>
      <p className="text-sm font-semibold text-ink">
        {formatCurrency(payload[0].value)}
      </p>
      {payload[1] && (
        <p
          className={`text-xs ${payload[1].value >= 0 ? "text-emerald-500" : "text-red-500"}`}
        >
          P&L: {payload[1].value >= 0 ? "+" : ""}
          {formatCurrency(payload[1].value)}
        </p>
      )}
    </div>
  );
};

export const PortfolioChart = () => {
  const { isDark } = useTheme();
  const axisColor = isDark ? "#71717a" : "#9ca3af";
  const gridColor = isDark ? "#27272a" : "#e5e7eb";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Performance</CardTitle>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-ink4">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Value
          </span>
          <span className="flex items-center gap-1.5 text-ink4">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            P&L
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={portfolioHistory}
            margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="pnlGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridColor}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: axisColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: axisColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              width={46}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: axisColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
              width={46}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#valueGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#3b82f6" }}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="pnl"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#pnlGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#22c55e" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
