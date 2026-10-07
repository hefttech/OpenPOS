import { ElectronAPI } from '@electron-toolkit/preload'
import { CategoryCount, NewItem, PaginatedItems, ProductQuery, StockSummary } from '../main/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      product: {
        test: () => Promise<string>
        all: (page: number, pageSize: number, query?: ProductQuery) => Promise<PaginatedItems>
        categories: () => Promise<CategoryCount[]>
        stockSummary: () => Promise<StockSummary>
        add: (item: NewItem) => Promise<void>
        adjustStock: (sku: string, delta: number) => Promise<void>
      }
    }
  }
}
