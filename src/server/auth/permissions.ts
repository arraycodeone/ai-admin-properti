export type Actor = { userId: string; organizationId: string; role: "owner" | "sales"; displayName: string };

export function requireOwner(actor: Actor) {
  if (actor.role !== "owner") throw new Error("Tindakan ini hanya tersedia untuk owner.");
}

export function canReadLead(actor: Actor, lead: { organization_id: string; assigned_user_id: string | null }) {
  return actor.organizationId === lead.organization_id && (actor.role === "owner" || actor.userId === lead.assigned_user_id);
}
