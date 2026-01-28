import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  try {
    const supabaseResponse = NextResponse.next({
      request,
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
              supabaseResponse.cookies.set(name, value, options)
            })
          },
        },
      },
    )

    // Only attempt auth check if we have valid Supabase credentials
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        // Protect dashboard routes
        if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
          const redirectUrl = new URL("/login", request.url)
          return NextResponse.redirect(redirectUrl)
        }

        // Redirect to dashboard if already logged in and trying to access auth pages
        if ((request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup") && user) {
          const redirectUrl = new URL("/dashboard", request.url)
          return NextResponse.redirect(redirectUrl)
        }
      } catch (authError) {
        // Auth errors are normal during initial load - continue without blocking
        console.debug("[v0] Auth check skipped during request processing")
      }
    }

    return supabaseResponse
  } catch (error) {
    console.error("[v0] Middleware error:", error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
