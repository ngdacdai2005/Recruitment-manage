export const formatCurrency = (amount?: number | null): string => {
  if (amount == null) return 'Thỏa thuận';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatSalaryRange = (min?: number, max?: number, isNegotiable?: boolean): string => {
  if (isNegotiable || (!min && !max)) return 'Thỏa thuận';
  if (min && !max) return `Từ ${formatCurrency(min)}`;
  if (!min && max) return `Lên đến ${formatCurrency(max)}`;
  return `${(min! / 1000000).toFixed(0)} - ${(max! / 1000000).toFixed(0)} triệu VNĐ`;
};
