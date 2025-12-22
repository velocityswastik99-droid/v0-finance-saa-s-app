"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { CurrencyCode } from "@/lib/currency"

interface CurrencyContextType {
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => Promise<void>
  isLoading: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUserCurrency()
  }, [])

  async function loadUserCurrency() {
    try {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase.from("profiles").select("currency").eq("id", user.id).single()

        if (profile?.currency) {
          setCurrencyState(profile.currency as CurrencyCode)
        }
      }
    } catch (error) {
      console.error("Error loading currency:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function setCurrency(newCurrency: CurrencyCode) {
    try {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { error } = await supabase.from("profiles").update({ currency: newCurrency }).eq("id", user.id)

        if (error) throw error

        setCurrencyState(newCurrency)
      }
    } catch (error) {
      console.error("Error updating currency:", error)
      throw error
    }
  }

  return <CurrencyContext.Provider value={{ currency, setCurrency, isLoading }}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider")
  }
  return context
}
