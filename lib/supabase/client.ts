import { createBrowserClient as createBrowserClientSSR } from "@supabase/ssr"

let supabaseClient: ReturnType<typeof createBrowserClientSSR> | null = null

export function createBrowserClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  supabaseClient = createBrowserClientSSR(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  return supabaseClient
}

export function getSupabaseBrowserClient() {
  return createBrowserClient()
}
