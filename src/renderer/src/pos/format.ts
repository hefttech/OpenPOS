export const CUR = 'Rs. '

export function fmt(n: number): string {
  return CUR + n.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
