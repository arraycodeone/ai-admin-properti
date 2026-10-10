"use client";

import { useActionState } from "react";
import { saveFaq } from "../actions";
import type { z } from "zod";
import type { faqSchema } from "../schemas";

type Faq = z.infer<typeof faqSchema>;

export function FaqForm({ entry }: { entry?: Faq }) {
  const [state, action, pending] = useActionState(saveFaq, { error: "" });
  const value = (field: string, fallback: string) => state.values?.[field] ?? fallback;
  return (
    <form key={state.attempt ?? 0} action={action} className="property-form">
      <input type="hidden" name="id" value={entry?.id ?? ""} />
      {state.error && <p role="alert" className="notice notice-error">{state.error}</p>}
      {state.success && <p role="status" className="notice">{state.success}</p>}
      <label>Pertanyaan
        <input name="question" required minLength={10} maxLength={300} defaultValue={value("question", entry?.question ?? "")} />
      </label>
      <label>Jawaban
        <textarea name="answer" required minLength={10} maxLength={4000} rows={4} defaultValue={value("answer", entry?.answer ?? "")} />
      </label>
      <label>Visibilitas
        <select name="visibility" defaultValue={value("visibility", entry?.visibility ?? "public")}>
          <option value="public">Publik</option>
          <option value="internal">Internal</option>
        </select>
      </label>
      <label className="faq-checkbox"><input type="checkbox" name="is_active" defaultChecked={value("is_active", entry?.is_active ? "on" : "") === "on"} /> Aktif</label>
      <button className="button" type="submit" disabled={pending}>{pending ? "Menyimpan…" : entry ? "Simpan perubahan" : "Tambah FAQ"}</button>
    </form>
  );
}
