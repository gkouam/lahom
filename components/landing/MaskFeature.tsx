'use client'

import Image from 'next/image'

export default function MaskFeature() {
  return (
    <section className="section mask-feature">
      <div className="mask-split">
        <div className="mask-photo-side">
          <Image
            src="/images/dallas-museum-elephant-mask.jpg"
            alt="Close-up of Bamiléké elephant mask beadwork"
            className="mask-photo"
            width={800}
            height={600}
            loading="lazy"
          />
        </div>
        <div className="mask-text-side fade-in">
          <span className="sec-label">The Elephant Mask</span>
          <h2 className="sec-title">Mbap <i>Mteng</i></h2>
          <p>The elephant mask is the most iconic symbol of Bamiléké artistic achievement. With protruding circular ears, geometric beadwork, and rows of isosceles triangles — the sacred symbol of the leopard — it represents the Fon&apos;s power to transform into nature&apos;s mightiest creatures.</p>
          <p>This very mask resides in the <strong>Dallas Museum of Art</strong> — a living bridge connecting our ancestral homeland to our Texas community.</p>
          <div className="mask-symbols">
            <div className="symbol">
              <svg viewBox="0 0 36 36" fill="none"><path d="M18 4L32 28H4Z" stroke="var(--gold)" strokeWidth="1.5" fill="var(--gold)" fillOpacity="0.12" /></svg>
              <span>Leopard<br /><small>Power</small></span>
            </div>
            <div className="symbol">
              <svg viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="14" stroke="var(--gold)" strokeWidth="1.5" fill="var(--gold)" fillOpacity="0.06" /></svg>
              <span>Elephant<br /><small>Wisdom</small></span>
            </div>
            <div className="symbol">
              <svg viewBox="0 0 36 36" fill="none"><path d="M18 2L34 18L18 34L2 18Z" stroke="var(--gold)" strokeWidth="1.5" fill="var(--gold)" fillOpacity="0.08" /></svg>
              <span>Royal<br /><small>Authority</small></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
