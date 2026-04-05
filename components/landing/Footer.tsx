export default function Footer() {
  return (
    <>
      <div className="kente-bar"></div>
      <footer>
        <div className="container footer-grid">
          <div className="footer-brand">
            <h3>Baham Bamiléké<br />Dallas Community</h3>
            <p>Preserving the traditions of the Baham Chieftaincy of Cameroon&apos;s West Region, right here in the heart of Texas. United by heritage, bound by love.</p>
            <div className="footer-flag">
              <span className="fc-green"></span><span className="fc-red"></span><span className="fc-gold"></span>
              Republic of Cameroon
            </div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#heritage">Our Heritage</a></li>
              <li><a href="#culture">Culture &amp; Art</a></li>
              <li><a href="#events">Events</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#leadership">Leadership</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Community</h4>
            <ul>
              <li><a href="#join">Become a Member</a></li>
              <li><a href="#">Donate</a></li>
              <li><a href="#">Youth Programs</a></li>
              <li><a href="#">Volunteer</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <ul>
              <li><a href="#">Facebook</a></li>
              <li><a href="https://chat.whatsapp.com/FdXvBZ537ZdFfJvENDernh" target="_blank" rel="noopener">WhatsApp Group</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">YouTube</a></li>
            </ul>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© 2026 Baham Bamiléké Community of Dallas, TX. All rights reserved.</span>
          <div className="footer-credits">
            Photos: Wikimedia Commons (CC BY-SA) — DILANE MIYO, Wiki Loves Africa, Geremibidias, Mary Harrsch, Devane NDONNANG, IcedCowboyCoffee, Bamiboi
          </div>
        </div>
      </footer>
    </>
  )
}
