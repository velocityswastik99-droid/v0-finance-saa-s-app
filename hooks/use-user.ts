"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface UserProfile {
  id: string
  full_name: string | null
  email: string
  company_name: string | null
  currency: string
  created_at: string
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadUser()

    // Listen for auth changes
    const supabase = getSupabaseBrowserClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        loadProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function loadUser() {
    try {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (authUser) {
        setUser(authUser)
        await loadProfile(authUser.id)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load user"))
    } finally {
      setIsLoading(false)
    }
  }

  async function loadProfile(userId: string) {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error: profileError } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (profileError) throw profileError
      setProfile(data)
    } catch (err) {
      console.error("Error loading profile:", err)
    }
  }

  async function signOut() {
    try {
      const supabase = getSupabaseBrowserClient()
      await supabase.auth.signOut()
      window.location.href = "/login"
    } catch (err) {
      console.error("Error signing out:", err)
      throw err
    }
  }

  return { user, profile, isLoading, error, signOut, refetch: loadUser }
}
