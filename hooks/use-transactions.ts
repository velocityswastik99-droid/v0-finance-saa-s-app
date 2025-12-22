"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Transaction } from "@/lib/supabase/types"

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetchTransactions()

    // Set up real-time subscription
    const supabase = getSupabaseBrowserClient()
    const channel = supabase
      .channel("transactions_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, () => {
        fetchTransactions()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchTransactions() {
    try {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setTransactions([])
        setIsLoading(false)
        return
      }

      const { data, error: fetchError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })

      if (fetchError) throw fetchError

      setTransactions(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch transactions"))
    } finally {
      setIsLoading(false)
    }
  }

  return { transactions, isLoading, error, refetch: fetchTransactions }
}
