"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useBudgets } from "@/hooks/use-budgets"
import { useCurrency } from "@/contexts/currency-context"
import { formatCurrency } from "@/lib/currency"
import { Plus, TrendingUp, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

export default function BudgetPage() {
  const { budgets, isLoading } = useBudgets()
  const { currency } = useCurrency()

  const totalBudget = budgets?.reduce((acc, b) => acc + Number(b.budget_limit), 0) || 0
  const totalSpent = budgets?.reduce((acc, b) => acc + Number(b.spent), 0) || 0
  const totalPercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="lg:pl-64 pt-16">
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Budget Planning</h1>
              <p className="text-muted-foreground mt-1">Track and manage your spending against budgets</p>
            </div>
            <Button className="gap-2 rounded-full">
              <Plus className="w-4 h-4" />
              Create Budget
            </Button>
          </div>

          {/* Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border-0 shadow-sm">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-3xl font-bold">{formatCurrency(totalBudget, currency)}</p>
              </div>
            </Card>
            <Card className="p-6 border-0 shadow-sm">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-3xl font-bold">{formatCurrency(totalSpent, currency)}</p>
              </div>
            </Card>
            <Card className="p-6 border-0 shadow-sm">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-3xl font-bold text-accent">{formatCurrency(totalBudget - totalSpent, currency)}</p>
              </div>
            </Card>
          </div>

          {/* Overall Progress */}
          <Card className="p-6 border-0 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Overall Budget Usage</h3>
                  <p className="text-sm text-muted-foreground mt-1">Total spending across all categories</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{totalPercentage}%</p>
                  <p className="text-sm text-muted-foreground">of budget used</p>
                </div>
              </div>
              <Progress value={totalPercentage} className="h-3" />
            </div>
          </Card>

          {/* Budget Categories */}
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : !budgets || budgets.length === 0 ? (
            <Card className="p-12 border-0 shadow-sm">
              <div className="flex flex-col items-center justify-center text-center">
                <TrendingUp className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-lg font-medium mb-1">No budgets found</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first budget to start tracking spending
                </p>
                <Button className="gap-2 rounded-full">
                  <Plus className="w-4 h-4" />
                  Create Budget
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {budgets.map((budget) => {
                const spent = Number(budget.spent)
                const limit = Number(budget.budget_limit)
                const percentage = limit > 0 ? Math.round((spent / limit) * 100) : 0
                const status = percentage > 100 ? "over" : percentage > 80 ? "warning" : "good"

                return (
                  <Card key={budget.id} className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{budget.category}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatCurrency(spent, currency)} of {formatCurrency(limit, currency)}
                          </p>
                        </div>
                        <div
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            status === "over"
                              ? "bg-destructive/10 text-destructive"
                              : status === "warning"
                                ? "bg-chart-4/10 text-chart-4"
                                : "bg-success/10 text-success"
                          }`}
                        >
                          {status === "over" ? (
                            <AlertCircle className="w-3 h-3" />
                          ) : status === "warning" ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                          {percentage}%
                        </div>
                      </div>
                      <Progress
                        value={percentage}
                        className={`h-2 ${status === "over" ? "[&>div]:bg-destructive" : ""}`}
                      />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Remaining</span>
                        <span className={`font-medium ${status === "over" ? "text-destructive" : "text-accent"}`}>
                          {formatCurrency(Math.abs(limit - spent), currency)}
                          {status === "over" ? " over" : ""}
                        </span>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
