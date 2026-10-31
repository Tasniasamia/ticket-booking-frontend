export type FAQ = {
  id: number;
  question: string;
  answer: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export function toFAQ(d: Record<string, unknown>): FAQ {
  return {
    id: Number(d.id ?? 0),
    question: String(d.question ?? ""),
    answer: String(d.answer ?? ""),
    is_active: Boolean(d.is_active),
    sort_order: Number(d.sort_order ?? 0),
    created_at: String(d.created_at ?? ""),
    updated_at: String(d.updated_at ?? ""),
  };
}
