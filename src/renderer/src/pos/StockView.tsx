import { useEffect, useState } from 'react'
import { Item, StockSummary } from '../../../main/types'
import { fmt } from './format'
import { LOW_STOCK } from './types'

const PAGE_SIZE = 12

interface Props {
  active: boolean
  refreshSignal: number
  onAddItem: () => void
  onReceived: (name: string, qty: number) => void
}

export function StockView({ active, refreshSignal, onAddItem, onReceived }: Props): React.JSX.Element {
  const [summary, setSummary] = useState<StockSummary | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<Item[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [qtyInputs, setQtyInputs] = useState<Record<string, string>>({})
  const [localRefresh, setLocalRefresh] = useState(0)

  useEffect(() => {
    if (!active) return
    window.api.product.stockSummary().then(setSummary).catch(console.error)
  }, [active, refreshSignal, localRefresh])

  useEffect(() => {
    if (!active) return
    window.api.product
      .all(page, PAGE_SIZE, { search: search || undefined })
      .then((res) => {
        setItems(res.items)
        setTotal(res.total)
        setTotalPages(res.totalPages)
      })
      .catch(console.error)
  }, [active, search, page, refreshSignal, localRefresh])

  useEffect(() => {
    setPage(1)
  }, [search])

  const receive = (item: Item): void => {
    const n = parseInt(qtyInputs[item.SKU] ?? '', 10)
    if (!n || n < 1) return
    window.api.product
      .adjustStock(item.SKU, n)
      .then(() => {
        setQtyInputs((q) => ({ ...q, [item.SKU]: '' }))
        onReceived(item.Product_Name, n)
        setLocalRefresh((v) => v + 1)
      })
      .catch(console.error)
  }

  return (
    <section className={`${active ? 'flex' : 'hidden'} min-h-0 flex-1 flex-col gap-3 p-3`}>
      <div className="grid flex-shrink-0 grid-cols-5 gap-3">
        {[
          ['Items', summary?.items ?? 0],
          ['Units on hand', (summary?.units ?? 0).toLocaleString()],
          ['Stock value', fmt(summary?.value ?? 0)],
          ['Low stock', summary?.low ?? 0],
          ['Out of stock', summary?.out ?? 0]
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-md border border-[var(--line)] bg-[var(--panel)] px-4 py-3">
            <small className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]">
              {label}
            </small>
            <b className="block truncate text-[21px] font-bold tracking-tight tabular-nums" title={String(value)}>
              {value}
            </b>
          </div>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-[var(--line)] bg-[var(--panel)]">
        <h3 className="flex-shrink-0 px-4 py-[13px] text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
          Stock on hand
        </h3>
        <div className="flex flex-shrink-0 items-center gap-2 px-4 pb-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by name, SKU or category"
            className="w-[300px] rounded-md border-[1.5px] border-[var(--line2)] bg-[var(--soft)] px-3 py-2.5 outline-none focus:border-[var(--accent)] focus:bg-[var(--panel)]"
          />
          <div className="flex-1" />
          <button
            onClick={onAddItem}
            className="rounded-md border border-[var(--accent)] bg-[var(--accent)] px-3.5 py-2.5 font-semibold text-white hover:bg-[var(--accent-d)]"
          >
            New item (F6)
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full table-fixed border-collapse">
            <colgroup>
              <col className="w-[110px]" />
              <col />
              <col className="w-[130px]" />
              <col className="w-[90px]" />
              <col className="w-[80px]" />
              <col className="w-[100px]" />
              <col className="w-[160px]" />
            </colgroup>
            <thead>
              <tr>
                {['SKU', 'Description', 'Category', 'Price', 'On hand', 'Status', 'Receive stock'].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={`sticky top-0 whitespace-nowrap border-b border-[var(--line)] bg-[var(--panel)] px-3.5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)] ${
                        i === 3 || i === 4 || i === 6 ? 'text-right' : ''
                      }`}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {items.length ? (
                items.map((p) => {
                  const status =
                    p.Stock <= 0
                      ? { cls: 'bg-[var(--bad-l)] text-[var(--bad)]', label: 'Out of stock' }
                      : p.Stock <= LOW_STOCK
                        ? { cls: 'bg-[var(--warn-l)] text-[var(--warn)]', label: 'Low stock' }
                        : { cls: 'bg-[var(--ok-l)] text-[var(--ok)]', label: 'In stock' }
                  return (
                    <tr key={p.SKU}>
                      <td className="whitespace-nowrap border-b border-[var(--line)] px-3.5 py-2.5 font-mono tabular-nums">
                        {p.SKU}
                      </td>
                      <td className="truncate border-b border-[var(--line)] px-3.5 py-2.5 font-semibold">
                        {p.Product_Name}
                      </td>
                      <td className="truncate border-b border-[var(--line)] px-3.5 py-2.5">
                        <span className="inline-block truncate rounded-md bg-[var(--soft)] px-2 py-0.5 text-xs font-semibold text-[var(--ink2)]">
                          {p.Category}
                        </span>
                      </td>
                      <td className="whitespace-nowrap border-b border-[var(--line)] px-3.5 py-2.5 text-right font-mono tabular-nums">
                        {fmt(p.Price_LKR)}
                      </td>
                      <td className="whitespace-nowrap border-b border-[var(--line)] px-3.5 py-2.5 text-right font-mono tabular-nums">
                        <b>{p.Stock}</b>
                      </td>
                      <td className="whitespace-nowrap border-b border-[var(--line)] px-3.5 py-2.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold before:h-1.5 before:w-1.5 before:rounded-full before:bg-current ${status.cls}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap border-b border-[var(--line)] px-3.5 py-2.5">
                        <div className="flex justify-end gap-1.5">
                          <input
                            type="number"
                            min={1}
                            placeholder="Qty"
                            value={qtyInputs[p.SKU] ?? ''}
                            onChange={(e) =>
                              setQtyInputs((q) => ({ ...q, [p.SKU]: e.target.value }))
                            }
                            onKeyDown={(e) => e.key === 'Enter' && receive(p)}
                            className="w-16 rounded-md border border-[var(--line2)] bg-[var(--panel)] px-2 py-1 text-right outline-none focus:border-[var(--accent)]"
                          />
                          <button
                            onClick={() => receive(p)}
                            className="rounded-md border border-[var(--line2)] bg-[var(--panel)] px-3 py-1 text-[12.5px] hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
                          >
                            Receive
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-7 text-center text-[var(--muted)]">
                    No matching items
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-shrink-0 items-center justify-between border-t border-[var(--line)] px-4 py-2 text-xs text-[var(--ink2)]">
          <span>{total.toLocaleString()} items</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-md border border-[var(--line2)] bg-[var(--panel)] px-2.5 py-1 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            <span>
              Page {page} / {Math.max(1, totalPages)}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-md border border-[var(--line2)] bg-[var(--panel)] px-2.5 py-1 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
