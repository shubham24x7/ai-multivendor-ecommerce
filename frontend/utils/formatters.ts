export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency
  }).format(amount);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en").format(value);
}
