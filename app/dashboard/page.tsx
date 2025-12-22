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

// Sample data
const revenueData = [
  { month: "Jan", revenue: 45000, expenses: 32000 },
  { month: "Feb", revenue: 52000, expenses: 35000 },
  { month: "Mar", revenue: 48000, expenses: 33000 },
  { month: "Apr", revenue: 61000, expenses: 38000 },
  { month: "May", revenue: 55000, expenses: 36000 },
  { month: "Jun", revenue: 67000, expenses: 41000 },
  { month: "Jul", revenue: 72000, expenses: 43000 },
]

const expenseBreakdown = [
  { category: "Operations", value: 32000, color: "oklch(0.42 0.19 160)" },
  { category: "Marketing", value: 18000, color: "oklch(0.55 0.15 200)" },
  { category: "Salaries", value: 45000, color: "oklch(0.65 0.18 150)" },
  { category: "Technology", value: 15000, color: "oklch(0.7 0.14 50)" },
]

const recentTransactions = [
  { id: 1, name: "Acme Corp", amount: 15000, type: "income", date: "Dec 20, 2024" },
  { id: 2, name: "Office Supplies", amount: -450, type: "expense", date: "Dec 19, 2024" },
  { id: 3, name: "Tech Solutions Inc", amount: 8500, type: "income", date: "Dec 18, 2024" },
  { id: 4, name: "Marketing Campaign", amount: -3200, type: "expense", date: "Dec 17, 2024" },
  { id: 5, name: "GlobalTech Ltd", amount: 12000, type: "income", date: "Dec 16, 2024" },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-16">
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, Sarah</h1>
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
              value="$124,500"
              change="+12.5% from last month"
              trend="up"
              icon={DollarSign}
              colorClass="from-accent/5"
            />
            <StatCard
              title="Cash Flow"
              value="$45,200"
              change="+8.3% increase"
              trend="up"
              icon={TrendingUp}
              colorClass="from-success/5"
            />
            <StatCard
              title="Expenses"
              value="$79,300"
              change="-5.2% from last month"
              trend="down"
              icon={Wallet}
              colorClass="from-chart-4/5"
            />
            <StatCard
              title="Outstanding"
              value="$18,900"
              change="7 pending invoices"
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
                  <p className="text-sm text-muted-foreground mt-1">Monthly comparison for 2024</p>
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
                <AreaChart data={revenueData}>
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
                  <p className="text-sm text-muted-foreground mt-1">Current month distribution</p>
                </div>
              </div>
              <ChartContainer
                config={{
                  operations: {
                    label: "Operations",
                    color: "oklch(0.42 0.19 160)",
                  },
                  marketing: {
                    label: "Marketing",
                    color: "oklch(0.55 0.15 200)",
                  },
                  salaries: {
                    label: "Salaries",
                    color: "oklch(0.65 0.18 150)",
                  },
                  technology: {
                    label: "Technology",
                    color: "oklch(0.7 0.14 50)",
                  },
                }}
                className="h-[240px]"
              >
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
              <div className="mt-6 space-y-3">
                {expenseBreakdown.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.category}</span>
                    </div>
                    <span className="text-sm font-medium">${item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="p-6 border-0 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Recent Transactions</h3>
                <p className="text-sm text-muted-foreground mt-1">Your latest financial activity</p>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
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
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <span
                    className={`text-lg font-semibold ${
                      transaction.type === "income" ? "text-success" : "text-foreground"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
