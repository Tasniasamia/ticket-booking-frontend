export type Translation = {
  id: number;
  key: string;
  values: Record<string, string>;
  updatedAt: string;
};

type Raw = Record<string, unknown>;

export function toTranslation(d: Raw): Translation {
  const raw = (d.values ?? {}) as Record<string, unknown>;
  const values: Record<string, string> = {};
  for (const [code, v] of Object.entries(raw)) values[code] = String(v ?? "");
  return {
    id: Number(d.id ?? 0),
    key: String(d.key ?? ""),
    values,
    updatedAt: String(d.updated_at ?? ""),
  };
}