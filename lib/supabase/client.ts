import { createBrowserClient as createBrowserClientSSR } from "@supabase/ssr"

let supabaseClient: ReturnType<typeof createBrowserClientSSR> | null = null

export function createBrowserClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.error("[v0] Missing Supabase environment variables")
    throw new Error("Supabase configuration is missing. Please check your environment variables.")
  }

  supabaseClient = createBrowserClientSSR(url, key)

  return supabaseClient
}

export function getSupabaseBrowserClient() {
  return createBrowserClient()
}
