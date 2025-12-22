"use client"

import useSWR from "swr"
import { createBrowserClient } from "@/lib/supabase/client"
import type { Invoice } from "@/lib/supabase/types"
import { useEffect } from "react"

export function useInvoices() {
  const supabase = createBrowserClient()

  const { data, error, isLoading, mutate } = useSWR<Invoice[]>("invoices", async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  })

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("invoices-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "invoices",
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
    invoices: data,
    isLoading,
    error,
    mutate,
  }
}
