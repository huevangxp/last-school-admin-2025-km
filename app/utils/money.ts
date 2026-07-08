// Format a numeric value as a grouped money string, e.g. 1500000 -> "1,500,000".
// Used for every money display and inside the MoneyInput component so the whole
// app formats amounts the same way.
export const formatMoney = (
  value: number | string | null | undefined
): string => {
  const n = Number(value ?? 0);
  if (!isFinite(n)) return "0";
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
};
