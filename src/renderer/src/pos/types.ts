import { Item } from '../../../main/types'

export interface CartLine {
  item: Item
  qty: number
}

export type Cart = Record<string, CartLine>

export interface Totals {
  sub: number
  discountPct: number
  discount: number
  tax: number
  total: number
}

export const TAX_PCT = 8
export const LOW_STOCK = 5

export function calcTotals(cart: Cart, discountPct: number): Totals {
  const sub = Object.values(cart).reduce((s, l) => s + l.item.Price_LKR * l.qty, 0)
  const dp = Math.min(100, Math.max(0, discountPct || 0))
  const discount = (sub * dp) / 100
  const tax = ((sub - discount) * TAX_PCT) / 100
  return { sub, discountPct: dp, discount, tax, total: sub - discount + tax }
}
