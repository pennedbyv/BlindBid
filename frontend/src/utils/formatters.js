export function truncateAddress(address, startLength = 6, endLength = 4) {
  if (!address) return '';
  if (address.length <= startLength + endLength) return address;
  return `${address.substring(0, startLength)}...${address.substring(address.length - endLength)}`;
}

export function formatCurrency(value, currency = 'MON') {
  if (value === undefined || value === null) return '';
  return `${value} ${currency}`;
}

export function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pad = (num) => String(num).padStart(2, '0');
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
}
