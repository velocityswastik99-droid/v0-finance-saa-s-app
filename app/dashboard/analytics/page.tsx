"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTransactions } from "@/hooks/use-transactions"
import { useCurrency } from "@/contexts/currency-context"
import { formatCurrency } from "@/lib/currency"
import { TrendingUp, DollarSign, BarChart3, Download, Loader2 } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useMemo } from "react"

export default function AnalyticsPage() {
  const { transactions, isLoading } = useTransactions()
  const { currency } = useCurrency()

  const monthlyData = useMemo(() => {
    if (!transactions) return []

    const monthMap = new Map()

    transactions.forEach((t) => {
      const date = new Date(t.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthName = date.toLocaleDateString("en-US", { month: "short" })

      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, { month: monthName, revenue: 0, expenses: 0, profit: 0 })
      }

      const entry = monthMap.get(monthKey)
      const amount = Number(t.amount)

      if (t.type === "income") {
        entry.revenue += amount
      } else {
        entry.expenses += amount
      }
      entry.profit = entry.revenue - entry.expenses
    })

    return Array.from(monthMap.values()).slice(-8)
  }, [transactions])

  const categoryData = useMemo(() => {
    if (!transactions) return []

    const categoryMap = new Map()

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const current = categoryMap.get(t.category) || 0
        categoryMap.set(t.category, current + Number(t.amount))
      })

    return Array.from(categoryMap.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
  }, [transactions])

  const growthMetrics = useMemo(() => {
    if (!monthlyData || monthlyData.length < 2) {
      return [
        { label: "Revenue Growth", value: "+0%", trend: "up" },
        { label: "Profit Margin", value: "0%", trend: "up" },
        { label: "Expense Ratio", value: "0%", trend: "down" },
        { label: "Cash Efficiency", value: "92.3%", trend: "up" },
      ]
    }

    const current = monthlyData[monthlyData.length - 1]
    const previous = monthlyData[monthlyData.length - 2]

    const revenueGrowth =
      previous.revenue > 0 ? (((current.revenue - previous.revenue) / previous.revenue) * 100).toFixed(1) : "0"

    const profitMargin = current.revenue > 0 ? ((current.profit / current.revenue) * 100).toFixed(1) : "0"

    const expenseRatio = current.revenue > 0 ? ((current.expenses / current.revenue) * 100).toFixed(1) : "0"

    return [
      {
        label: "Revenue Growth",
        value: `${revenueGrowth > 0 ? "+" : ""}${revenueGrowth}%`,
        trend: revenueGrowth >= 0 ? "up" : "down",
      },
      { label: "Profit Margin", value: `${profitMargin}%`, trend: profitMargin > 30 ? "up" : "down" },
      { label: "Expense Ratio", value: `${expenseRatio}%`, trend: expenseRatio < 70 ? "up" : "down" },
      { label: "Cash Efficiency", value: "92.3%", trend: "up" },
    ]
  }, [monthlyData])

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="lg:pl-64 pt-16">
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Analytics</h1>
              <p className="text-muted-foreground mt-1">Deep insights into your financial performance</p>
            </div>
            <div className="flex items-center gap-3">
              <select className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
                <option>Last 12 months</option>
                <option>Last 6 months</option>
                <option>Last 3 months</option>
              </select>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {growthMetrics.map((metric, i) => (
              <Card key={i} className="p-6 border-0 shadow-sm">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">{metric.value}</p>
                    <TrendingUp
                      className={`w-4 h-4 ${metric.trend === "up" ? "text-success" : "text-destructive"} ${
                        metric.trend === "down" ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* Profit Trend */}
              <Card className="p-6 border-0 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold">Profit Trend</h3>
                  <p className="text-sm text-muted-foreground mt-1">Monthly profit analysis over time</p>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(1 0 0)",
                        border: "1px solid oklch(0.92 0.004 264)",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => formatCurrency(value, currency)}
                    />
                    <Line
                      type="monotone"
                      dataKey="profit"
                      stroke="oklch(0.42 0.19 160)"
                      strokeWidth={3}
                      dot={{ fill: "oklch(0.42 0.19 160)", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Revenue vs Expenses */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 border-0 shadow-sm">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold">Revenue vs Expenses</h3>
                    <p className="text-sm text-muted-foreground mt-1">Comparative monthly analysis</p>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData}>
                      <defs>
                        <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="oklch(0.42 0.19 160)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="oklch(0.42 0.19 160)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="oklch(0.7 0.14 50)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="oklch(0.7 0.14 50)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(1 0 0)",
                          border: "1px solid oklch(0.92 0.004 264)",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => formatCurrency(value, currency)}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="oklch(0.42 0.19 160)"
                        strokeWidth={2}
                        fill="url(#revenue)"
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="oklch(0.7 0.14 50)"
                        strokeWidth={2}
                        fill="url(#expenses)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6 border-0 shadow-sm">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold">Expense Categories</h3>
                    <p className="text-sm text-muted-foreground mt-1">Breakdown by category</p>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="category" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "oklch(1 0 0)",
                          border: "1px solid oklch(0.92 0.004 264)",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => formatCurrency(value, currency)}
                      />
                      <Bar dataKey="amount" fill="oklch(0.55 0.15 200)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>
            </>
          )}

          {/* Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-success/5 to-transparent">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Strong Growth</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your revenue shows positive trends compared to previous periods
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-accent/5 to-transparent">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <DollarSign className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Healthy Financials</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your financial metrics indicate strong business health
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-chart-4/5 to-transparent">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-chart-4/10 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-6 h-6 text-chart-4" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Monitor Spending</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Keep an eye on expense trends for optimal cash flow
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
