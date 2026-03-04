// Theme toggle
(function () {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    root.classList.add('dark');
    icon.classList.remove('ri-moon-line');
    icon.classList.add('ri-sun-line');
  }
  toggle?.addEventListener('click', () => {
    root.classList.toggle('dark');
    const isDark = root.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    icon.classList.toggle('ri-moon-line', !isDark);
    icon.classList.toggle('ri-sun-line', isDark);
  });
})();

// Mobile nav toggle
(function () {
  const btn = document.getElementById('navToggle');
  const list = document.getElementById('navList');
  btn?.addEventListener('click', () => list?.classList.toggle('open'));
  list?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => list.classList.remove('open')));
})();

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Set Projects Completed stat dynamically
(function () {
  const projectsCount = document.querySelectorAll('.project-card').length;
  const statEl = document.getElementById('statProjects');
  if (statEl && projectsCount > 0) {
    statEl.setAttribute('data-target', String(projectsCount));
  }
})();

// Project gallery lightbox
(function () {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  const imgEl = document.getElementById('lightboxImage');
  const btnPrev = lightbox.querySelector('.lb-prev');
  const btnNext = lightbox.querySelector('.lb-next');
  const btnClose = lightbox.querySelector('.lb-close');
  const counter = lightbox.querySelector('.lb-counter');

  let images = [];
  let index = 0;

  function update() {
    if (!images.length) return;
    imgEl.src = images[index];
    counter.textContent = `${index + 1} / ${images.length}`;
  }

  function open(gallery) {
    images = gallery.filter(Boolean);
    index = 0;
    if (!images.length) return;
    update();
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    images = [];
    index = 0;
  }

  btnPrev?.addEventListener('click', () => {
    if (!images.length) return;
    index = (index - 1 + images.length) % images.length;
    update();
  });
  btnNext?.addEventListener('click', () => {
    if (!images.length) return;
    index = (index + 1) % images.length;
    update();
  });
  btnClose?.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') btnPrev?.click();
    if (e.key === 'ArrowRight') btnNext?.click();
  });

  // Wire up gallery buttons
  document.querySelectorAll('.project-card .btn-gallery').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.project-card');
      if (!card) return;
      const list = (card.getAttribute('data-images') || '').split(',').map(s => s.trim());
      open(list);
    });
  });
})();

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const el = document.querySelector(targetId);
    if (!el) return;
    e.preventDefault();
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
  });
});

// Header shadow on scroll + active nav link
(function () {
  const header = document.querySelector('.site-header');
  const sections = Array.from(document.querySelectorAll('main .section'));
  const links = Array.from(document.querySelectorAll('.nav-list a'));
  const map = new Map(links.map(a => [a.getAttribute('href'), a]));
  const setActive = () => {
    const pos = window.scrollY + 120;
    let current = '#hero';
    sections.forEach(sec => { if (pos >= sec.offsetTop) current = '#' + sec.id; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === current));
  };
  const onScroll = () => {
    if (window.scrollY > 10) header.classList.add('has-shadow'); else header.classList.remove('has-shadow');
    setActive();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  setActive();
})();

// Stats counters
(function () {
  const counters = document.querySelectorAll('.stat-num');
  const opts = { threshold: 0.6 };
  const animate = (el) => {
    const target = parseInt(el.getAttribute('data-target') || '0', 10);
    const duration = 1200;
    const start = performance.now();
    const from = 0;
    function step(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(from + (target - from) * eased).toString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, opts);
  counters.forEach(c => io.observe(c));
})();

// Project filtering
(function () {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  buttons.forEach(btn => btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.getAttribute('data-filter');
    cards.forEach(card => {
      const cat = card.getAttribute('data-category');
      card.style.display = (filter === 'all' || filter === cat) ? '' : 'none';
    });
  }));
})();

// Certificates carousel
(function () {
  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;
  const track = carousel.querySelector('.carousel-track');
  const prev = carousel.querySelector('.prev');
  const next = carousel.querySelector('.next');
  const step = 300;
  prev?.addEventListener('click', () => track.scrollBy({ left: -step, behavior: 'smooth' }));
  next?.addEventListener('click', () => track.scrollBy({ left: step, behavior: 'smooth' }));
})();

// Contact form validation + AJAX (FormSubmit)
(function () {
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  if (!form) return;

  function showToast(message, ok = true) {
    if (!toast) return alert(message);
    toast.textContent = message;
    toast.style.borderColor = ok ? 'var(--outline)' : '#d9534f';
    toast.style.backgroundColor = ok ? 'var(--bg)' : '#fee';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 6000);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);

    // Honeypot check
    if (data.get('company')) return;

    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();

    // Validation
    if (!name || !email || !message) {
      return showToast('Please fill in all fields', false);
    }
    if (!isValidEmail(email)) {
      return showToast('Please enter a valid email address', false);
    }
    if (message.length < 10) {
      return showToast('Please enter a more detailed message', false);
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const res = await fetch('https://formsubmit.co/ajax/lahsenoumoulid2003@gmail.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: data
      });

      if (res.ok) {
        form.reset();
        showToast('IMPORTANT: Only for the FIRST time, please check your email inbox to activate FormSubmit!');
      } else {
        showToast('Failed to send message. Please try again later.', false);
      }
    } catch (err) {
      console.error('Contact form error:', err);
      showToast('Network error while sending message. Check your connection.', false);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
})();

// GSAP animations
window.addEventListener('load', () => {
  if (!window.gsap) return;
  const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'power2.out' } });
  tl.from('.site-header', { y: -40, opacity: 0 })
    .from('.headline', { y: 20, opacity: 0 }, '-=0.4')
    .from('.subheadline', { y: 20, opacity: 0 }, '-=0.6')
    .from('.cta-row', { y: 20, opacity: 0 }, '-=0.7')
    .from('.avatar', { scale: 0.9, opacity: 0 }, '-=0.6');

  if (window.ScrollTrigger) {
    gsap.utils.toArray('.section').forEach((sec) => {
      gsap.from(sec.querySelectorAll('h2, .two-col > *, .skills-grid > *, .timeline-item, .projects-grid > *, .certificate-card, .gallery-grid img, blockquote, .contact-form, .contact-links'), {
        opacity: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: { trigger: sec, start: 'top 78%' }
      });
    });
  }
});



