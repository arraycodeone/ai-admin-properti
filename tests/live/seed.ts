import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import pg from "pg";
import { seedConfig, assertSeedOrganizations } from "../../scripts/seed-config";
import { demoAccounts } from "../../src/demo/accounts";
import { organizationA, properties } from "../../src/demo/properties";
import { demoLeads } from "../../src/demo/leads";
import { knowledge } from "../../src/demo/knowledge";

let database: pg.Client | undefined;
let stage = "konfigurasi";
const expected = {
  organizations: 2,
  properties: properties.length,
  knowledge_entries: knowledge.length,
  memberships: 5,
  contacts: 4,
  leads: 4,
  site_settings: 2,
  channels: 1,
  property_private_details: 1,
};

try {
  const config = seedConfig();
  assert.equal(process.argv.length, 2);
  database = new pg.Client(config.database);
  stage = "pemeriksaan target";
  await database.connect();
  const organizations = await database.query(
    "select id,is_demo,processing_paused from public.organizations",
  );
  assertSeedOrganizations(organizations.rows);
  const accounts = await database.query("select email from auth.users");
  assert.ok(
    accounts.rows.every((user) =>
      demoAccounts.some((account) => account.email === user.email),
    ),
  );

  async function counts() {
    const result: Record<string, number> = {};
    for (const table of Object.keys(expected)) {
      const { rows } = await database!.query(
        `select count(*)::int as n from public.${table}`,
      );
      result[table] = rows[0].n;
    }
    const { rows } = await database!.query(
      "select count(*)::int as n from auth.users",
    );
    return { ...result, accounts: rows[0].n };
  }
  console.log(`BEFORE: ${JSON.stringify(await counts())}`);
  // Hashes remain inside PostgreSQL and are never returned to the runner or logs.
  await database.query(
    "create temporary table seed_passwords_before as select id, encrypted_password from auth.users",
  );
  let firstMemberships: unknown;
  for (const attempt of [1, 2]) {
    stage = `seed ke-${attempt}`;
    const result = spawnSync(
      process.execPath,
      ["--import", "tsx", "scripts/seed-demo.ts"],
      {
        cwd: process.cwd(),
        encoding: "utf8",
        timeout: 180_000,
        env: {
          ...process.env,
          DEMO_SEED_PASSWORD:
            attempt === 1
              ? config.password
              : `${randomBytes(32).toString("base64url")}aA1!`,
        },
      },
    );
    assert.equal(result.error, undefined);
    assert.equal(
      result.status,
      0,
      "Seed gagal; lihat panduan pemulihan tanpa mencetak respons child.",
    );
    stage = `verifikasi seed ke-${attempt}`;
    const actual = await counts();
    assert.deepEqual(actual, { ...expected, accounts: demoAccounts.length });
    for (const [table, ids] of [
      ["properties", properties.map((row) => row.id)],
      ["leads", demoLeads.map((row) => row.id)],
      ["knowledge_entries", knowledge.map((row) => row.id)],
    ] as const) {
      const records: pg.QueryResult<{ id: string }> = await database.query(`select id from public.${table}`);
      assert.deepEqual(records.rows.map((row) => row.id).sort(), [...ids].sort());
    }
    const memberships: pg.QueryResult<{ organization_id: string; user_id: string; role: string; is_active: boolean; email: string }> =
      await database.query(`select m.organization_id, m.user_id, m.role, m.is_active, u.email
      from public.memberships m join auth.users u on u.id = m.user_id order by u.email`);
    for (const account of demoAccounts) {
      const row = memberships.rows.find((row) => row.email === account.email);
      assert.ok(row);
      assert.equal(row.organization_id, account.org);
      assert.equal(row.role, account.role);
      assert.equal(row.is_active, account.active);
    }
    if (attempt === 1) firstMemberships = memberships.rows;
    else assert.deepEqual(memberships.rows, firstMemberships);
    const defaults: pg.QueryResult<{ email: string }> = await database.query(
      `select u.email from public.organizations o
      join auth.users u on u.id = o.default_sales_user_id where o.id = $1`,
      [organizationA],
    );
    assert.deepEqual(defaults.rows, [{ email: "andi@example.test" }]);
    const identity: pg.QueryResult<{ name: string; slug: string; brand_name: string }> = await database.query(
      `select o.name,o.slug,s.brand_name from public.organizations o
       join public.site_settings s on s.organization_id=o.id where o.id=$1`, [organizationA],
    );
    assert.deepEqual(identity.rows, [{ name: "Nusa Property (demo)", slug: "nusa-property-demo", brand_name: "Nusa Property" }]);
    const assignments: pg.QueryResult<{ id: string; organization_id: string; stage: string; budget: string; preferred_area: string; email: string }> =
      await database.query(`select l.id, l.organization_id, l.stage, l.budget_max_rupiah::text as budget, l.preferred_area,
      u.email from public.leads l join auth.users u on u.id = l.assigned_user_id`);
    for (const lead of demoLeads) {
      assert.deepEqual(
        assignments.rows.find((row) => row.id === lead.id),
        {
          id: lead.id,
          organization_id: lead.organization_id,
          stage: lead.stage,
          budget: lead.budget,
          preferred_area: lead.area,
          email:
            lead.assigned === "Andi"
              ? "andi@example.test"
              : "sari@example.test",
        },
      );
    }
    const passwordChanges: pg.QueryResult<{ n: number }> =
      await database.query(`select count(*)::int as n from seed_passwords_before b
      left join auth.users u on u.id = b.id where u.id is null or u.encrypted_password is distinct from b.encrypted_password`);
    assert.equal(passwordChanges.rows[0].n, 0);
    if (attempt === 1) {
      await database.query("truncate seed_passwords_before");
      await database.query(
        "insert into seed_passwords_before select id,encrypted_password from auth.users",
      );
    }
    console.log(
      `PASS ke-${attempt}: ${JSON.stringify(actual)}; membership, assignment dan password lama terjaga.`,
    );
  }
  console.log(
    "Fixture demo tersimpan. Lanjutkan test:db dan pengujian sesi browser pada issue berikutnya.",
  );
} catch {
  console.error(
    `${stage === "konfigurasi" ? "NOT RUN" : "FAIL"}: ${stage}. Lihat docs/seed-verification.md; secret dan output child tidak dicetak.`,
  );
  process.exitCode = 1;
} finally {
  await database?.end().catch(() => {});
}
