"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Wallet,
  FileText,
  Settings,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/theme-context"
import { useUser } from "@/hooks/use-user"
import { useCurrency } from "@/contexts/currency-context"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/dashboard/transactions", icon: Receipt },
  { name: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
  { name: "Budget", href: "/dashboard/budget", icon: Wallet },
  { name: "Invoices", href: "/dashboard/invoices", icon: FileText },
]

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { profile, signOut } = useUser()
  const { currency, setCurrency } = useCurrency()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleCurrencyToggle = async () => {
    try {
      const newCurrency = currency === "USD" ? "INR" : "USD"
      await setCurrency(newCurrency)
    } catch (error) {
      console.error("Error changing currency:", error)
    }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r bg-card/50">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold">Finflow</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="border-t p-3 space-y-1">
          <button
            onClick={handleCurrencyToggle}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
          >
            <DollarSign className="w-5 h-5" />
            Currency: {currency}
          </button>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 border-b bg-card/95 backdrop-blur-sm">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">Finflow</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm pt-16">
          <nav className="flex flex-col p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
            <button
              onClick={() => {
                handleCurrencyToggle()
                setMobileMenuOpen(false)
              }}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
            >
              <DollarSign className="w-5 h-5" />
              Currency: {currency}
            </button>
            <Link
              href="/dashboard/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
            <button
              onClick={() => {
                handleSignOut()
                setMobileMenuOpen(false)
              }}
              className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </nav>
        </div>
      )}

      {/* Top Header for Desktop */}
      <header className="hidden lg:block fixed top-0 left-64 right-0 z-40 h-16 border-b bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between h-full px-6">
          <div>
            <h2 className="text-lg font-semibold">
              {profile?.full_name ? `Welcome, ${profile.full_name.split(" ")[0]}!` : "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>
    </>
  )
}
