import { fmt } from './format'
import { TAX_PCT, Totals } from './types'

export interface ReceiptData {
  orderNo: number
  date: Date
  lines: { name: string; qty: number; price: number }[]
  totals: Totals
  method: string
  paid: number
}

interface Props {
  open: boolean
  data: ReceiptData | null
  onClose: () => void
}

export function ReceiptModal({ open, data, onClose }: Props): React.JSX.Element {
  if (!open || !data) return <></>

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(10,14,22,0.55)] p-4">
      <div className="w-full max-w-[410px] overflow-y-auto rounded-md border border-[var(--ink)] bg-[var(--panel)] text-[var(--ink)]">
        <div className="flex items-center gap-2.5 px-5 pb-1 pt-4 text-base font-bold">
          <i className="grid h-[22px] w-[22px] place-items-center rounded-full bg-[var(--ok)] text-[13px] not-italic text-white">
            ✓
          </i>
          Sale complete
        </div>
        <div className="px-5 pb-4 pt-3">
          <div
            id="receiptBox"
            className="rounded-md border border-[var(--line2)] bg-white p-4 font-mono text-xs leading-relaxed text-[#111]"
          >
            <div className="text-center">
              <b>MAIN BRANCH</b>
              <br />
              123 Main Street, Colombo
              <br />
              Tel 011 234 5678
            </div>
            <hr className="my-2 border-dashed border-t border-[#888]" />
            <div className="flex justify-between gap-2">
              <span>Receipt #{data.orderNo}</span>
              <span>{data.date.toLocaleDateString('en-GB')}</span>
            </div>
            <div className="flex justify-between gap-2">
              <span>Cashier: Admin</span>
              <span>{data.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <hr className="my-2 border-dashed border-t border-[#888]" />
            {data.lines.map((l, i) => (
              <div key={i}>
                <div className="flex justify-between gap-2">
                  <span>{l.name}</span>
                  <span>{fmt(l.qty * l.price)}</span>
                </div>
                <div className="pl-2 text-[#666]">
                  {l.qty} x {fmt(l.price)}
                </div>
              </div>
            ))}
            <hr className="my-2 border-dashed border-t border-[#888]" />
            <div className="flex justify-between gap-2">
              <span>Subtotal</span>
              <span>{fmt(data.totals.sub)}</span>
            </div>
            {data.totals.discountPct > 0 && (
              <div className="flex justify-between gap-2">
                <span>Discount {data.totals.discountPct}%</span>
                <span>-{fmt(data.totals.discount)}</span>
              </div>
            )}
            <div className="flex justify-between gap-2">
              <span>Tax {TAX_PCT}%</span>
              <span>{fmt(data.totals.tax)}</span>
            </div>
            <div className="flex justify-between gap-2">
              <b>TOTAL</b>
              <b>{fmt(data.totals.total)}</b>
            </div>
            <hr className="my-2 border-dashed border-t border-[#888]" />
            <div className="flex justify-between gap-2">
              <span>{data.method}</span>
              <span>{fmt(data.paid)}</span>
            </div>
            {data.method === 'Cash' && (
              <div className="flex justify-between gap-2">
                <span>Change</span>
                <span>{fmt(data.paid - data.totals.total)}</span>
              </div>
            )}
            <hr className="my-2 border-dashed border-t border-[#888]" />
            <div className="text-center">Thank you</div>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 pb-[18px] pt-3">
          <button
            onClick={() => window.print()}
            className="rounded-md border border-[var(--line2)] bg-[var(--panel)] px-5 py-2.5 font-semibold hover:bg-[var(--soft)]"
          >
            Print
          </button>
          <button
            onClick={onClose}
            className="rounded-md border border-[var(--accent)] bg-[var(--accent)] px-5 py-2.5 font-semibold text-white hover:bg-[var(--accent-d)]"
          >
            Next sale
          </button>
        </div>
      </div>
    </div>
  )
}
