"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { StatCard } from "@/components/stat-card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  TrendingUp,
  Wallet,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Download,
} from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, Pie, PieChart, Cell, XAxis, YAxis } from "recharts"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { useTransactions } from "@/hooks/use-transactions"
import { useCurrency } from "@/contexts/currency-context"
import { formatCurrency } from "@/lib/currency"
import { useMemo } from "react"

export default function DashboardPage() {
  const { stats, isLoading: statsLoading } = useDashboardStats()
  const { transactions, isLoading: transactionsLoading } = useTransactions()
  const { currency } = useCurrency()

  const chartData = useMemo(() => {
    if (!transactions.length) return { revenueData: [], expenseBreakdown: [] }

    // Get last 7 months of data
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentDate = new Date()
    const revenueData = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const month = months[date.getMonth()]
      const year = date.getFullYear()

      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date)
        return tDate.getMonth() === date.getMonth() && tDate.getFullYear() === year
      })

      const revenue = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0)

      const expenses = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0)

      revenueData.push({ month, revenue, expenses })
    }

    // Calculate expense breakdown by category
    const expensesByCategory = transactions
      .filter((t) => t.type === "expense")
      .reduce(
        (acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + Number(t.amount)
          return acc
        },
        {} as Record<string, number>,
      )

    const colors = [
      "oklch(0.42 0.19 160)",
      "oklch(0.55 0.15 200)",
      "oklch(0.65 0.18 150)",
      "oklch(0.7 0.14 50)",
      "oklch(0.6 0.12 280)",
    ]

    const expenseBreakdown = Object.entries(expensesByCategory)
      .map(([category, value], index) => ({
        category,
        value,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

    return { revenueData, expenseBreakdown }
  }, [transactions])

  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 5)
  }, [transactions])

  if (statsLoading || transactionsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav />
        <main className="lg:pl-64 pt-16 lg:pt-16">
          <div className="p-6 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-16">
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back!</h1>
              <p className="text-muted-foreground mt-1">Here's what's happening with your finances today</p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <select className="h-10 rounded-lg border border-input bg-background px-3 text-sm">
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Last 12 months</option>
              </select>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats?.totalRevenue || 0, currency)}
              change={`${stats?.revenueChange.toFixed(1)}% from last month`}
              trend={stats?.revenueChange >= 0 ? "up" : "down"}
              icon={DollarSign}
              colorClass="from-accent/5"
            />
            <StatCard
              title="Cash Flow"
              value={formatCurrency(stats?.cashFlow || 0, currency)}
              change={`${Math.abs(stats?.cashFlowChange || 0).toFixed(1)}% ${stats?.cashFlowChange >= 0 ? "increase" : "decrease"}`}
              trend={stats?.cashFlowChange >= 0 ? "up" : "down"}
              icon={TrendingUp}
              colorClass="from-success/5"
            />
            <StatCard
              title="Expenses"
              value={formatCurrency(stats?.totalExpenses || 0, currency)}
              change={`${Math.abs(stats?.expensesChange || 0).toFixed(1)}% from last month`}
              trend={stats?.expensesChange >= 0 ? "up" : "down"}
              icon={Wallet}
              colorClass="from-chart-4/5"
            />
            <StatCard
              title="Outstanding"
              value={formatCurrency(stats?.outstanding || 0, currency)}
              change={`${stats?.outstandingCount || 0} pending invoices`}
              trend="up"
              icon={CreditCard}
              colorClass="from-chart-2/5"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            {/* Revenue Chart */}
            <Card className="lg:col-span-4 p-6 border-0 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Revenue vs Expenses</h3>
                  <p className="text-sm text-muted-foreground mt-1">Last 7 months comparison</p>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    color: "oklch(0.42 0.19 160)",
                  },
                  expenses: {
                    label: "Expenses",
                    color: "oklch(0.7 0.14 50)",
                  },
                }}
                className="h-[300px]"
              >
                <AreaChart data={chartData.revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.42 0.19 160)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.42 0.19 160)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.7 0.14 50)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.7 0.14 50)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="oklch(0.42 0.19 160)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="oklch(0.7 0.14 50)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorExpenses)"
                  />
                </AreaChart>
              </ChartContainer>
            </Card>

            {/* Expense Breakdown */}
            <Card className="lg:col-span-3 p-6 border-0 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Expense Breakdown</h3>
                  <p className="text-sm text-muted-foreground mt-1">By category</p>
                </div>
              </div>
              {chartData.expenseBreakdown.length > 0 ? (
                <>
                  <ChartContainer
                    config={{
                      value: {
                        label: "Amount",
                      },
                    }}
                    className="h-[240px]"
                  >
                    <PieChart>
                      <Pie
                        data={chartData.expenseBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {chartData.expenseBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                  <div className="mt-6 space-y-3">
                    {chartData.expenseBreakdown.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm">{item.category}</span>
                        </div>
                        <span className="text-sm font-medium">{formatCurrency(item.value, currency)}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No expense data available
                </div>
              )}
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="p-6 border-0 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
                <p className="text-sm text-muted-foreground mt-1">Your latest financial activity</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => (window.location.href = "/dashboard/transactions")}>
                View All
              </Button>
            </div>
            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          transaction.type === "income" ? "bg-success/10" : "bg-muted"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUpRight className="w-5 h-5 text-success" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-lg font-semibold ${
                        transaction.type === "income" ? "text-success" : "text-foreground"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(Math.abs(Number(transaction.amount)), currency)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">No transactions yet</div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
