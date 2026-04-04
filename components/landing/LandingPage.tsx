'use client'

import { useFadeIn } from '@/lib/hooks/useFadeIn'
import Hero from './Hero'
import CultureTicker from './CultureTicker'
import HeritageSection from './HeritageSection'
import BahamLocation from './BahamLocation'
import CultureShowcase from './CultureShowcase'
import MaskFeature from './MaskFeature'
import EventsSection from './EventsSection'
import GallerySection from './GallerySection'
import LeadershipSection from './LeadershipSection'
import JoinSection from './JoinSection'
import Footer from './Footer'

export default function LandingPage() {
  const fadeRef = useFadeIn()

  return (
    <div ref={fadeRef}>
      <Hero />
      <CultureTicker />
      <div className="zigzag-border"></div>
      <HeritageSection />
      <BahamLocation />
      <CultureShowcase />
      <MaskFeature />
      <EventsSection />
      <GallerySection />
      <LeadershipSection />
      <JoinSection />
      <Footer />
    </div>
  )
}
