import { useEffect, useState } from 'react'

interface Props {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export function TitleBar({ theme, onToggleTheme }: Props): React.JSX.Element {
  const [clock, setClock] = useState('')

  useEffect(() => {
    const tick = (): void =>
      setClock(
        new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      )
    tick()
    const id = window.setInterval(tick, 15000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="flex h-11 flex-shrink-0 items-center gap-[18px] bg-[var(--head)] px-4 text-[12.5px] text-[var(--head-ink)]">
      <div className="flex items-center gap-2.5 text-sm font-bold tracking-wide">
        <i className="grid h-[22px] w-[22px] place-items-center rounded-md bg-[var(--accent)] text-xs font-extrabold text-white not-italic">
          P
        </i>
        POS Register
      </div>
      <span className="flex items-center gap-1.5 rounded bg-white/5 px-2.5 py-1 text-[#c9cfdb]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#3ddc84]" />
        Main Branch · Terminal 01
      </span>
      <span className="rounded bg-white/5 px-2.5 py-1 text-[#c9cfdb]">Cashier: Admin</span>
      <div className="flex-1" />
      <span className="font-mono opacity-80">{clock}</span>
      <button
        className="rounded bg-white/10 px-3 py-1.5 text-xs text-[#dfe3ec] hover:bg-white/20"
        onClick={onToggleTheme}
      >
        {theme === 'dark' ? 'Light mode' : 'Dark mode'}
      </button>
    </div>
  )
}
