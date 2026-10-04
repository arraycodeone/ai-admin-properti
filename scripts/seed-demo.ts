import { createClient } from "@supabase/supabase-js";
import {
  properties,
  organizationA,
  organizationB,
  privateMarker,
} from "../src/demo/properties";
import { knowledge } from "../src/demo/knowledge";
import { demoLeads } from "../src/demo/leads";
import { demoAccounts } from "../src/demo/accounts";
import { assertSeedOrganizations, seedConfig } from "./seed-config";

let stage = "konfigurasi";
try {
  const { url, key, password } = seedConfig();
  const db = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          signal: AbortSignal.timeout(15_000),
          redirect: "error",
        }),
    },
  });

  async function upsert(table: string, values: object[], onConflict = "id") {
    stage = `seed ${table}`;
    const { error } = await db.from(table).upsert(values, { onConflict });
    if (error)
      throw new Error(
        `Seed ${table} gagal (${error.code}). Periksa migrasi dan constraint.`,
      );
  }

  stage = "pemeriksaan target";
  const existingOrganizations = await db
    .from("organizations")
    .select("id,is_demo,processing_paused");
  if (existingOrganizations.error)
    throw new Error(
      "Database belum siap. Jalankan migrasi pada proyek uji terlebih dahulu.",
    );
  assertSeedOrganizations(existingOrganizations.data);
  const users = new Map<string, string>();
  for (let page = 1; ; page++) {
    const { data, error } = await db.auth.admin.listUsers({
      page,
      perPage: 100,
    });
    if (error) throw new Error("Auth Admin tidak dapat membaca akun uji.");
    for (const user of data.users) {
      if (!demoAccounts.some((account) => account.email === user.email))
        throw new Error("Target berisi akun di luar fixture demo.");
      users.set(user.email!, user.id);
    }
    if (data.users.length < 100) break;
    if (page >= 10) throw new Error("Terlalu banyak akun untuk proyek demo.");
  }
  await upsert("organizations", [
    {
      id: organizationA,
      name: "Ruang Properti (demo)",
      slug: "ruang-properti-demo",
      is_demo: true,
      processing_paused: true,
    },
    {
      id: organizationB,
      name: "Agensi B (uji isolasi)",
      slug: "agensi-b-test",
      is_demo: true,
      processing_paused: true,
    },
  ]);
  await upsert("properties", properties);
  await upsert("knowledge_entries", knowledge);
  await upsert(
    "property_private_details",
    [
      {
        organization_id: organizationA,
        property_id: properties[0].id,
        owner_name: privateMarker,
        internal_notes: privateMarker,
      },
    ],
    "organization_id,property_id",
  );
  await upsert(
    "site_settings",
    [
      {
        organization_id: organizationA,
        brand_name: "Ruang Properti",
        headline: "Temukan ruang untuk cerita berikutnya.",
        about_text: "Agensi contoh dengan data sintetis.",
        canonical_origin: "https://ruang-properti.example",
        seo_title: "Ruang Properti",
        seo_description: "Katalog demo sintetis.",
        privacy_text:
          "Lingkungan demo. Jangan memasukkan data pelanggan nyata.",
        indexing_enabled: false,
      },
      {
        organization_id: organizationB,
        brand_name: "Agensi B",
        headline: "Uji isolasi",
        about_text: "Fixture organisasi kedua.",
        canonical_origin: "https://agensi-b.example",
        seo_title: "Uji isolasi",
        seo_description: "Data test.",
        privacy_text: "Data sintetis.",
        indexing_enabled: false,
      },
    ],
    "organization_id",
  );
  await upsert("channels", [
    {
      id: "40000000-0000-4000-8000-000000000001",
      organization_id: organizationA,
      kind: "simulator",
      label: "Simulator demo (belum aktif)",
      environment: "test",
      status: "paused",
    },
  ]);

  for (const account of demoAccounts) {
    if (!users.has(account.email)) {
      stage = "pembuatan akun demo";
      const { data, error } = await db.auth.admin.createUser({
        email: account.email,
        password,
        email_confirm: true,
      });
      if (error) throw new Error("Auth Admin gagal membuat akun demo.");
      users.set(account.email, data.user.id);
    }
    await upsert(
      "memberships",
      [
        {
          organization_id: account.org,
          user_id: users.get(account.email),
          role: account.role,
          display_name: account.display_name,
          is_active: account.active,
        },
      ],
      "organization_id,user_id",
    );
  }
  stage = "sales default";
  const { error: defaultSalesError } = await db
    .from("organizations")
    .update({ default_sales_user_id: users.get("andi@example.test") })
    .eq("id", organizationA);
  if (defaultSalesError)
    throw new Error("Gagal menetapkan sales default demo.");

  for (const [index, lead] of demoLeads.entries()) {
    const contactId = `60000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`;
    await upsert("contacts", [
      {
        id: contactId,
        organization_id: organizationA,
        display_name: lead.name,
        demo_key: `fixture:${index + 1}`,
      },
    ]);
    await upsert("leads", [
      {
        id: lead.id,
        organization_id: organizationA,
        contact_id: contactId,
        assigned_user_id: users.get(
          lead.assigned === "Andi" ? "andi@example.test" : "sari@example.test",
        ),
        stage: lead.stage,
        budget_max_rupiah: lead.budget,
        preferred_area: lead.area,
        summary: lead.summary,
        source_kind: "manual",
        min_bedrooms: 2,
        closed_at: lead.stage === "won" ? "2026-10-02T03:00:00Z" : null,
      },
    ]);
  }
  console.log(
    `Seed selesai: 2 organisasi, ${properties.length} properti, ${knowledge.length} FAQ, ${demoAccounts.length} akun, ${demoLeads.length} prospek sintetis. Password tidak diubah untuk akun yang sudah ada.`,
  );
} catch {
  console.error(
    `${stage === "konfigurasi" ? "NOT RUN" : "FAIL"}: ${stage}. Lihat docs/seed-verification.md. Kredensial dan respons layanan tidak dicetak.`,
  );
  process.exitCode = 1;
}
