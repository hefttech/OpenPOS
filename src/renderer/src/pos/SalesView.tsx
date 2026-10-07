import { RefObject, useEffect, useState } from 'react'
import { CategoryCount, Item } from '../../../main/types'
import { CategoryList } from './CategoryList'
import { ItemLookup } from './ItemLookup'
import { Cart } from './Cart'
import { Cart as CartType, calcTotals } from './types'

const PAGE_SIZE = 10

interface Props {
  active: boolean
  searchInputRef: RefObject<HTMLInputElement | null>
  cart: CartType
  orderNo: number
  discountInput: string
  refreshSignal: number
  onDiscountChange: (v: string) => void
  onAdd: (item: Item) => void
  onQty: (sku: string, delta: number) => void
  onRemove: (sku: string) => void
  onVoid: () => void
  onPay: () => void
}

export function SalesView({
  active,
  searchInputRef,
  cart,
  orderNo,
  discountInput,
  refreshSignal,
  onDiscountChange,
  onAdd,
  onQty,
  onRemove,
  onVoid,
  onPay
}: Props): React.JSX.Element {
  const [categories, setCategories] = useState<CategoryCount[]>([])
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<Item[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    window.api.product.categories().then(setCategories).catch(console.error)
  }, [])

  useEffect(() => {
    setLoading(true)
    const query = { category: category === 'All' ? undefined : category, search: search || undefined }
    window.api.product
      .all(page, PAGE_SIZE, query)
      .then((res) => {
        setItems(res.items)
        setTotal(res.total)
        setTotalPages(res.totalPages)
        setSelected(0)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [category, search, page, refreshSignal])

  useEffect(() => {
    setPage(1)
  }, [category, search])

  const totals = calcTotals(cart, Number(discountInput) || 0)

  return (
    <section className={`${active ? 'flex' : 'hidden'} min-h-0 min-w-0 flex-1 gap-3 p-3`}>
      <CategoryList
        categories={categories}
        active={category}
        onSelect={(c) => {
          setCategory(c)
          searchInputRef.current?.focus()
        }}
      />
      <ItemLookup
        searchInputRef={searchInputRef}
        search={search}
        onSearchChange={setSearch}
        items={items}
        loading={loading}
        selected={selected}
        onSelectIndex={setSelected}
        onAdd={(item) => {
          onAdd(item)
          searchInputRef.current?.focus()
        }}
        page={page}
        totalPages={totalPages}
        total={total}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />
      <Cart
        orderNo={orderNo}
        cart={cart}
        totals={totals}
        discountInput={discountInput}
        onDiscountChange={onDiscountChange}
        onQty={onQty}
        onRemove={onRemove}
        onVoid={onVoid}
        onPay={onPay}
      />
    </section>
  )
}
