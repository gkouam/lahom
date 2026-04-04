// ═══ MOBILE NAV TOGGLE ═══
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
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
