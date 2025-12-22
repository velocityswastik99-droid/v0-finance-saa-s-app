"use client"

import { DashboardNav } from "@/components/dashboard-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Plus, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react"

const budgets = [
  { category: "Operations", budget: 35000, spent: 32000, percentage: 91, status: "good" },
  { category: "Marketing", budget: 20000, spent: 18000, percentage: 90, status: "good" },
  { category: "Salaries", budget: 50000, spent: 45000, percentage: 90, status: "good" },
  { category: "Technology", budget: 15000, spent: 15800, percentage: 105, status: "over" },
  { category: "Travel", budget: 10000, spent: 6200, percentage: 62, status: "good" },
  { category: "Office", budget: 8000, spent: 5400, percentage: 68, status: "good" },
]

const totalBudget = budgets.reduce((acc, b) => acc + b.budget, 0)
const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0)
const totalPercentage = Math.round((totalSpent / totalBudget) * 100)

export default function BudgetPage() {
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
                <p className="text-3xl font-bold">${totalBudget.toLocaleString()}</p>
              </div>
            </Card>
            <Card className="p-6 border-0 shadow-sm">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-3xl font-bold">${totalSpent.toLocaleString()}</p>
              </div>
            </Card>
            <Card className="p-6 border-0 shadow-sm">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-3xl font-bold text-accent">${(totalBudget - totalSpent).toLocaleString()}</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {budgets.map((budget, i) => (
              <Card key={i} className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{budget.category}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        ${budget.spent.toLocaleString()} of ${budget.budget.toLocaleString()}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        budget.status === "over"
                          ? "bg-destructive/10 text-destructive"
                          : budget.percentage > 80
                            ? "bg-chart-4/10 text-chart-4"
                            : "bg-success/10 text-success"
                      }`}
                    >
                      {budget.status === "over" ? (
                        <AlertCircle className="w-3 h-3" />
                      ) : budget.percentage > 80 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      {budget.percentage}%
                    </div>
                  </div>
                  <Progress
                    value={budget.percentage}
                    className={`h-2 ${budget.status === "over" ? "[&>div]:bg-destructive" : ""}`}
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Remaining</span>
                    <span className={`font-medium ${budget.status === "over" ? "text-destructive" : "text-accent"}`}>
                      ${Math.abs(budget.budget - budget.spent).toLocaleString()}
                      {budget.status === "over" ? " over" : ""}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Recommendations */}
          <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-accent/5 to-transparent">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Budget Insights</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Technology budget exceeded by $800. Consider adjusting next month's allocation.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Travel expenses are well under budget. You have $3,800 available for business trips.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Overall budget performance is excellent at 92% utilization with the month complete.</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
