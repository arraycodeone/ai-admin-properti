"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { userClient } from "@/server/db/user-client";
import { getEnv } from "@/server/env";

export type LoginState = { error: string };

export async function login(_previous: LoginState, form: FormData): Promise<LoginState> {
  if (getEnv().APP_MODE !== "supabase") return { error: "Login belum aktif. Hubungkan Supabase untuk menggunakan akun internal." };
  const parsed = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(256) })
    .safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success) return { error: "Masukkan alamat email dan kata sandi yang valid." };
  const client = await userClient();
  const { error } = await client.auth.signInWithPassword(parsed.data);
  if (error) return { error: "Login gagal. Periksa email dan kata sandi, lalu coba lagi." };
  redirect("/app");
}

export async function logout() {
  const client = await userClient();
  const { error } = await client.auth.signOut();
  if (error) throw new Error("Logout gagal. Silakan coba kembali.");
  redirect("/login");
}
