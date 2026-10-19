// GET /currencies এর response (currency/dto.Response) কে frontend এর Currency এ বদলায়।

export type Currency = {
  id: number;
  code: string; // "BDT", "USD"
  name: string;
  symbol: string; // "৳", "$"
  rateToBDT: number; // 1 unit = কত BDT
  isDefault: boolean;
  status: string; // "enable" | "disable"
};

export type ConvertResult = { amount: number; from_code: string; to_code: string; result: number };

type Raw = Record<string, unknown>;

export function toCurrency(d: Raw): Currency {
  return {
    id: Number(d.id ?? 0),
    code: String(d.code ?? "").toUpperCase(),
    name: String(d.name ?? ""),
    symbol: String(d.symbol ?? ""),
    rateToBDT: Number(d.rate_to_bdt ?? 1),
    isDefault: Boolean(d.is_default),
    status: String(d.status ?? ""),
  };
}
