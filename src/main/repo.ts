import { db } from './db/db'
import {
  CategoryCount,
  Item,
  NewItem,
  PaginatedItems,
  ProductQuery,
  StockSummary
} from './types'

export const productRepo = {
  test: () => 'hello from repo',
  productList: (page: number, pageSize: number, query?: ProductQuery) =>
    productList(page, pageSize, query),
  categories: () => categories(),
  stockSummary: () => stockSummary(),
  addItem: (item: NewItem) => addItem(item),
  adjustStock: (sku: string, delta: number) => adjustStock(sku, delta)
}

function buildWhere(query?: ProductQuery): { sql: string; params: unknown[] } {
  const clauses: string[] = []
  const params: unknown[] = []

  if (query?.category && query.category !== 'All') {
    clauses.push('Category = ?')
    params.push(query.category)
  }

  if (query?.search) {
    clauses.push('(Product_Name LIKE ? OR SKU LIKE ? OR CAST(Barcode AS TEXT) LIKE ?)')
    const like = `%${query.search}%`
    params.push(like, like, like)
  }

  return { sql: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', params }
}

const productList = (page = 1, pageSize = 20, query?: ProductQuery): PaginatedItems => {
  const offset = (page - 1) * pageSize
  const { sql: whereSql, params } = buildWhere(query)

  const items = db
    .prepare(`SELECT * FROM products ${whereSql} ORDER BY Product_Name LIMIT ? OFFSET ?`)
    .all(...params, pageSize, offset) as Item[]

  const { total } = db
    .prepare(`SELECT COUNT(*) as total FROM products ${whereSql}`)
    .get(...params) as { total: number }

  return {
    items,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize)
  }
}

const categories = (): CategoryCount[] => {
  const rows = db
    .prepare('SELECT Category as category, COUNT(*) as count FROM products GROUP BY Category ORDER BY Category')
    .all() as CategoryCount[]
  const { total } = db.prepare('SELECT COUNT(*) as total FROM products').get() as {
    total: number
  }

  return [{ category: 'All', count: total }, ...rows]
}

const stockSummary = (): StockSummary => {
  const { items, units, value } = db
    .prepare(
      'SELECT COUNT(*) as items, COALESCE(SUM(Stock),0) as units, COALESCE(SUM(Stock*Price_LKR),0) as value FROM products'
    )
    .get() as { items: number; units: number; value: number }
  const { low } = db
    .prepare('SELECT COUNT(*) as low FROM products WHERE Stock > 0 AND Stock <= 5')
    .get() as { low: number }
  const { out } = db.prepare('SELECT COUNT(*) as out FROM products WHERE Stock <= 0').get() as {
    out: number
  }

  return { items, units, value, low, out }
}

const addItem = (item: NewItem): void => {
  db.prepare(
    'INSERT INTO products (SKU, Barcode, Product_Name, Category, Price_LKR, Stock) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(item.SKU, item.Barcode, item.Product_Name, item.Category, item.Price_LKR, item.Stock)
}

const adjustStock = (sku: string, delta: number): void => {
  db.prepare('UPDATE products SET Stock = Stock + ? WHERE SKU = ?').run(delta, sku)
}
