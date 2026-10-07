import { useEffect, useRef, useState } from 'react'
import { CategoryCount, Item } from '../../main/types'
import { TitleBar } from './pos/TitleBar'
import { FKeysBar } from './pos/FKeysBar'
import { SalesView } from './pos/SalesView'
import { StockView } from './pos/StockView'
import { AddItemModal } from './pos/AddItemModal'
import { PaymentModal } from './pos/PaymentModal'
import { ReceiptModal, ReceiptData } from './pos/ReceiptModal'
import { Toast } from './pos/Toast'
import { useToast } from './pos/useToast'
import { Cart, calcTotals } from './pos/types'

function App(): React.JSX.Element {
  const [view, setView] = useState<'sales' | 'stock'>('sales')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [cart, setCart] = useState<Cart>({})
  const [discountInput, setDiscountInput] = useState('0')
  const [orderNo, setOrderNo] = useState(1001)
  const [refreshSignal, setRefreshSignal] = useState(0)
  const [addItemOpen, setAddItemOpen] = useState(false)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)
  const [categories, setCategories] = useState<CategoryCount[]>([])
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const { message, visible, toast } = useToast()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    window.api.product.categories().then(setCategories).catch(console.error)
  }, [refreshSignal])

  const addToCart = (item: Item): void => {
    if (item.Stock <= 0) {
      toast(`${item.Product_Name} is out of stock`)
      return
    }
    const cur = cart[item.SKU]?.qty ?? 0
    if (cur + 1 > item.Stock) {
      toast(`Only ${item.Stock} of ${item.Product_Name} in stock`)
      return
    }
    setCart((c) => ({ ...c, [item.SKU]: { item, qty: cur + 1 } }))
  }

  const setQty = (sku: string, delta: number): void => {
    setCart((c) => {
      const line = c[sku]
      if (!line) return c
      const n = line.qty + delta
      if (n > line.item.Stock) {
        toast(`Only ${line.item.Stock} in stock`)
        return c
      }
      if (n <= 0) {
        const next = { ...c }
        delete next[sku]
        return next
      }
      return { ...c, [sku]: { ...line, qty: n } }
    })
  }

  const removeFromCart = (sku: string): void => {
    setCart((c) => {
      const next = { ...c }
      delete next[sku]
      return next
    })
  }

  const voidSale = (): void => {
    if (!Object.keys(cart).length) return
    setCart({})
    setDiscountInput('0')
    toast('Sale voided')
  }

  const startPay = (): void => {
    if (!Object.keys(cart).length) {
      toast('Nothing to pay')
      return
    }
    setPaymentOpen(true)
  }

  const confirmPay = (method: string, paid: number): void => {
    const totals = calcTotals(cart, Number(discountInput) || 0)
    if (method === 'Cash' && paid < totals.total - 0.001) {
      toast('Tendered amount is less than the total')
      return
    }
    const lines = Object.values(cart).map((l) => ({
      name: l.item.Product_Name,
      qty: l.qty,
      price: l.item.Price_LKR
    }))
    Promise.all(Object.entries(cart).map(([sku, l]) => window.api.product.adjustStock(sku, -l.qty)))
      .then(() => {
        setReceiptData({ orderNo, date: new Date(), lines, totals, method, paid })
        setCart({})
        setDiscountInput('0')
        setOrderNo((n) => n + 1)
        setPaymentOpen(false)
        setReceiptOpen(true)
        setRefreshSignal((v) => v + 1)
      })
      .catch(console.error)
  }

  const saveNewItem = (
    name: string,
    sku: string,
    barcode: number,
    category: string,
    price: number,
    qty: number
  ): void => {
    window.api.product
      .add({ SKU: sku, Barcode: barcode, Product_Name: name, Category: category, Price_LKR: price, Stock: qty })
      .then(() => {
        setAddItemOpen(false)
        toast(`Added ${name}`)
        setRefreshSignal((v) => v + 1)
      })
      .catch(() => toast('That SKU already exists'))
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent): void => {
      const modalOpen = addItemOpen || paymentOpen || receiptOpen
      if (e.key === 'Escape') {
        setAddItemOpen(false)
        setPaymentOpen(false)
        setReceiptOpen(false)
        return
      }
      const fkeys: Record<string, () => void> = {
        F1: () => setView('sales'),
        F2: () => setView('stock'),
        F3: () => {
          setView('sales')
          setTimeout(() => {
            searchInputRef.current?.focus()
            searchInputRef.current?.select()
          }, 0)
        },
        F4: () => view === 'sales' && voidSale(),
        F5: () => setView('sales'),
        F6: () => setAddItemOpen(true),
        F9: () => view === 'sales' && startPay()
      }
      if (fkeys[e.key] && (!modalOpen || e.key === 'F9')) {
        e.preventDefault()
        fkeys[e.key]()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, cart, addItemOpen, paymentOpen, receiptOpen])

  useEffect(() => {
    if (view === 'sales') searchInputRef.current?.focus()
  }, [view])

  const totals = calcTotals(cart, Number(discountInput) || 0)

  return (
    <>
      <TitleBar theme={theme} onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))} />
      <div className="flex min-h-0 flex-1">
        <SalesView
          active={view === 'sales'}
          searchInputRef={searchInputRef}
          cart={cart}
          orderNo={orderNo}
          discountInput={discountInput}
          refreshSignal={refreshSignal}
          onDiscountChange={setDiscountInput}
          onAdd={addToCart}
          onQty={setQty}
          onRemove={removeFromCart}
          onVoid={voidSale}
          onPay={startPay}
        />
        <StockView
          active={view === 'stock'}
          refreshSignal={refreshSignal}
          onAddItem={() => setAddItemOpen(true)}
          onReceived={(name, qty) => {
            toast(`Received ${qty} × ${name}`)
            setRefreshSignal((v) => v + 1)
          }}
        />
      </div>
      <FKeysBar
        view={view}
        onSales={() => setView('sales')}
        onStock={() => setView('stock')}
        onFindItem={() => {
          setView('sales')
          searchInputRef.current?.focus()
        }}
        onVoid={voidSale}
        onDiscount={() => setView('sales')}
        onNewItem={() => setAddItemOpen(true)}
        onPay={startPay}
      />

      <AddItemModal
        open={addItemOpen}
        categories={categories}
        onClose={() => setAddItemOpen(false)}
        onSave={saveNewItem}
      />
      <PaymentModal
        open={paymentOpen}
        total={totals.total}
        onClose={() => setPaymentOpen(false)}
        onConfirm={confirmPay}
      />
      <ReceiptModal
        open={receiptOpen}
        data={receiptData}
        onClose={() => {
          setReceiptOpen(false)
          if (view === 'sales') searchInputRef.current?.focus()
        }}
      />
      <Toast message={message} visible={visible} />
    </>
  )
}

export default App
