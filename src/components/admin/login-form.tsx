"use client";

import { useActionState } from "react";
import { login } from "@/server/auth/session";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: "" });
  return <form action={action} className="login-form"><label>Email<input name="email" type="email" autoComplete="username" required maxLength={254}/></label><label>Kata sandi<input name="password" type="password" autoComplete="current-password" required maxLength={256}/></label>{state.error && <p role="alert" className="notice notice-error">{state.error}</p>}<button className="button" type="submit" disabled={pending}>{pending ? "Memeriksa akun…" : "Masuk ke dashboard"}</button></form>;
}
