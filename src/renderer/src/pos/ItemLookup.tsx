import { RefObject, useEffect, useRef } from 'react'
import { Item } from '../../../main/types'
import { fmt } from './format'

interface Props {
  searchInputRef: RefObject<HTMLInputElement | null>
  search: string
  onSearchChange: (v: string) => void
  items: Item[]
  loading: boolean
  selected: number
  onSelectIndex: (i: number) => void
  onAdd: (item: Item) => void
  page: number
  totalPages: number
  total: number
  onPrev: () => void
  onNext: () => void
}

export function ItemLookup({
  searchInputRef,
  search,
  onSearchChange,
  items,
  loading,
  selected,
  onSelectIndex,
  onAdd,
  page,
  totalPages,
  total,
  onPrev,
  onNext
}: Props): React.JSX.Element {
  const rowRefs = useRef<Array<HTMLTableRowElement | null>>([])

  useEffect(() => {
    rowRefs.current[selected]?.scrollIntoView({ block: 'nearest' })
  }, [selected])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      onSelectIndex(Math.min(items.length - 1, selected + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      onSelectIndex(Math.max(0, selected - 1))
    } else if (e.key === 'Enter') {
      const v = search.trim()
      const exact = items.find((p) => p.SKU === v || String(p.Barcode) === v)
      const target = exact ?? items[selected]
      if (target) onAdd(target)
    }
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-md border border-[var(--line)] bg-[var(--panel)]">
      <h3 className="flex flex-shrink-0 items-center justify-between px-4 py-[13px] text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
        Item lookup
        <small className="font-normal normal-case tracking-normal">
          <kbd className="rounded-md border border-b-2 border-[var(--line2)] bg-[var(--soft)] px-1.5 py-0.5 font-mono text-[11px] font-medium text-[var(--ink2)]">
            ↑
          </kbd>{' '}
          <kbd className="rounded-md border border-b-2 border-[var(--line2)] bg-[var(--soft)] px-1.5 py-0.5 font-mono text-[11px] font-medium text-[var(--ink2)]">
            ↓
          </kbd>{' '}
          move &nbsp;
          <kbd className="rounded-md border border-b-2 border-[var(--line2)] bg-[var(--soft)] px-1.5 py-0.5 font-mono text-[11px] font-medium text-[var(--ink2)]">
            Enter
          </kbd>{' '}
          add
        </small>
      </h3>
      <div className="relative flex-shrink-0 px-4 pb-3">
        <svg
          className="pointer-events-none absolute left-7 top-[11px] h-[18px] w-[18px] text-[var(--muted)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4-4" />
        </svg>
        <input
          ref={searchInputRef}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Scan barcode or type item name…"
          autoComplete="off"
          className="w-full rounded-md border-[1.5px] border-[var(--line2)] bg-[var(--soft)] py-3 pl-[42px] pr-3.5 text-[15px] outline-none transition-colors focus:border-[var(--accent)] focus:bg-[var(--panel)]"
        />
      </div>
      <div className="min-h-0 flex-1 overflow-auto border-t border-[var(--line)]">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-[120px]" />
            <col />
            <col className="w-[120px]" />
            <col className="w-[110px]" />
            <col className="w-[70px]" />
          </colgroup>
          <thead>
            <tr>
              {['SKU', 'Description', 'Category', 'Price', 'Stock'].map((h, i) => (
                <th
                  key={h}
                  className={`sticky top-0 z-[1] whitespace-nowrap border-b border-[var(--line)] bg-[var(--panel)] px-3.5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)] ${
                    i >= 3 ? 'text-right' : ''
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-7 text-center text-[var(--muted)]">
                  Loading…
                </td>
              </tr>
            ) : items.length ? (
              items.map((p, i) => (
                <tr
                  key={p.SKU}
                  ref={(el) => {
                    rowRefs.current[i] = el
                  }}
                  onClick={() => onAdd(p)}
                  className={`cursor-pointer transition-colors ${
                    p.Stock <= 0 ? 'cursor-not-allowed text-[var(--muted)]' : ''
                  } ${i === selected ? 'bg-[var(--sel)]' : 'hover:bg-[var(--hover)]'}`}
                >
                  <td
                    className={`whitespace-nowrap border-b border-[var(--line)] px-3.5 py-2.5 font-mono tabular-nums ${
                      i === selected ? 'border-l-[3px] border-l-[var(--accent)]' : ''
                    }`}
                  >
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
                  <td
                    className={`whitespace-nowrap border-b border-[var(--line)] px-3.5 py-2.5 text-right font-mono tabular-nums ${
                      p.Stock <= 0
                        ? 'font-bold text-[var(--bad)]'
                        : p.Stock <= 5
                          ? 'font-bold text-[var(--warn)]'
                          : ''
                    }`}
                  >
                    {p.Stock}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-7 text-center text-[var(--muted)]">
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
            onClick={onPrev}
            className="rounded-md border border-[var(--line2)] bg-[var(--panel)] px-2.5 py-1 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            Page {page} / {Math.max(1, totalPages)}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={onNext}
            className="rounded-md border border-[var(--line2)] bg-[var(--panel)] px-2.5 py-1 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
