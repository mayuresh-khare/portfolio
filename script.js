/* =========================================
   MAYURESH KHARE – PORTFOLIO SCRIPT
   ========================================= */

(function () {
  'use strict';

  /* ── Loading screen ── */
  const loader = document.getElementById('loader');
  if (loader) {
    // Dismiss after 650 ms — fast enough to feel instant, long enough to animate
    setTimeout(() => {
      loader.classList.add('loader-hidden');
      // Remove from DOM after fade completes so it never blocks clicks
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, 650);
  }

  /* ── Navbar scroll effect ── */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Mobile menu ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileClose = document.getElementById('mobile-close');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const openMenu = () => {
    mobileMenu.classList.add('open');
    mobileOverlay.classList.add('show');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('show');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', openMenu);
  mobileClose.addEventListener('click', closeMenu);
  mobileOverlay.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  /* ── Intersection Observer for scroll reveals ── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  /* ── Active nav link highlight on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');

  const highlightNav = () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.id;
      }
    });
    navLinks.forEach(link => {
      link.style.fontWeight = link.getAttribute('href') === `#${current}` ? '700' : '500';
      link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--navy)' : '';
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  /* ── CGPA bar animation trigger ── */
  const cgpaBars = document.querySelectorAll('.cgpa-bar');
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'grow-bar 1.4s cubic-bezier(0.4,0,0.2,1) forwards';
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  cgpaBars.forEach(bar => {
    bar.style.transform = 'scaleX(0)';
    bar.style.animation = 'none';
    barObserver.observe(bar);
  });

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
        const y = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  /* ── Subtle card tilt on hover (desktop only) ── */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const tiltCards = document.querySelectorAll('.project-card, .cert-card, .about-card');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-5px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.4s ease, box-shadow 0.28s ease, border-color 0.28s ease';
      });
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease, box-shadow 0.28s ease, border-color 0.28s ease';
      });
    });
  }

  /* ── Count-up animation for stat numbers ── */
  const statNums = document.querySelectorAll('.stat-num');
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const raw = el.textContent.trim();
          const numMatch = raw.match(/[\d.]+/);
          if (!numMatch) return;
          const end = parseFloat(numMatch[0]);
          const decimals = (numMatch[0].split('.')[1] || '').length;
          const suffix = raw.replace(numMatch[0], '');
          const duration = 1200;
          const start = performance.now();
          const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = (eased * end).toFixed(decimals) + suffix;
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          countObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.8 }
  );
  statNums.forEach(el => countObserver.observe(el));

  /* ── Learning Journey timeline scroll arrows ── */
  const ljTrack = document.getElementById('lj-track');
  const ljPrev  = document.getElementById('lj-prev');
  const ljNext  = document.getElementById('lj-next');

  if (ljTrack && ljPrev && ljNext) {
    const SCROLL_STEP = 480; // ~2 card widths

    ljPrev.addEventListener('click', () => {
      ljTrack.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' });
    });
    ljNext.addEventListener('click', () => {
      ljTrack.scrollBy({ left:  SCROLL_STEP, behavior: 'smooth' });
    });

    // Show/hide arrows based on scroll position
    const updateArrows = () => {
      ljPrev.style.opacity = ljTrack.scrollLeft > 8 ? '1' : '0.35';
      ljNext.style.opacity =
        ljTrack.scrollLeft < ljTrack.scrollWidth - ljTrack.clientWidth - 8 ? '1' : '0.35';
    };
    ljTrack.addEventListener('scroll', updateArrows, { passive: true });
    updateArrows();
  }

})();
