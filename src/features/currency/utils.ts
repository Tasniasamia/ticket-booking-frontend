import type { Currency } from "./types";

/** BDT কে pivot ধরে convert। Backend এর Convert() এর সাথে একই হিসাব, তবে লিস্টে N বার API না ডেকে client এই হিসাব করে। */
export function convertAmount(amount: number, from: Currency, to: Currency) {
  if (from.code === to.code) return amount;
  if (from.rateToBDT <= 0 || to.rateToBDT <= 0) return amount;
  return (amount * from.rateToBDT) / to.rateToBDT;
}

//jei language default ace shei vashay dekhano
function numberFormat(locale: string, options?: Intl.NumberFormatOptions) {
  try {
    return new Intl.NumberFormat(locale, options);
  } catch {
    return new Intl.NumberFormat("en", options); // locale code ভুল হলে crash না করে en
  }
}

/** "৳7,800" বা "$65"। symbol আসে backend থেকে, সংখ্যা সাজায় ভাষার locale (bn হলে বাংলা অঙ্ক)। */ //view korar response
export function formatMoney(amount: number, symbol: string, locale: string) {
  return `${symbol}${numberFormat(locale, { maximumFractionDigits: 2 }).format(amount)}`;
}

/** Currency list এখনো আসেনি (loading) বা code খুঁজে পাওয়া যায়নি: মূল currency তেই দেখাই, যাতে দাম কখনো খালি না থাকে। */  //cookie te thaka currency tei dekahcci. 
export function formatFallback(amount: number, code: string, locale: string) {
  try {
    return numberFormat(locale, { style: "currency", currency: code, maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `${code} ${amount}`;
  }
}
