export type Contact = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  reply_message?: string;
  replied_at?: string | null;
  created_at: string;
  updated_at: string;
};

export function toContact(d: Record<string, unknown>): Contact {
  return {
    id: Number(d.id ?? 0),
    name: String(d.name ?? ""),
    email: String(d.email ?? ""),
    subject: String(d.subject ?? ""),
    message: String(d.message ?? ""),
    status: String(d.status ?? "pending"),
    reply_message: d.reply_message ? String(d.reply_message) : undefined,
    replied_at: d.replied_at ? String(d.replied_at) : null,
    created_at: String(d.created_at ?? ""),
    updated_at: String(d.updated_at ?? ""),
  };
}
