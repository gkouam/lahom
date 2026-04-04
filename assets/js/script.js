// ═══ MOBILE NAV TOGGLE ═══
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });
}

// ═══ SCROLL REVEAL ═══
const fadeItems = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

fadeItems.forEach(item => fadeObserver.observe(item));

// ═══ LIGHTBOX ═══
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox?.querySelector('img');
const lbCap = lightbox?.querySelector('figcaption');
const lbClose = lightbox?.querySelector('.lb-close');

function openLightbox(src, alt, cap) {
  if (!lightbox || !lbImg) return;
  lbImg.src = src;
  lbImg.alt = alt || '';
  if (lbCap) lbCap.textContent = cap || '';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.gallery-item').forEach(btn => {
  btn.addEventListener('click', () => {
    openLightbox(btn.dataset.src, btn.querySelector('img')?.alt, btn.dataset.cap);
  });
});

lbClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// ═══ ACTIVE NAV HIGHLIGHTING ═══
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a:not(.nav-cta)');

const secObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--gold)' : '';
      });
    }
  });
}, { threshold: 0.3 });

sections.forEach(s => secObserver.observe(s));

// ═══ LANGUAGE TOGGLE (FR/EN) ═══
let currentLang = localStorage.getItem('lang') || 'en';
const langToggle = document.getElementById('langToggle');

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-lang-en][data-lang-fr]').forEach(el => {
    const text = el.getAttribute('data-lang-' + lang);
    if (text !== null) el.innerHTML = text;
  });

  // Update the hero eyebrow (has child diamonds)
  const eyebrow = document.querySelector('.hero-eyebrow');
  if (eyebrow) {
    const eyebrowText = eyebrow.getAttribute('data-lang-' + lang);
    if (eyebrowText) {
      eyebrow.innerHTML = '<span class="eyebrow-diamond"></span> ' + eyebrowText + ' <span class="eyebrow-diamond"></span>';
    }
  }

  if (langToggle) langToggle.textContent = lang === 'en' ? 'FR' : 'EN';
}

if (langToggle) {
  langToggle.addEventListener('click', () => {
    applyLang(currentLang === 'en' ? 'fr' : 'en');
  });
}

// Apply saved language on load
if (currentLang !== 'en') applyLang(currentLang);

// ═══ EMAIL FORM VALIDATION ═══
const joinEmail = document.getElementById('joinEmail');
const joinBtn = document.getElementById('joinBtn');
const joinMsg = document.getElementById('joinMsg');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setJoinMsg(text, type) {
  if (!joinMsg) return;
  joinMsg.textContent = text;
  joinMsg.className = 'join-msg ' + type;
}

if (joinBtn && joinEmail) {
  joinBtn.addEventListener('click', () => {
    const val = joinEmail.value.trim();
    joinEmail.classList.remove('error', 'success');

    if (!val) {
      joinEmail.classList.add('error');
      setJoinMsg(currentLang === 'fr' ? 'Veuillez entrer votre adresse e-mail.' : 'Please enter your email address.', 'error');
      return;
    }
    if (!validateEmail(val)) {
      joinEmail.classList.add('error');
      setJoinMsg(currentLang === 'fr' ? 'Veuillez entrer une adresse e-mail valide.' : 'Please enter a valid email address.', 'error');
      return;
    }

    joinEmail.classList.add('success');
    setJoinMsg(currentLang === 'fr' ? 'Merci ! Nous vous contacterons bientôt.' : 'Thank you! We\'ll be in touch soon.', 'success');
    joinEmail.value = '';
    setTimeout(() => {
      joinEmail.classList.remove('success');
      setJoinMsg('', '');
    }, 4000);
  });

  joinEmail.addEventListener('input', () => {
    joinEmail.classList.remove('error', 'success');
    if (joinMsg) joinMsg.textContent = '';
  });
}
