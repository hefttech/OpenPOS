import { useState } from 'react'
import { CategoryCount } from '../../../main/types'

interface Props {
  open: boolean
  categories: CategoryCount[]
  onClose: () => void
  onSave: (name: string, sku: string, barcode: number, category: string, price: number, qty: number) => void
}

export function AddItemModal({ open, categories, onClose, onSave }: Props): React.JSX.Element {
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [barcode, setBarcode] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [qty, setQty] = useState('')
  const [error, setError] = useState('')

  const reset = (): void => {
    setName('')
    setSku('')
    setBarcode('')
    setCategory('')
    setPrice('')
    setQty('')
    setError('')
  }

  const save = (): void => {
    const priceNum = parseFloat(price)
    if (!name.trim() || isNaN(priceNum) || priceNum < 0) {
      setError('Description and a valid price are required')
      return
    }
    const finalSku = sku.trim() || `SKU-${Date.now()}`
    const finalBarcode = parseInt(barcode, 10) || Math.floor(100000000000 + Math.random() * 900000000000)
    onSave(
      name.trim(),
      finalSku,
      finalBarcode,
      category.trim() || 'General',
      priceNum,
      parseInt(qty, 10) || 0
    )
    reset()
  }

  if (!open) return <></>

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(10,14,22,0.55)] p-4">
      <div className="w-full max-w-[410px] overflow-y-auto rounded-md border border-[var(--ink)] bg-[var(--panel)] text-[var(--ink)]">
        <div className="px-5 pb-1 pt-4 text-base font-bold">New item</div>
        <div className="px-5 pb-4 pt-3">
          {error && <div className="mb-3 text-sm font-medium text-[var(--bad)]">{error}</div>}
          <div className="mb-3">
            <label className="mb-1.5 block text-xs font-semibold text-[var(--ink2)]">Description</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border-[1.5px] border-[var(--line2)] bg-[var(--panel)] px-2.5 py-2 outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div className="mb-3 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--ink2)]">SKU</label>
              <input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full rounded-md border-[1.5px] border-[var(--line2)] bg-[var(--panel)] px-2.5 py-2 outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--ink2)]">Barcode</label>
              <input
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="w-full rounded-md border-[1.5px] border-[var(--line2)] bg-[var(--panel)] px-2.5 py-2 outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="mb-1.5 block text-xs font-semibold text-[var(--ink2)]">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              list="catList"
              className="w-full rounded-md border-[1.5px] border-[var(--line2)] bg-[var(--panel)] px-2.5 py-2 outline-none focus:border-[var(--accent)]"
            />
            <datalist id="catList">
              {categories
                .filter((c) => c.category !== 'All')
                .map((c) => (
                  <option key={c.category} value={c.category} />
                ))}
            </datalist>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--ink2)]">Price (Rs.)</label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-md border-[1.5px] border-[var(--line2)] bg-[var(--panel)] px-2.5 py-2 outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--ink2)]">Opening stock</label>
              <input
                type="number"
                min={0}
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full rounded-md border-[1.5px] border-[var(--line2)] bg-[var(--panel)] px-2.5 py-2 outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 pb-[18px] pt-3">
          <button
            onClick={() => {
              reset()
              onClose()
            }}
            className="rounded-md border border-[var(--line2)] bg-[var(--panel)] px-5 py-2.5 font-semibold hover:bg-[var(--soft)]"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="rounded-md border border-[var(--accent)] bg-[var(--accent)] px-5 py-2.5 font-semibold text-white hover:bg-[var(--accent-d)]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
