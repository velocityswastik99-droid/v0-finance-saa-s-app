"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, DollarSign, BarChart3, Download } from "lucide-react"
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

const monthlyData = [
  { month: "Jan", revenue: 45000, expenses: 32000, profit: 13000 },
  { month: "Feb", revenue: 52000, expenses: 35000, profit: 17000 },
  { month: "Mar", revenue: 48000, expenses: 33000, profit: 15000 },
  { month: "Apr", revenue: 61000, expenses: 38000, profit: 23000 },
  { month: "May", revenue: 55000, expenses: 36000, profit: 19000 },
  { month: "Jun", revenue: 67000, expenses: 41000, profit: 26000 },
  { month: "Jul", revenue: 72000, expenses: 43000, profit: 29000 },
  { month: "Aug", revenue: 68000, expenses: 42000, profit: 26000 },
]

const categoryData = [
  { category: "Operations", amount: 32000 },
  { category: "Marketing", amount: 18000 },
  { category: "Salaries", amount: 45000 },
  { category: "Technology", amount: 15000 },
  { category: "Other", amount: 8000 },
]

const growthMetrics = [
  { label: "Revenue Growth", value: "+24.5%", trend: "up" },
  { label: "Profit Margin", value: "38.2%", trend: "up" },
  { label: "Expense Ratio", value: "61.8%", trend: "down" },
  { label: "Cash Efficiency", value: "92.3%", trend: "up" },
]

export default function AnalyticsPage() {
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
                  />
                  <Bar dataKey="amount" fill="oklch(0.55 0.15 200)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

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
                    Your revenue has grown 24.5% compared to last quarter
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
                  <h4 className="font-semibold mb-1">Healthy Margin</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your profit margin of 38.2% is above industry average
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
                  <h4 className="font-semibold mb-1">Watch Expenses</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Salary expenses increased 8% this month
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
