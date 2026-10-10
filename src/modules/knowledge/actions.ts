"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireActor } from "@/server/auth/actor-context";
import { requireOwner } from "@/server/auth/permissions";
import { userClient } from "@/server/db/user-client";
import { faqInputSchema } from "./schemas";

export type SaveFaqState = { error: string; success?: string; values?: Record<string, string>; attempt?: number };

export async function saveFaq(previous: SaveFaqState, form: FormData): Promise<SaveFaqState> {
  const actor = await requireActor();
  requireOwner(actor);
  const values = Object.fromEntries(["id", "question", "answer", "visibility", "is_active"].map(field => [
    field, typeof form.get(field) === "string" ? String(form.get(field)) : "",
  ]));
  const attempt = (previous.attempt ?? 0) + 1;
  const fail = (error: string): SaveFaqState => ({ error, values, attempt });
  const id = values.id ? z.string().uuid().safeParse(values.id) : null;
  if (id && !id.success) return fail("ID FAQ tidak valid.");
  const parsed = faqInputSchema.safeParse({
    question: values.question, answer: values.answer,
    visibility: values.visibility, is_active: values.is_active === "on",
  });
  if (!parsed.success) return fail("Pertanyaan harus 10–300 karakter, jawaban 10–4000 karakter, dan visibilitas harus valid.");

  const { data, error } = await (await userClient()).rpc("save_knowledge_entry", {
    p_organization_id: actor.organizationId, p_entry_id: id?.data ?? null,
    p_question: parsed.data.question, p_answer: parsed.data.answer,
    p_visibility: parsed.data.visibility, p_is_active: parsed.data.is_active,
  });
  if (error) {
    if (error.code === "P0002") return fail("FAQ tidak ditemukan pada organisasi ini.");
    if (error.code === "22023") return fail("Periksa kembali isi FAQ.");
    return fail("FAQ belum dapat disimpan. Silakan coba lagi.");
  }
  if (typeof data !== "string") return fail("Penyimpanan FAQ belum dapat dipastikan.");
  revalidatePath("/app/faq");
  revalidatePath("/tentang");
  return { error: "", success: "FAQ tersimpan.", attempt };
}
