import NavBar from '@/components/NavBar'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import LandingPage from '@/components/landing/LandingPage'
import StickyJoinCta from '@/components/landing/StickyJoinCta'

export default function Home() {
  return (
    <>
      <div className="kente-bar"></div>
      <NavBar />
      <LandingPage />
      <WhatsAppFloat />
      <StickyJoinCta />
    </>
  )
}
