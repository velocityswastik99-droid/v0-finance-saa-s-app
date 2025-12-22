"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Transaction } from "@/lib/supabase/types"

interface DashboardStats {
  totalRevenue: number
  cashFlow: number
  totalExpenses: number
  outstanding: number
  revenueChange: number
  cashFlowChange: number
  expensesChange: number
  outstandingCount: number
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchStats()

    // Real-time updates
    const supabase = getSupabaseBrowserClient()
    const channel = supabase
      .channel("stats_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, () => {
        fetchStats()
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "invoices" }, () => {
        fetchStats()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchStats() {
    try {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setIsLoading(false)
        return
      }

      // Fetch all transactions
      const { data: transactions } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "completed")

      // Fetch pending invoices
      const { data: invoices } = await supabase
        .from("invoices")
        .select("amount")
        .eq("user_id", user.id)
        .in("status", ["sent", "overdue"])

      if (transactions) {
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

        // Current month calculations
        const currentMonthTxns = transactions.filter((t: Transaction) => {
          const date = new Date(t.date)
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear
        })

        const lastMonthTxns = transactions.filter((t: Transaction) => {
          const date = new Date(t.date)
          return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear
        })

        const currentRevenue = currentMonthTxns
          .filter((t: Transaction) => t.type === "income")
          .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0)

        const currentExpenses = currentMonthTxns
          .filter((t: Transaction) => t.type === "expense")
          .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0)

        const lastRevenue = lastMonthTxns
          .filter((t: Transaction) => t.type === "income")
          .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0)

        const lastExpenses = lastMonthTxns
          .filter((t: Transaction) => t.type === "expense")
          .reduce((sum: number, t: Transaction) => sum + Number(t.amount), 0)

        const currentCashFlow = currentRevenue - currentExpenses
        const lastCashFlow = lastRevenue - lastExpenses

        const outstandingAmount = invoices?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0

        setStats({
          totalRevenue: currentRevenue,
          cashFlow: currentCashFlow,
          totalExpenses: currentExpenses,
          outstanding: outstandingAmount,
          revenueChange: lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0,
          cashFlowChange: lastCashFlow > 0 ? ((currentCashFlow - lastCashFlow) / lastCashFlow) * 100 : 0,
          expensesChange: lastExpenses > 0 ? ((currentExpenses - lastExpenses) / lastExpenses) * 100 : 0,
          outstandingCount: invoices?.length || 0,
        })
      }

      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch stats"))
    } finally {
      setIsLoading(false)
    }
  }

  return { stats, isLoading, error, refetch: fetchStats }
}
