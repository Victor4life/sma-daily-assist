import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("[v0] Supabase client init - URL available:", !!url, "Key available:", !!key)

  if (!url || !key) {
    throw new Error(
      "Missing Supabase credentials. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your environment variables. Check the 'Vars' section in the sidebar.",
    )
  }

  return createBrowserClient(url, key)
}
