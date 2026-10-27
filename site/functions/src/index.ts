import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import Stripe from "stripe";
import { sendPurchase, toMajorUnits, parseGaClientId, lineItemsToGa4 } from "./ga4.js";

setGlobalOptions({ maxInstances: 10 });

const stripeSecretKeyLive = defineSecret("STRIPE_SECRET_KEY");
const stripeSecretKeyTest = defineSecret("STRIPE_SECRET_KEY_TEST");
const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");
const stripeWebhookSecretLive = defineSecret("STRIPE_WEBHOOK_SECRET_LIVE");
const ga4ApiSecret = defineSecret("GA4_API_SECRET");

const ALLOWED_ORIGINS = new Set([
  "https://cfoainexus.com",
  "http://localhost:3000",
  "http://localhost:5173",
]);

const ALLOWED_PRICE_IDS = new Set([
  // Live prices
  "price_1Ty6oCEPnfyhMV5Y6KxluPuP", // Regular Ticket ($295) — currently active
  "price_1U3yXIEPnfyhMV5Yd1Cw2Vfa", // Summer Sale Ticket ($147.50)
  "price_1TCfFOEPnfyhMV5YcmQXE4pt", // Last Minute Ticket
  "price_1TCfEbEPnfyhMV5YpLrnkqNC", // Standard Ticket
  "price_1TCfEEEPnfyhMV5YJeZYTsd5", // Early Bird Ticket
  "price_1TCeutEPnfyhMV5YNm84H8M0", // Super Early Bird Ticket
  "price_1TWwZ3EPnfyhMV5YANCHcQkg", // $195 Ticket
  "price_1TFbgvEPnfyhMV5Y3iR5KJ5w", // $1 Client Testing Ticket
  // Test prices
  "price_1TF9KqEPnfyhMV5YMYdGM1zJ", // Last Minute Ticket (test)
  "price_1TF9IJEPnfyhMV5Y081B15DD", // Standard Ticket (test)
  "price_1TF9HaEPnfyhMV5YNQDEKlZ9", // Early Bird Ticket (test)
  "price_1TF9AkEPnfyhMV5YyMe6Ie9p", // Super Early Bird Ticket (test)
]);

const ALLOWED_COUNTRY_CODES = new Set([
  // Caribbean
  "AG", "BS", "BB", "KN",
  // East Asia
  "JP", "KR",
  // Europe
  "AD", "AT", "BE", "BA", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE",
  "GR", "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MT", "MC", "NL",
  "NO", "PL", "PT", "RO", "SM", "RS", "SK", "SI", "ES", "SE", "CH", "GB",
  // Middle East
  "BH", "IL", "KW", "OM", "QA", "SA", "AE",
  // North America
  "CA", "US",
  // Oceania
  "AU", "NZ",
  // Southeast Asia
  "SG",
  // Africa
  "ZA",
]);

const METADATA_LABELS: Record<string, string> = {
  type: "Purchase Type",
  fullName: "Full Name",
  workEmail: "Email",
  country: "Country",
  countryCode: "Country Code",
  quantity: "Tickets",
  jobTitle: "Job Title",
  companyName: "Company Name",
  taxId: "Tax ID / VAT",
  address: "Address",
  city: "City",
  zipCode: "Zip Code",
  // Carried through Stripe so the webhook can attribute the sale to the browsing
  // session that produced it. Absent when the buyer declined analytics cookies.
  gaClientId: "GA Client ID",
  gaSessionId: "GA Session ID",
};

function buildStringifiedMetadata(metadata: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (value !== undefined && value !== null && value !== "") {
      const label = METADATA_LABELS[key] ?? key;
      result[label] = String(value);
    }
  }
  return result;
}

function getStripeClient(isTestMode: boolean): Stripe {
  return new Stripe(isTestMode ? stripeSecretKeyTest.value() : stripeSecretKeyLive.value());
}

