'use client'

import { useEffect } from 'react'
import Image from 'next/image'

interface LightboxProps {
  src: string
  alt: string
  caption: string
  onClose: () => void
}

export default function Lightbox({ src, alt, caption, onClose }: LightboxProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  return (
    <div className="lightbox open" role="dialog" aria-hidden="false" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <button className="lb-close" aria-label="Close" onClick={onClose}>×</button>
      <figure>
        <Image src={src} alt={alt} width={1200} height={800} style={{ width: '100%', height: 'auto' }} />
        <figcaption>{caption}</figcaption>
      </figure>
    </div>
  )
}
