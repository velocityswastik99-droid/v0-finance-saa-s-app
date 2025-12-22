// Currency utilities
export const CURRENCIES = {
  USD: { symbol: "$", name: "US Dollar", code: "USD" },
  INR: { symbol: "₹", name: "Indian Rupee", code: "INR" },
} as const

export type CurrencyCode = keyof typeof CURRENCIES

export function formatCurrency(amount: number, currency: CurrencyCode = "USD"): string {
  const currencyInfo = CURRENCIES[currency]
  return `${currencyInfo.symbol}${Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

export function formatCurrencyWithSign(amount: number, currency: CurrencyCode = "USD"): string {
  const formatted = formatCurrency(Math.abs(amount), currency)
  return amount >= 0 ? `+${formatted}` : `-${formatted}`
}
