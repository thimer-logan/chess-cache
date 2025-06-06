import type { Database } from "@/lib/types/database.types";
import { createClient as createServerClient } from "@/lib/server";
import { createClient as createBrowserClient } from "@/lib/client";

export async function getSupabase() {
  // const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (typeof window === "undefined") {
    return await createServerClient();
  }
  return createBrowserClient();
}
