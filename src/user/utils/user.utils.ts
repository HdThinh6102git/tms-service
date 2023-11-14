export function generateCode(): string {
  return `${Math.floor(100000 + Math.random() * 900000)}`;
}
export function convertMilliseconds(minute: number): number {
  return minute * 60 * 1000;
}
