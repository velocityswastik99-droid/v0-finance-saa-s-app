import type React from "react"
import { CurrencyProvider } from "@/contexts/currency-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CurrencyProvider>{children}</CurrencyProvider>
}
