export interface Item {
  SKU: string
  Barcode: number
  Product_Name: string
  Category: string
  Price_LKR: number
  Stock: number
}

export interface PaginatedItems {
  items: Item[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface ProductQuery {
  category?: string
  search?: string
}

export interface CategoryCount {
  category: string
  count: number
}

export interface StockSummary {
  items: number
  units: number
  value: number
  low: number
  out: number
}

export interface NewItem {
  SKU: string
  Barcode: number
  Product_Name: string
  Category: string
  Price_LKR: number
  Stock: number
}
