/* ===================================================
   BOWLING U ALBERTA — Script
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Sticky Header --- */
  const header = document.getElementById('header');

  const onScroll = () => {
    header.classList.toggle('header--scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* --- Mobile Navigation --- */
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');

  if (burger && mobileNav) {
    const toggleNav = (open) => {
      const isOpen = typeof open === 'boolean' ? open : !mobileNav.classList.contains('active');
      burger.classList.toggle('active', isOpen);
      mobileNav.classList.toggle('active', isOpen);
      header.classList.toggle('header--nav-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    burger.addEventListener('click', () => toggleNav());

    // Close on link click
    mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
      link.addEventListener('click', () => toggleNav(false));
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        toggleNav(false);
      }
    });
  }


  /* --- Smooth Scroll with header offset --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerH = header ? header.offsetHeight : 90;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 20;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* --- Hero scroll indicator --- */
  const heroScroll = document.getElementById('heroScroll');
  if (heroScroll) {
    heroScroll.addEventListener('click', () => {
      const about = document.getElementById('o-nas');
      if (about) {
        const top = about.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight || 90) - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  }


  /* --- Scroll Reveal (IntersectionObserver) --- */
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('revealed'));
  }


  /* --- Menu Tabs --- */
  const tabs = document.querySelectorAll('.menu__tab');
  const panels = document.querySelectorAll('.menu__panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      panels.forEach(p => {
        p.classList.remove('active');
        if (p.id === `panel-${target}`) {
          p.classList.add('active');
          // Re-trigger reveal for inner grid
          const grid = p.querySelector('.menu__grid');
          if (grid && !grid.classList.contains('revealed')) {
            grid.classList.add('revealed');
          }
        }
      });
    });
  });


  /* --- Reservation Form Validation --- */
  const form = document.getElementById('reservationForm');
  const success = document.getElementById('formSuccess');

  if (form) {
    const show = (id, msg) => {
      const el = document.getElementById(`${id}-error`);
      const group = el?.closest('.form__group');
      if (el) { el.textContent = msg; el.classList.add('visible'); }
      if (group) group.classList.add('has-error');
    };

    const clear = (id) => {
      const el = document.getElementById(`${id}-error`);
      const group = el?.closest('.form__group');
      if (el) { el.textContent = ''; el.classList.remove('visible'); }
      if (group) group.classList.remove('has-error');
    };

    // Real-time validation on blur
    ['name', 'phone', 'date', 'time'].forEach(field => {
      const el = document.getElementById(field);
      if (!el) return;

      el.addEventListener('blur', () => {
        clear(field);
        if (!el.value.trim()) {
          show(field, 'Toto pole je povinné');
        } else if (field === 'phone' && !/^[\d\s\+\-]{6,}$/.test(el.value.trim())) {
          show(field, 'Zadejte platné telefonní číslo');
        }
      });

      el.addEventListener('input', () => clear(field));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      ['name', 'phone', 'date', 'time'].forEach(field => {
        clear(field);
        const el = document.getElementById(field);
        if (!el || !el.value.trim()) {
          show(field, 'Toto pole je povinné');
          valid = false;
        } else if (field === 'phone' && !/^[\d\s\+\-]{6,}$/.test(el.value.trim())) {
          show(field, 'Zadejte platné telefonní číslo');
          valid = false;
        }
      });

      if (valid && success) {
        success.classList.add('visible');
        form.reset();
      }
    });
  }


  /* --- Set minimum date to today --- */
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

});
