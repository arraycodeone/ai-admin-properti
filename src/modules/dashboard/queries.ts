import "server-only";
import { requireActor } from "@/server/auth/actor-context";
import { userClient } from "@/server/db/user-client";

export async function getDashboardSummary() {
  const actor = await requireActor();
  const db = await userClient();
  const now = new Date().toISOString();

  // shortcut: manual fixture leads lack provenance; include them after the lead editor marks real entries.
  let newLeads = db.from("leads").select("id", { count: "exact", head: true })
    .eq("organization_id", actor.organizationId).eq("stage", "new")
    .in("source_kind", ["website_message", "whatsapp_direct"]);
  let overdueTasks = db.from("tasks").select("id", { count: "exact", head: true })
    .eq("organization_id", actor.organizationId).eq("status", "open").lt("due_at", now);
  let upcomingSurveys = db.from("surveys").select("id", { count: "exact", head: true })
    .eq("organization_id", actor.organizationId).in("status", ["requested", "confirmed"]).gte("starts_at", now);
  let taskList = db.from("tasks").select("id,title,due_at,kind")
    .eq("organization_id", actor.organizationId).eq("status", "open").order("due_at").limit(5);
  if (actor.role === "sales") {
    newLeads = newLeads.eq("assigned_user_id", actor.userId);
    overdueTasks = overdueTasks.eq("assigned_user_id", actor.userId);
    upcomingSurveys = upcomingSurveys.eq("agent_user_id", actor.userId);
    taskList = taskList.eq("assigned_user_id", actor.userId);
  }

  const [listings, leads, handoffs, tasks, surveys, nextTasks] = await Promise.all([
    db.from("properties").select("id", { count: "exact", head: true }).eq("organization_id", actor.organizationId),
    newLeads,
    db.from("conversations").select("id", { count: "exact", head: true })
      .eq("organization_id", actor.organizationId).eq("status", "open").eq("handoff_status", "requested"),
    overdueTasks,
    upcomingSurveys,
    taskList,
  ]);

  if ([listings, leads, handoffs, tasks, surveys, nextTasks].some(result => result.error)) {
    throw new Error("Ringkasan belum dapat dimuat.");
  }

  return {
    actor,
    listingCount: listings.count ?? 0,
    newLeadCount: leads.count ?? 0,
    handoffCount: handoffs.count ?? 0,
    overdueTaskCount: tasks.count ?? 0,
    upcomingSurveyCount: surveys.count ?? 0,
    nextTasks: nextTasks.data ?? [],
  };
}
