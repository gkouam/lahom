import NavBar from '@/components/NavBar'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import LandingPage from '@/components/landing/LandingPage'

export default function Home() {
  return (
    <>
      <div className="kente-bar"></div>
      <NavBar />
      <LandingPage />
      <WhatsAppFloat />
    </>
  )
}
