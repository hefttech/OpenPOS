import { CategoryCount } from '../../../main/types'

interface Props {
  categories: CategoryCount[]
  active: string
  onSelect: (category: string) => void
}

export function CategoryList({ categories, active, onSelect }: Props): React.JSX.Element {
  return (
    <div className="flex w-[168px] flex-shrink-0 flex-col overflow-hidden rounded-md border border-[var(--line)] bg-[var(--panel)]">
      <h3 className="flex-shrink-0 px-4 py-[13px] text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
        Categories
      </h3>
      <ul className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-2">
        {categories.map((c) => (
          <li
            key={c.category}
            onClick={() => onSelect(c.category)}
            className={`flex cursor-pointer items-center justify-between rounded-md px-3 py-2.5 font-medium transition-colors ${
              c.category === active
                ? 'bg-[var(--accent)] font-semibold text-white'
                : 'text-[var(--ink2)] hover:bg-[var(--soft)]'
            }`}
          >
            {c.category}
            <span className="text-[11.5px] font-medium opacity-70">{c.count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
