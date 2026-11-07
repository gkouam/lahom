'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

interface LightboxProps {
  src: string
  alt: string
  caption: string
  onClose: () => void
}

export default function Lightbox({ src, alt, caption, onClose }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      // Only one focusable control inside, so Tab stays on it.
      if (e.key === 'Tab') { e.preventDefault(); closeRef.current?.focus() }
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKey)
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  return (
    <div className="lightbox open" role="dialog" aria-modal="true" aria-label={alt} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <button ref={closeRef} className="lb-close" aria-label="Close" onClick={onClose}>×</button>
      <figure>
        <Image src={src} alt={alt} width={1200} height={800} sizes="(max-width: 900px) 100vw, 900px" style={{ width: '100%', height: 'auto' }} />
        <figcaption>{caption}</figcaption>
      </figure>
    </div>
  )
}
