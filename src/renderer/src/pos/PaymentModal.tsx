import { useEffect, useMemo, useState } from 'react'
import { fmt, CUR } from './format'

const PAD_KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', '⌫']

interface Props {
  open: boolean
  total: number
  onClose: () => void
  onConfirm: (method: string, paid: number) => void
}

export function PaymentModal({ open, total, onClose, onConfirm }: Props): React.JSX.Element {
  const [method, setMethod] = useState('Cash')
  const [recv, setRecv] = useState('')

  useEffect(() => {
    if (open) {
      setRecv('')
      setMethod('Cash')
    }
  }, [open])

  const quick = useMemo(() => {
    const r = Math.ceil(total)
    return [...new Set([r, Math.ceil(r / 500) * 500, Math.ceil(r / 1000) * 1000, Math.ceil(r / 1000) * 1000 + 1000])]
  }, [total])

  const received = parseFloat(recv) || 0
  const change = received - total

  const press = (k: string): void => {
    if (k === '⌫') setRecv((r) => r.slice(0, -1))
    else if (k === '.') setRecv((r) => (r.includes('.') ? r : r ? r + '.' : '0.'))
    else setRecv((r) => (r.length < 9 ? r + k : r))
  }

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent): void => {
      if (e.key === 'Enter') {
        onConfirm(method, received)
        return
      }
      if (/^[0-9]$/.test(e.key)) press(e.key)
      else if (e.key === '.') press('.')
      else if (e.key === 'Backspace') press('⌫')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, method, received])

  if (!open) return <></>

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(10,14,22,0.55)] p-4">
      <div className="w-full max-w-[410px] overflow-y-auto rounded-md border border-[var(--ink)] bg-[var(--panel)] text-[var(--ink)]">
        <div className="px-5 pb-1 pt-4 text-base font-bold">Payment</div>
        <div className="px-5 pb-4 pt-3">
          <div className="mb-3.5 flex items-baseline justify-between rounded-md bg-[var(--disp)] px-4 py-3.5 text-[var(--disp-ink)]">
            <small className="text-[11px] font-semibold tracking-[0.12em] text-[#b99530]">AMOUNT DUE</small>
            <b className="font-mono text-[28px] font-medium">{fmt(total)}</b>
          </div>

          <div className="mb-3.5 grid grid-cols-3 gap-1 rounded-md bg-[var(--soft)] p-1">
            {['Cash', 'Card', 'Wallet / QR'].map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`rounded-md p-2 text-[var(--ink2)] ${
                  method === m ? 'bg-[var(--accent)] font-bold text-white' : ''
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {method === 'Cash' && (
            <div>
              <div className="mb-2 flex items-baseline justify-between rounded-md border-[1.5px] border-[var(--line2)] bg-[var(--soft)] px-3 py-2.5">
                <span>Tendered</span>
                <b className="font-mono text-xl font-medium">{CUR + (recv || '0.00')}</b>
              </div>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {quick.map((v) => (
                  <button
                    key={v}
                    onClick={() => setRecv(String(v))}
                    className="rounded-md border border-transparent bg-[var(--accent-l)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
                  >
                    {v.toLocaleString()}
                  </button>
                ))}
              </div>
              <div className="mb-2.5 grid grid-cols-3 gap-1.5">
                {PAD_KEYS.map((k) => (
                  <button
                    key={k}
                    onClick={() => press(k)}
                    className="rounded-md border border-[var(--line2)] bg-[var(--panel)] py-3 text-[17px] font-semibold hover:bg-[var(--soft)]"
                  >
                    {k}
                  </button>
                ))}
              </div>
              <div className="flex justify-between px-0.5 py-1 text-[15px] font-bold">
                <span>Change</span>
                <span className="font-mono">{change >= 0 && received > 0 ? fmt(change) : '—'}</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 px-5 pb-[18px] pt-3">
          <button
            onClick={onClose}
            className="rounded-md border border-[var(--line2)] bg-[var(--panel)] px-5 py-2.5 font-semibold hover:bg-[var(--soft)]"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(method, method === 'Cash' ? received : total)}
            className="rounded-md border border-[var(--accent)] bg-[var(--accent)] px-5 py-2.5 font-semibold text-white hover:bg-[var(--accent-d)]"
          >
            Complete (Enter)
          </button>
        </div>
      </div>
    </div>
  )
}
