// Database types
export interface Profile {
  id: string
  full_name: string
  company_name: string | null
  currency: "USD" | "INR"
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  name: string
  description: string | null
  amount: number
  type: "income" | "expense"
  category: string
  date: string
  status: "completed" | "pending" | "cancelled"
  created_at: string
  updated_at: string
}

export interface Budget {
  id: string
  user_id: string
  category: string
  amount: number
  period: "weekly" | "monthly" | "yearly"
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  user_id: string
  invoice_number: string
  client_name: string
  client_email: string | null
  amount: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  issue_date: string
  due_date: string
  description: string | null
  created_at: string
  updated_at: string
}
