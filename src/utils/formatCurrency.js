export const formatCurrency = (amount) => {
  if (!amount || amount === 0) return "Chưa cập nhật";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};
