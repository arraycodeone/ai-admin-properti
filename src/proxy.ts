import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { parseConfig } from "@/server/config";

export async function proxy(request: NextRequest) {
  const env = parseConfig(process.env);
  let response = NextResponse.next({ request });
  response.headers.set("Cache-Control", "private, no-store");
  if (env.APP_MODE !== "supabase") return response;
  const client = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL!, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(values) {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        response.headers.set("Cache-Control", "private, no-store");
        values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  await client.auth.getUser();
  return response;
}

export const config = { matcher: ["/app/:path*", "/login", "/auth/:path*", "/api/internal/:path*"] };
