import { useCallback, useRef, useState } from 'react'

export function useToast(): { message: string; visible: boolean; toast: (msg: string) => void } {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const toast = useCallback((msg: string) => {
    setMessage(msg)
    setVisible(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setVisible(false), 2000)
  }, [])

  return { message, visible, toast }
}
