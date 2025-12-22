"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Plus,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Receipt,
} from "lucide-react"

const transactions = [
  {
    id: 1,
    name: "Acme Corp",
    description: "Project payment",
    amount: 15000,
    type: "income",
    category: "Revenue",
    date: "Dec 20, 2024",
    status: "completed",
  },
  {
    id: 2,
    name: "Office Supplies",
    description: "Monthly office supplies",
    amount: -450,
    type: "expense",
    category: "Operations",
    date: "Dec 19, 2024",
    status: "completed",
  },
  {
    id: 3,
    name: "Tech Solutions Inc",
    description: "Consulting services",
    amount: 8500,
    type: "income",
    category: "Revenue",
    date: "Dec 18, 2024",
    status: "completed",
  },
  {
    id: 4,
    name: "Marketing Campaign",
    description: "Social media ads",
    amount: -3200,
    type: "expense",
    category: "Marketing",
    date: "Dec 17, 2024",
    status: "completed",
  },
  {
    id: 5,
    name: "GlobalTech Ltd",
    description: "Software license",
    amount: 12000,
    type: "income",
    category: "Revenue",
    date: "Dec 16, 2024",
    status: "completed",
  },
  {
    id: 6,
    name: "Web Hosting",
    description: "Annual hosting fee",
    amount: -890,
    type: "expense",
    category: "Technology",
    date: "Dec 15, 2024",
    status: "completed",
  },
  {
    id: 7,
    name: "Startup Inc",
    description: "Development work",
    amount: 22000,
    type: "income",
    category: "Revenue",
    date: "Dec 14, 2024",
    status: "pending",
  },
  {
    id: 8,
    name: "Employee Salaries",
    description: "December payroll",
    amount: -45000,
    type: "expense",
    category: "Salaries",
    date: "Dec 13, 2024",
    status: "completed",
  },
]

const stats = [
  { label: "Total Income", value: "$57,500", icon: TrendingUp, color: "text-success" },
  { label: "Total Expenses", value: "$49,540", icon: DollarSign, color: "text-foreground" },
  { label: "Net Cash Flow", value: "$7,960", icon: Receipt, color: "text-accent" },
]

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="lg:pl-64 pt-16">
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Transactions</h1>
              <p className="text-muted-foreground mt-1">Track and manage all your financial transactions</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button className="gap-2 rounded-full">
                <Plus className="w-4 h-4" />
                Add Transaction
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <Card key={i} className="p-6 border-0 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="p-4 border-0 shadow-sm">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input placeholder="Search transactions..." className="pl-10 bg-background/50" />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Calendar className="w-4 h-4" />
                  Date Range
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>
            </div>
          </Card>

          {/* Transactions List */}
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Transaction</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="border-t hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
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
                            <p className="text-sm text-muted-foreground">{transaction.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{transaction.date}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            transaction.status === "completed"
                              ? "bg-success/10 text-success"
                              : "bg-chart-4/10 text-chart-4"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span
                          className={`text-base font-semibold ${
                            transaction.type === "income" ? "text-success" : "text-foreground"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
