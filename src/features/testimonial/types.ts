export type Testimonial = {
  id: number;
  name: string;
  role: string;
  text: string;
  image_url: string;
  image_id: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export function toTestimonial(d: Record<string, unknown>): Testimonial {
  return {
    id: Number(d.id ?? 0),
    name: String(d.name ?? ""),
    role: String(d.role ?? ""),
    text: String(d.text ?? ""),
    image_url: String(d.image_url ?? ""),
    image_id: Number(d.image_id ?? 0),
    is_active: Boolean(d.is_active),
    sort_order: Number(d.sort_order ?? 0),
    created_at: String(d.created_at ?? ""),
    updated_at: String(d.updated_at ?? ""),
  };
}
