const sessionId = process.env.OPEN_WA_SESSION_ID?.trim();
const apiKey = process.env.OPEN_WA_API_KEY?.trim();
const webhookSecret = process.env.OPEN_WA_WEBHOOK_SECRET?.trim();
const webhookUrl = process.env.OPEN_WA_WEBHOOK_URL?.trim();

if (!sessionId || !apiKey || !webhookSecret || !webhookUrl) {
  throw new Error("OPEN_WA_SESSION_ID, OPEN_WA_API_KEY, OPEN_WA_WEBHOOK_SECRET, dan OPEN_WA_WEBHOOK_URL wajib diisi.");
}
if (new URL(webhookUrl).protocol !== "https:") {
  throw new Error("OPEN_WA_WEBHOOK_URL harus memakai HTTPS.");
}

const config = {
  sessionId,
  host: "127.0.0.1",
  port: 8080,
  apiKey,
  plugins: ["@open-wa/integration-webhook"],
  pluginConfig: {
    webhook: {
      url: webhookUrl,
      events: ["message.received"],
      headers: { "X-Webhook-Secret": webhookSecret },
      retries: 3,
      retryDelay: 1000,
      timeout: 30000,
      durability: {
        enabled: true,
        path: ".openwa/webhook-deliveries.sqlite",
        replayLimit: 1000,
      },
    },
  },
};

export default config;
