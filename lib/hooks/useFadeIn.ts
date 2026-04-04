'use client'

import { useEffect, useRef } from 'react'

export function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    // Observe the element itself and all .fade-in children
    const fadeElements = el.querySelectorAll('.fade-in')
    fadeElements.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  return ref
}
