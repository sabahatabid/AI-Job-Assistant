import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isValid =
  !!supabaseUrl &&
  !!supabaseAnonKey &&
  supabaseUrl.startsWith("http") &&
  !supabaseUrl.includes("your_supabase") &&
  !supabaseAnonKey.includes("your_supabase");

export const supabase = isValid
  ? createBrowserClient(supabaseUrl!, supabaseAnonKey!)
  : null;
