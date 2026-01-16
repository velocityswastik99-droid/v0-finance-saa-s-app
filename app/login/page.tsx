"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign, Eye, EyeOff, Lock, Mail, AlertCircle, Check, ArrowRight } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. Please check your credentials.")
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("Please confirm your email address. Check your inbox.")
        } else {
          setError(signInError.message)
        }
        setLoading(false)
        return
      }

      if (data.user) {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="w-full max-w-md">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Finflow</span>
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to continue to your finflow</p>
        </div>

        {/* Compact Card */}
        <Card className="p-6 shadow-xl border border-border/50 backdrop-blur-sm bg-card/95">
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="pl-8 h-9 text-sm bg-background/50"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium">
                  Password
                </Label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs text-primary hover:text-primary/80 transition-colors hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-8 pr-8 h-9 text-sm bg-background/50"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="peer sr-only"
                  checked={formData.remember}
                  onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                />
                <div className="w-4 h-4 rounded border border-input bg-background peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground hidden peer-checked:block" />
                </div>
              </div>
              <Label htmlFor="remember" className="text-xs font-normal cursor-pointer">
                Remember for 30 days
              </Label>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-10 rounded-lg text-sm font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-card text-muted-foreground">New to Finflow?</span>
              </div>
            </div>

            {/* Signup Link */}
            <div className="text-center">
              <Link 
                href="/signup" 
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center gap-1 group"
              >
                Create an account
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </form>
        </Card>

        {/* Security Badge - Compact */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-green-500/20 flex items-center justify-center">
            <Lock className="w-2 h-2 text-green-500" />
          </div>
          <span>Bank-grade 256-bit encryption</span>
        </div>

        {/* Demo Credentials Hint */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            For demo, use any email & password (8+ chars) -{" "}
            <span className="text-primary">no verification needed</span>
          </p>
        </div>
      </div>
    </div>
  )
}