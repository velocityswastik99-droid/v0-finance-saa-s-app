"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTransactions } from "@/hooks/use-transactions"
import { useCurrency } from "@/contexts/currency-context"
import { formatCurrency } from "@/lib/currency"
import { useState } from "react"
import {
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Download,
  Calendar,
  TrendingUp,
  DollarSign,
  Receipt,
  Loader2,
} from "lucide-react"
import { AddTransactionDialog } from "@/components/add-transaction-dialog"

export default function TransactionsPage() {
  const { transactions, isLoading } = useTransactions()
  const { currency } = useCurrency()
  const [searchQuery, setSearchQuery] = useState("")

  const stats = {
    totalIncome: transactions?.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0) || 0,
    totalExpenses: transactions?.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0) || 0,
  }
  const netCashFlow = stats.totalIncome - stats.totalExpenses

  const filteredTransactions =
    transactions?.filter(
      (t) =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || []

  const statsDisplay = [
    {
      label: "Total Income",
      value: formatCurrency(stats.totalIncome, currency),
      icon: TrendingUp,
      color: "text-success",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(stats.totalExpenses, currency),
      icon: DollarSign,
      color: "text-foreground",
    },
    { label: "Net Cash Flow", value: formatCurrency(netCashFlow, currency), icon: Receipt, color: "text-accent" },
  ]

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
              <AddTransactionDialog />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statsDisplay.map((stat, i) => (
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
                <Input
                  placeholder="Search transactions..."
                  className="pl-10 bg-background/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
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
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <Receipt className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-lg font-medium mb-1">No transactions found</p>
                <p className="text-sm text-muted-foreground">Add your first transaction to get started</p>
              </div>
            ) : (
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
                    {filteredTransactions.map((transaction) => (
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
                              {transaction.description && (
                                <p className="text-sm text-muted-foreground">{transaction.description}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted">
                            {transaction.category}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              transaction.status === "completed"
                                ? "bg-success/10 text-success"
                                : transaction.status === "pending"
                                  ? "bg-chart-4/10 text-chart-4"
                                  : "bg-muted text-muted-foreground"
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
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(Number(transaction.amount), currency)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
