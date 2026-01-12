"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign, Eye, EyeOff, Lock, Mail, User, Building2, AlertCircle, Check, ChevronDown } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    password: "",
    currency: "USD" as "USD" | "INR",
    terms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            company_name: formData.company,
            currency: formData.currency,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      if (data.user && data.session) {
        router.push("/dashboard")
        router.refresh()
      } else if (data.user && !data.session) {
        setError("Please check your email to confirm your account.")
        setLoading(false)
      }
    } catch (err) {
      console.error("Signup error:", err)
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  const currencies = [
    { value: "USD", label: "US Dollar", symbol: "$" },
    { value: "INR", label: "Indian Rupee", symbol: "₹" },
  ]

  const selectedCurrency = currencies.find(c => c.value === formData.currency)

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
          <h1 className="text-2xl font-bold">Join Finflow</h1>
          <p className="text-sm text-muted-foreground mt-1">Start managing finances in minutes</p>
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
            <div className="grid grid-cols-2 gap-3">
              {/* Name Field */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-medium">
                  Name
                </Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John"
                    className="pl-8 h-9 text-sm bg-background/50"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Company Field */}
              <div className="space-y-1.5">
                <Label htmlFor="company" className="text-xs font-medium">
                  Company
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    id="company"
                    type="text"
                    placeholder="Company"
                    className="pl-8 h-9 text-sm bg-background/50"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

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
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-8 pr-8 h-9 text-sm bg-background/50"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  minLength={8}
                  required
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

            {/* Currency Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Currency</Label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  className="w-full h-9 rounded-lg border border-input bg-background/50 px-3 text-sm flex items-center justify-between hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{selectedCurrency?.symbol}</span>
                    <span>{selectedCurrency?.label}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showCurrencyDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
                    {currencies.map((currency) => (
                      <button
                        key={currency.value}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, currency: currency.value as "USD" | "INR" })
                          setShowCurrencyDropdown(false)
                        }}
                        className="w-full px-3 py-2 text-sm flex items-center justify-between hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{currency.symbol}</span>
                          <span>{currency.label}</span>
                        </div>
                        {formData.currency === currency.value && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  className="peer sr-only"
                  checked={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                  required
                />
                <div className="w-4 h-4 rounded border border-input bg-background peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground hidden peer-checked:block" />
                </div>
              </div>
              <Label htmlFor="terms" className="text-xs font-normal cursor-pointer leading-relaxed">
                I agree to{" "}
                <Link href="/terms" className="text-primary hover:text-primary/80 underline-offset-2">
                  Terms
                </Link>{" "}
                &{" "}
                <Link href="/privacy" className="text-primary hover:text-primary/80 underline-offset-2">
                  Privacy
                </Link>
              </Label>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-10 rounded-lg text-sm font-medium bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-card text-muted-foreground">Already have an account?</span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <Link 
                href="/login" 
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center gap-1"
              >
                Sign in to your account
                <ChevronDown className="w-4 h-4 rotate-90" />
              </Link>
            </div>
          </form>
        </Card>

        {/* Security Badge - Compact */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-3 h-3 rounded-full bg-green-500/20 flex items-center justify-center">
            <Lock className="w-2 h-2 text-green-500" />
          </div>
          <span>Enterprise-grade security</span>
        </div>
      </div>
    </div>
  )
}