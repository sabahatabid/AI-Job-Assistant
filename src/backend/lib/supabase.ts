import { createBrowserClient, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function isValidSupabaseConfig(url?: string, key?: string): boolean {
  return (
    !!url &&
    !!key &&
    url.startsWith("http") &&
    !url.includes("your_supabase") &&
    !key.includes("your_supabase")
  );
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isValidSupabaseConfig(url, anonKey)) {
    return null;
  }

  return createBrowserClient(url!, anonKey!);
}

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isValidSupabaseConfig(url, anonKey)) {
    return null;
  }

  return createServerClient(url!, anonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      },
    },
  });
}
