"use client"

import { useEffect, useState, useCallback } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export interface UserProfile {
  id: string
  full_name: string | null
  email: string
  company_name: string | null
  currency: string
  created_at: string
}

interface UseUserReturn {
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  error: Error | null
  signOut: () => Promise<void>
  refetch: () => Promise<void>
  isAuthenticated: boolean
  isProfileLoading: boolean
  profileError: Error | null
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<Error | null>(null)

  const loadProfile = useCallback(async (userId: string) => {
    setIsProfileLoading(true)
    setProfileError(null)
    
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (profileError) {
        // Handle specific error cases
        if (profileError.code === "PGRST116") {
          // Profile not found - this might be expected for new users
          console.warn("Profile not found for user:", userId)
          setProfile(null)
        } else {
          // Create a proper error object with all available info
          const error = new Error(
            `Failed to load profile: ${profileError.message || "Unknown error"}`
          )
          error.name = "ProfileLoadError"
          ;(error as any).code = profileError.code
          ;(error as any).details = profileError.details
          ;(error as any).hint = profileError.hint
          throw error
        }
      } else {
        setProfile(data)
      }
    } catch (err) {
      // Better error logging
      if (err instanceof Error) {
        console.error("Error loading profile:", {
          message: err.message,
          name: err.name,
          stack: err.stack,
          code: (err as any).code,
          details: (err as any).details
        })
        setProfileError(err)
      } else {
        // Handle non-Error objects
        const errorObj = new Error(
          typeof err === "object" 
            ? JSON.stringify(err, null, 2) 
            : String(err)
        )
        errorObj.name = "UnknownProfileError"
        console.error("Unknown error loading profile:", errorObj)
        setProfileError(errorObj)
      }
    } finally {
      setIsProfileLoading(false)
    }
  }, [])

  const loadUser = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setProfileError(null)
    
    try {
      const supabase = getSupabaseBrowserClient()
      const {
        data: { user: authUser },
        error: authError
      } = await supabase.auth.getUser()

      if (authError) {
        throw authError
      }

      if (authUser) {
        setUser(authUser)
        await loadProfile(authUser.id)
      } else {
        setUser(null)
        setProfile(null)
      }
    } catch (err) {
      let error: Error
      
      if (err instanceof Error) {
        error = err
      } else if (typeof err === "object" && err !== null) {
        // Handle Supabase PostgrestError or similar
        const errObj = err as any
        error = new Error(errObj.message || "Failed to load user")
        error.name = errObj.name || "AuthError"
        ;(error as any).code = errObj.code
        ;(error as any).details = errObj.details
      } else {
        error = new Error("Failed to load user")
      }
      
      setError(error)
      console.error("Error in loadUser:", {
        message: error.message,
        name: error.name,
        code: (error as any).code,
        details: (error as any).details
      })
      
      // Clear user state on auth error
      setUser(null)
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }, [loadProfile])

  useEffect(() => {
    let mounted = true
    let subscription: { unsubscribe: () => void } | null = null

    const init = async () => {
      if (mounted) {
        await loadUser()
        
        // Set up auth listener
        const supabase = getSupabaseBrowserClient()
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          if (mounted) {
            if (session?.user) {
              setUser(session.user)
              loadProfile(session.user.id)
            } else {
              setUser(null)
              setProfile(null)
            }
          }
        })
        
        subscription = data.subscription
      }
    }

    init()

    return () => {
      mounted = false
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [loadUser, loadProfile])

  const signOut = useCallback(async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      await supabase.auth.signOut()
      // Clear local state immediately
      setUser(null)
      setProfile(null)
      // Redirect after state is cleared
      window.location.href = "/login"
    } catch (err) {
      const error = err instanceof Error 
        ? err 
        : new Error(typeof err === "object" ? JSON.stringify(err) : String(err))
      console.error("Error signing out:", {
        message: error.message,
        name: error.name,
        stack: error.stack
      })
      throw error
    }
  }, [])

  return {
    user,
    profile,
    isLoading,
    error,
    signOut,
    refetch: loadUser,
    isAuthenticated: !!user,
    isProfileLoading,
    profileError
  }
}