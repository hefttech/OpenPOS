interface Props {
  view: 'sales' | 'stock'
  onSales: () => void
  onStock: () => void
  onFindItem: () => void
  onVoid: () => void
  onDiscount: () => void
  onNewItem: () => void
  onPay: () => void
}

export function FKeysBar({
  view,
  onSales,
  onStock,
  onFindItem,
  onVoid,
  onDiscount,
  onNewItem,
  onPay
}: Props): React.JSX.Element {
  const base =
    'flex h-full flex-[0_1_128px] items-center justify-center gap-2 rounded-md border border-white/[0.08] bg-white/[0.07] px-2.5 text-[12.5px] text-[#dfe3ec] hover:bg-white/[0.14]'
  const activeClass = 'bg-[var(--accent)] border-[var(--accent)] hover:bg-[var(--accent)]'
  const kbd = 'rounded-md bg-white/[0.14] px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-white'

  return (
    <div className="flex h-[54px] flex-shrink-0 items-center gap-1.5 bg-[var(--head)] px-3 py-1.5">
      <button className={`${base} ${view === 'sales' ? activeClass : ''}`} onClick={onSales}>
        <b className={kbd}>F1</b>
        <span>Sales</span>
      </button>
      <button className={`${base} ${view === 'stock' ? activeClass : ''}`} onClick={onStock}>
        <b className={kbd}>F2</b>
        <span>Stock</span>
      </button>
      <button className={base} onClick={onFindItem}>
        <b className={kbd}>F3</b>
        <span>Find item</span>
      </button>
      <button className={base} onClick={onVoid}>
        <b className={kbd}>F4</b>
        <span>Void sale</span>
      </button>
      <button className={base} onClick={onDiscount}>
        <b className={kbd}>F5</b>
        <span>Discount</span>
      </button>
      <button className={base} onClick={onNewItem}>
        <b className={kbd}>F6</b>
        <span>New item</span>
      </button>
      <div className="flex-1" />
      <button
        className={`${base} font-semibold ${activeClass}`}
        onClick={onPay}
      >
        <b className={kbd}>F9</b>
        <span>Pay</span>
      </button>
    </div>
  )
}
