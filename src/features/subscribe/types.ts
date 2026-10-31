export type Subscriber = {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export function toSubscriber(d: Record<string, unknown>): Subscriber {
  return {
    id: Number(d.id ?? 0),
    email: String(d.email ?? ""),
    is_active: Boolean(d.is_active),
    created_at: String(d.created_at ?? ""),
    updated_at: String(d.updated_at ?? ""),
  };
}
