export function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  const ts = Date.now().toString().slice(-5);
  return `GRV-${year}-${rand}${ts}`;
}
