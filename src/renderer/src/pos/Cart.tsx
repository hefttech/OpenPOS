import { Cart as CartType, TAX_PCT, Totals } from './types'
import { fmt } from './format'

interface Props {
  orderNo: number
  cart: CartType
  totals: Totals
  discountInput: string
  onDiscountChange: (v: string) => void
  onQty: (sku: string, delta: number) => void
  onRemove: (sku: string) => void
  onVoid: () => void
  onPay: () => void
}

export function Cart({
  orderNo,
  cart,
  totals,
  discountInput,
  onDiscountChange,
  onQty,
  onRemove,
  onVoid,
  onPay
}: Props): React.JSX.Element {
  const lines = Object.entries(cart)

  return (
    <div className="flex w-[430px] flex-shrink-0 flex-col overflow-hidden rounded-md border border-[var(--line)] bg-[var(--panel)]">
      <h3 className="flex flex-shrink-0 items-center justify-between px-4 py-[13px] text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
        Sale <span className="font-mono normal-case tracking-normal">#{orderNo}</span>
      </h3>
      <div className="min-h-0 flex-1 overflow-auto border-t border-[var(--line)]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky top-0 bg-[var(--panel)] px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]">
                Item
              </th>
              <th className="sticky top-0 bg-[var(--panel)] px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]">
                Qty
              </th>
              <th className="sticky top-0 bg-[var(--panel)] px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--muted)]">
                Amount
              </th>
              <th className="sticky top-0 bg-[var(--panel)] px-3 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {lines.length ? (
              lines.map(([sku, line]) => (
                <tr key={sku}>
                  <td className="border-b border-[var(--line)] px-3 py-2.5">
                    <b>{line.item.Product_Name}</b>
                    <div className="font-mono text-xs text-[var(--muted)]">
                      {fmt(line.item.Price_LKR)} ea
                    </div>
                  </td>
                  <td className="border-b border-[var(--line)] px-3 py-2.5">
                    <span className="inline-flex items-center overflow-hidden rounded-md border border-[var(--line2)] bg-[var(--panel)]">
                      <button
                        onClick={() => onQty(sku, -1)}
                        className="h-[26px] w-[26px] bg-[var(--soft)] text-[15px] leading-none hover:bg-[var(--accent-l)] hover:text-[var(--accent)]"
                      >
                        −
                      </button>
                      <span className="min-w-[28px] text-center font-bold tabular-nums">
                        {line.qty}
                      </span>
                      <button
                        onClick={() => onQty(sku, 1)}
                        className="h-[26px] w-[26px] bg-[var(--soft)] text-[15px] leading-none hover:bg-[var(--accent-l)] hover:text-[var(--accent)]"
                      >
                        +
                      </button>
                    </span>
                  </td>
                  <td className="border-b border-[var(--line)] px-3 py-2.5 text-right font-mono tabular-nums">
                    <b>{fmt(line.item.Price_LKR * line.qty)}</b>
                  </td>
                  <td className="border-b border-[var(--line)] px-3 py-2.5">
                    <button
                      onClick={() => onRemove(sku)}
                      title="Remove"
                      className="rounded-md px-1.5 py-1 text-[var(--muted)] hover:bg-[var(--bad-l)] hover:text-[var(--bad)]"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-3.5 py-14 text-center text-[var(--muted)]">
                  Sale is empty. Scan or select an item.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex-shrink-0 border-t border-[var(--line)] px-4 py-2.5">
        <div className="flex items-center justify-between py-[3px] text-[var(--ink2)]">
          <span>Items</span>
          <span className="tabular-nums">
            {lines.reduce((a, [, l]) => a + l.qty, 0)}
          </span>
        </div>
        <div className="flex items-center justify-between py-[3px] text-[var(--ink2)]">
          <span>Subtotal</span>
          <span className="tabular-nums">{fmt(totals.sub)}</span>
        </div>
        <div className="flex items-center justify-between py-[3px] text-[var(--ink2)]">
          <span>Discount %</span>
          <input
            type="number"
            min={0}
            max={100}
            value={discountInput}
            onChange={(e) => onDiscountChange(e.target.value)}
            className="w-[58px] rounded-md border border-[var(--line2)] bg-[var(--panel)] px-2 py-0.5 text-right outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div className="flex items-center justify-between py-[3px] text-[var(--ink2)]">
          <span>Tax {TAX_PCT}%</span>
          <span className="tabular-nums">{fmt(totals.tax)}</span>
        </div>
      </div>
      <div className="mx-3 mb-0 flex flex-shrink-0 items-baseline justify-between rounded-md bg-[var(--disp)] px-[18px] py-3 text-[var(--disp-ink)]">
        <small className="text-[11px] font-semibold tracking-[0.14em] text-[#b99530]">
          TOTAL DUE
        </small>
        <b className="font-mono text-[32px] font-medium">{fmt(totals.total)}</b>
      </div>
      <div className="grid flex-shrink-0 grid-cols-[1fr_2fr] gap-2 p-3">
        <button
          onClick={onVoid}
          className="rounded-md border border-[var(--line2)] bg-[var(--panel)] py-[15px] text-[14.5px] font-bold hover:bg-[var(--soft)]"
        >
          Void sale
        </button>
        <button
          onClick={onPay}
          disabled={!lines.length}
          className="rounded-md border border-[var(--accent)] bg-[var(--accent)] py-[15px] text-[14.5px] font-bold text-white hover:bg-[var(--accent-d)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          PAY
        </button>
      </div>
    </div>
  )
}
