export type Language = {
  id: number;
  name: string;
  code: string;
  rtl: boolean;
  isActive: boolean;
  isDefault: boolean;
  flag: string;
};

type Raw = Record<string, unknown>;

export function toLanguage(d: Raw): Language {
  return {
    id: Number(d.id ?? 0),
    name: String(d.name ?? ""),
    code: String(d.code ?? ""),
    rtl: Boolean(d.rtl),
    isActive: d.is_active === undefined ? true : Boolean(d.is_active),
    isDefault: Boolean(d.is_default),
    flag: String(d.flag ?? ""),
  };
}