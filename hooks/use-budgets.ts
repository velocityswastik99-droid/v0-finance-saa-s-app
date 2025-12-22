"use client"

import useSWR from "swr"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Budget } from "@/lib/supabase/types"
import { useEffect } from "react"

export function useBudgets() {
  const supabase = getSupabaseBrowserClient()

  const { data, error, isLoading, mutate } = useSWR<Budget[]>("budgets", async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    const { data, error } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", user.id)
      .order("category", { ascending: true })

    if (error) throw error
    return data
  })

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("budgets-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "budgets",
        },
        () => {
          mutate()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, mutate])

  return {
    budgets: data,
    isLoading,
    error,
    mutate,
  }
}
