/** 1 … 4 [5] 6 … 20 : প্রথম, শেষ আর current এর দুপাশ। মাঝের ফাঁকে "gap-N" string বসে (key হিসেবে)। */
export function getPageList(current: number, total: number): (number | string)[] {
  const set = new Set([1, total, current - 1, current, current + 1]);
  const list = [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out: (number | string)[] = [];
  list.forEach((p, i) => {
    if (i > 0 && p - list[i - 1] > 1) out.push(`gap-${p}`);
    out.push(p);
  });
  return out;
}
