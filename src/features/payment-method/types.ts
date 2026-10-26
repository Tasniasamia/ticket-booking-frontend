type Raw = Record<string, unknown>;

// Backend: internal/payment (PaymentMethod). Code backend এ এখন শুধু stripe আর sslcommerz মানে।
export const PAYMENT_CODES = [
  { value: "stripe", label: "Stripe" },
  { value: "sslcommerz", label: "SSLCommerz" },
  { value: "razorpay", label: "Razorpay" },
] as const;

export type PaymentMethod = {
  id: number;
  name: string;
  code: string;
  logo_url: string;
  logo_id: number;
  enable: boolean;
  /** key → value (backend এ encrypted থাকে, response এ decrypt হয়ে আসে) */
  credentials: Record<string, string>;
  created_at: string;
  updated_at: string;
};

export function toPaymentMethod(d: Raw): PaymentMethod {
  const creds =
    d.credentials && typeof d.credentials === "object"
      ? (d.credentials as Raw)
      : {};
  return {
    id: Number(d.id),
    name: String(d.name ?? ""),
    code: String(d.code ?? ""),
    logo_url: String(d.logo_url ?? ""),
    logo_id: Number(d.logo_id ?? 0),
    enable: d.enable === undefined ? true : Boolean(d.enable),
    credentials: Object.fromEntries(
      Object.entries(creds).map(([k, v]) => [k, String(v ?? "")]),
    ),
    created_at: String(d.created_at ?? ""),
    updated_at: String(d.updated_at ?? ""),
  };
}

/** Form এর [{key, value}] ⇄ backend এর { key: value } */
export type CredentialRow = { key: string; value: string };
export const credentialsToRows = (c: Record<string, string>): CredentialRow[] =>
  Object.entries(c).map(([key, value]) => ({ key, value }));
export const rowsToCredentials = (
  rows: CredentialRow[],
): Record<string, string> =>
  Object.fromEntries(rows.map((r) => [r.key.trim(), r.value.trim()]));
