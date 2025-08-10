// src/components/ModalPortal.tsx
import { ReactNode } from 'react'
import ReactDOM from 'react-dom'

export default function ModalPortal({ children }: { children: ReactNode }) {
  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return null
  return ReactDOM.createPortal(children, modalRoot)
}
