// Server-side GA4 purchase tracking via the Measurement Protocol.
//
// Why server-side: the browser is not a reliable place to record a sale here.
//   1. Company orders are paid by invoice, off-site — the buyer never returns to
//      /order-confirmed, so a client-side event can never fire for them.
//   2. GA4 is consent-gated (see site/src/lib/consent.ts), so gtag.js does not
//      exist for visitors who decline or ignore the cookie banner.
//   3. Ad blockers drop gtag.js outright.
// Stripe's webhook sees every completed payment regardless, which makes it the
// only trustworthy source of revenue.

const MEASUREMENT_ID = "G-9S4P7SGE7G";
const ENDPOINT = "https://www.google-analytics.com/mp/collect";

export type PurchasePayload = {
  transactionId: string;
  // Major units (dollars), not Stripe's minor units (cents).
  value: number;
  currency: string;
  items: { item_id: string; item_name: string; price: number; quantity: number }[];
  // From the buyer's _ga cookie when available — without it GA cannot join the
  // sale to the session that produced it.
  clientId?: string;
  sessionId?: string;
  // Unix seconds, from the Stripe event. The Measurement Protocol accepts
  // backdating up to 72h, which covers webhook retries.
  eventAtSeconds?: number;
};

// Stripe reports amounts in the currency's minor unit. Zero-decimal currencies
// (JPY, KRW — both in ALLOWED_COUNTRY_CODES) are not divided.
const ZERO_DECIMAL = new Set(["bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga", "pyg", "rwf", "ugx", "vnd", "vuv", "xaf", "xof", "xpf"]);

export function toMajorUnits(amountMinor: number, currency: string): number {
  if (ZERO_DECIMAL.has(currency.toLowerCase())) return amountMinor;
  return Math.round(amountMinor) / 100;
}

// The _ga cookie is `GA1.1.<random>.<timestamp>`; the client_id GA4 expects is
// the trailing `<random>.<timestamp>` pair.
export function parseGaClientId(cookieValue: string | undefined): string | undefined {
  if (!cookieValue) return undefined;
  const parts = cookieValue.split(".");
  if (parts.length < 4) return undefined;
  const clientId = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
  return /^\d+\.\d+$/.test(clientId) ? clientId : undefined;
}

// GA4 requires *a* client_id. When the buyer never had a _ga cookie (consent
// declined, ad blocker) we derive a stable synthetic one from the transaction so
// webhook retries reuse it instead of inventing a new "user" each time. Such
// sales land as unattributed traffic, but the revenue is still counted — which is
// the point of moving this server-side.
function syntheticClientId(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (Math.imul(31, hash) + seed.charCodeAt(i)) | 0;
  }
  return `${Math.abs(hash)}.1`;
}

export function lineItemsToGa4(
  lines: { description?: string | null; price?: { id?: string; unit_amount?: number | null } | null; quantity?: number | null; amount?: number | null; currency?: string | null }[],
  currency: string
): PurchasePayload["items"] {
  return lines.map((line) => {
    const quantity = line.quantity ?? 1;
    const unitMinor = line.price?.unit_amount ?? (line.amount != null && quantity > 0 ? line.amount / quantity : 0);
    return {
      item_id: line.price?.id ?? "ticket",
      item_name: line.description ?? "CFO AI Nexus Ticket",
      price: toMajorUnits(unitMinor ?? 0, currency),
      quantity,
    };
  });
}

/**
 * Fires a GA4 `purchase` event. Never throws — analytics must not be able to
 * fail a webhook and trigger a Stripe retry (which would risk a duplicate
 * invoice send). Failures are logged and swallowed.
 */
export async function sendPurchase(payload: PurchasePayload, apiSecret: string): Promise<void> {
  if (!apiSecret) {
    console.warn("GA4_API_SECRET is empty — skipping purchase event");
    return;
  }

  const clientId = payload.clientId ?? syntheticClientId(payload.transactionId);
  const currency = payload.currency.toUpperCase();

  const body = {
    client_id: clientId,
    ...(payload.eventAtSeconds && { timestamp_micros: payload.eventAtSeconds * 1_000_000 }),
    non_personalized_ads: true,
    events: [
      {
        name: "purchase",
        params: {
          transaction_id: payload.transactionId,
          value: payload.value,
          currency,
          items: payload.items,
          // Attributes the sale to the buyer's original session when the _ga
          // cookie gave us one; otherwise GA opens a new session.
          ...(payload.sessionId && { session_id: payload.sessionId }),
          engagement_time_msec: 1,
        },
      },
    ],
  };

  try {
    const res = await fetch(
      `${ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${encodeURIComponent(apiSecret)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    // The collect endpoint returns 204 on success and does not validate the
    // payload. Use /debug/mp/collect when changing this file.
    if (!res.ok) {
      console.error(`GA4 purchase failed: HTTP ${res.status} for ${payload.transactionId}`);
      return;
    }
    console.log(`GA4 purchase sent: ${payload.transactionId}, ${payload.value} ${currency}, client_id ${clientId}`);
  } catch (err) {
    console.error("GA4 purchase error:", err instanceof Error ? err.message : String(err));
  }
}
