export type WebhookRecordStatus = "received" | "processed" | "failed" | "ignored";

export type SeenWebhook = {
  provider: string;
  providerEventId: string;
  status: WebhookRecordStatus;
};

export function webhookKey(provider: string, providerEventId: string) {
  return `${provider}:${providerEventId}`;
}

/** First delivery wins. Duplicates are acknowledged without re-applying side effects. */
export function resolveWebhookDelivery(
  existing: SeenWebhook | undefined,
  incoming: Pick<SeenWebhook, "provider" | "providerEventId">,
): "process" | "duplicate" {
  if (!existing) return "process";
  if (
    webhookKey(existing.provider, existing.providerEventId) !==
    webhookKey(incoming.provider, incoming.providerEventId)
  ) {
    return "process";
  }
  return "duplicate";
}