export const createCheckoutSession = onRequest(
  { secrets: [stripeSecretKeyLive, stripeSecretKeyTest], invoker: "public" },
  async (req, res) => {
    const isTestMode = process.env.STRIPE_MODE !== "live";
    const origin = req.headers.origin ?? "";
    if (ALLOWED_ORIGINS.has(origin)) {
      res.set("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    // Block by actual IP location — Google Cloud injects this header automatically
    const ipCountry = (req.headers["x-appengine-country"] as string | undefined)?.toUpperCase();
    if (ipCountry && ipCountry !== "ZZ" && !ALLOWED_COUNTRY_CODES.has(ipCountry)) {
      res.status(403).json({ error: "Tickets are not available in your region" });
      return;
    }

    const { priceId, quantity = 1, metadata } = req.body as { priceId: string; quantity?: number; metadata?: Record<string, unknown> };

    if (!priceId || !ALLOWED_PRICE_IDS.has(priceId)) {
      res.status(400).json({ error: "Invalid price ID" });
      return;
    }

    const countryCode = metadata?.countryCode as string | undefined;
    if (countryCode && !ALLOWED_COUNTRY_CODES.has(countryCode)) {
      res.status(403).json({ error: "Tickets are not available in your region" });
      return;
    }

    try {
      const stringifiedMetadata = metadata ? buildStringifiedMetadata(metadata) : {};
      const receiptEmail = metadata?.workEmail as string | undefined;
      const isCompany = metadata?.type === "company";

      const stripe = getStripeClient(isTestMode);

      const companyInvoiceFields = isCompany ? [
        { name: "Company", value: (stringifiedMetadata["Company Name"] ?? "").slice(0, 200) },
        { name: "Tax ID / VAT", value: (stringifiedMetadata["Tax ID / VAT"] ?? "").slice(0, 200) },
        { name: "Address", value: [stringifiedMetadata["Address"], stringifiedMetadata["City"], stringifiedMetadata["Zip Code"]].filter(Boolean).join(", ").slice(0, 200) },
        { name: "Country", value: (stringifiedMetadata["Country"] ?? "").slice(0, 200) },
      ].filter((f) => f.value) as { name: string; value: string }[] : [];

      const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        customer_email: receiptEmail,
        line_items: [{ price: priceId, quantity: Math.max(1, Math.floor(quantity)) }],
        mode: "payment",
        automatic_tax: { enabled: true },
        return_url: `https://cfoainexus.com/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,
        allow_promotion_codes: true,
        metadata: stringifiedMetadata,
        payment_intent_data: { metadata: stringifiedMetadata, receipt_email: receiptEmail },
        ...(isCompany && {
          invoice_creation: {
            enabled: true,
            invoice_data: {
              description: "CFO AI Nexus Conference — Ticket Purchase",
              custom_fields: companyInvoiceFields,
              metadata: stringifiedMetadata,
            },
          },
        }),
      });

      res.json({ clientSecret: session.client_secret });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Stripe error:", message);
      res.status(500).json({ error: "Failed to create checkout session", detail: message });
    }
  }
);

// GA client/session ids ride through Stripe metadata. Both are optional — a buyer
// who declined analytics cookies has no _ga cookie to read.
function gaIdsFrom(metadata: Stripe.Metadata | null | undefined) {
  return {
    clientId: parseGaClientId(metadata?.["GA Client ID"]),
    sessionId: metadata?.["GA Session ID"] || undefined,
  };
}

export const stripeWebhook = onRequest(
  { secrets: [stripeSecretKeyLive, stripeSecretKeyTest, stripeWebhookSecret, stripeWebhookSecretLive, ga4ApiSecret], invoker: "public" },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const sig = req.headers["stripe-signature"] as string;
    const isTestMode = process.env.STRIPE_MODE !== "live";
    const stripe = getStripeClient(isTestMode);

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        isTestMode ? stripeWebhookSecret.value() : stripeWebhookSecretLive.value()
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Webhook signature verification failed:", message);
      res.status(400).send(`Webhook Error: ${message}`);
      return;
    }

    console.log(`Webhook received: ${event.type}, livemode: ${event.livemode}`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const purchaseType = session.metadata?.["Purchase Type"];

      console.log(`Session ${session.id}, purchaseType: ${purchaseType}, invoice: ${session.invoice}`);

      if (purchaseType === "company" && session.invoice) {
        try {
          await stripe.invoices.sendInvoice(session.invoice as string);
          console.log(`Invoice sent for session ${session.id}`);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          console.error("Failed to send invoice:", message);
        }
      }

      // Every order, company or not: `mode: "payment"` always collects at checkout,
      // and `invoice_creation` only attaches an invoice document to an
      // already-paid session. `payment_status` is the authority on whether money
      // actually moved, so branch on that rather than on the purchase type.
      if (session.payment_status === "paid") {
        const currency = session.currency ?? "usd";
        let items: ReturnType<typeof lineItemsToGa4> = [];
        try {
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
          items = lineItemsToGa4(lineItems.data, currency);
        } catch (err) {
          // An itemless purchase still carries correct revenue; don't lose the sale over this.
          console.error("Could not list line items:", err instanceof Error ? err.message : String(err));
        }

        await sendPurchase(
          {
            transactionId: session.id,
            value: toMajorUnits(session.amount_total ?? 0, currency),
            currency,
            items,
            eventAtSeconds: event.created,
            ...gaIdsFrom(session.metadata),
          },
          ga4ApiSecret.value()
        );
      }
    }

    // Safety net for true pay-later invoices — ones billed out of band rather than
    // collected at checkout. Invoices produced by a Checkout Session are
    // `charge_automatically` and were already counted above, so restricting this to
    // `send_invoice` is what keeps the two paths from double-counting the same sale.
    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;
      const currency = invoice.currency ?? "usd";

      if (invoice.collection_method !== "send_invoice") {
        console.log(`Invoice ${invoice.id} already counted via its checkout session — skipping`);
        res.json({ received: true });
        return;
      }

      console.log(`Invoice ${invoice.id} paid, amount: ${invoice.amount_paid} ${currency}`);

      const items = lineItemsToGa4(
        (invoice.lines?.data ?? []).map((line) => ({
          description: line.description,
          quantity: line.quantity,
          amount: line.amount,
          currency: line.currency,
        })),
        currency
      );

      await sendPurchase(
        {
          // The invoice id, not the checkout session id — the card branch above
          // already owns session ids, so the two paths can never collide.
          transactionId: invoice.id ?? `invoice_${event.id}`,
          value: toMajorUnits(invoice.amount_paid ?? 0, currency),
          currency,
          items,
          eventAtSeconds: event.created,
          ...gaIdsFrom(invoice.metadata),
        },
        ga4ApiSecret.value()
      );
    }

    res.json({ received: true });
  }
);
