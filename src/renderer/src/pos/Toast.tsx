interface Props {
  message: string
  visible: boolean
}

export function Toast({ message, visible }: Props): React.JSX.Element {
  return (
    <div
      className={`fixed bottom-[70px] left-1/2 z-[99] -translate-x-1/2 rounded-md bg-[#171a21] px-4 py-2.5 font-semibold text-white transition-all duration-200 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      {message}
    </div>
  )
}
