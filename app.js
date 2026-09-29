/* ==========================================================================
   מספרת אלמנט - Element Barbershop Production Controller
   Minimalist Luxury Experience
   Features:
   - Real-time opening hours status checker (Sunday-Friday schedule)
   - Interactive Lightbox for high-resolution haircut gallery
   - Animated stats counter with Intersection Observer
   - Smooth scroll reveal animations
   - Top scroll progress indicator
   - Mobile navigation drawer
   - One-click address copy & toast notification
   - Back to top quick action
   - Lucide icons dynamic rendering
   ========================================================================== */

(function () {
  'use strict';

  // DOM Elements
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const siteHeader = document.getElementById('siteHeader');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const menuIcon = document.getElementById('menuIcon');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const openingStatusBadge = document.getElementById('openingStatusBadge');
  const openingStatusText = document.getElementById('openingStatusText');
  const currentYearSpan = document.getElementById('currentYear');
  const toastNotification = document.getElementById('toastNotification');
  const toastText = document.getElementById('toastText');

  // Lightbox Elements
  const imageLightboxModal = document.getElementById('imageLightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');

  /* --------------------------------------------------------------------------
     1. Initialize
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    // Current year in footer
    if (currentYearSpan) {
      currentYearSpan.textContent = new Date().getFullYear();
    }

    // Initialize Lucide icons
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    // Setup interactive features
    initScrollProgress();
    initMobileNav();
    initScrollReveal();
    initStatsCounters();
    initOpeningHours();
    initLightbox();
    initNavHighlight();
  });

  /* --------------------------------------------------------------------------
     2. Top Scroll Progress Indicator & Header State
     -------------------------------------------------------------------------- */
  function initScrollProgress() {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      if (scrollProgressBar) {
        scrollProgressBar.style.width = `${progress}%`;
      }

      // Header shadow / blur on scroll
      if (siteHeader) {
        if (scrollTop > 40) {
          siteHeader.classList.add('scrolled');
        } else {
          siteHeader.classList.remove('scrolled');
        }
      }

      // Back to top button visibility
      if (backToTopBtn) {
        if (scrollTop > 400) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }
    }, { passive: true });

    // Smooth scroll to top
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  /* --------------------------------------------------------------------------
     3. Mobile Navigation Drawer
     -------------------------------------------------------------------------- */
  function initMobileNav() {
    if (!mobileMenuToggle || !mobileDrawer) return;

    function toggleMenu(forceClose = false) {
      const isOpen = forceClose ? false : !mobileDrawer.classList.contains('active');
      mobileDrawer.classList.toggle('active', isOpen);
      mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));

      if (menuIcon) {
        menuIcon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
        if (window.lucide) window.lucide.createIcons();
      }
    }

    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close when clicking nav links
    const drawerLinks = mobileDrawer.querySelectorAll('a');
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMenu(true);
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        if (mobileDrawer.classList.contains('active')) {
          toggleMenu(true);
        }
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
        toggleMenu(true);
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. Scroll Reveal Animations (Intersection Observer)
     -------------------------------------------------------------------------- */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => observer.observe(el));
    } else {
      // Fallback for older browsers
      revealElements.forEach(el => el.classList.add('is-visible'));
    }
  }

  /* --------------------------------------------------------------------------
     5. Animated Stats Counters
     -------------------------------------------------------------------------- */
  function initStatsCounters() {
    const counterElements = document.querySelectorAll('.stat-counter');
    if (!counterElements.length) return;

    let hasRun = false;

    function runCounters() {
      if (hasRun) return;
      hasRun = true;

      counterElements.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target')) || 0;
        const duration = 1800; // ms
        const startTime = performance.now();

        function updateCount(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = Math.floor(easeProgress * target);

          counter.textContent = currentVal.toLocaleString('he-IL');

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            counter.textContent = target.toLocaleString('he-IL');
          }
        }

        requestAnimationFrame(updateCount);
      });
    }

    if ('IntersectionObserver' in window) {
      const statsBar = document.querySelector('.stats-counter-bar');
      if (statsBar) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              runCounters();
              observer.unobserve(statsBar);
            }
          });
        }, { threshold: 0.25 });
        observer.observe(statsBar);
      }
    } else {
      runCounters();
    }
  }

  /* --------------------------------------------------------------------------
     6. Real-time Opening Hours Status Checker
     -------------------------------------------------------------------------- */
  function initOpeningHours() {
    updateOpeningStatus();
    // Re-check status every 60 seconds
    setInterval(updateOpeningStatus, 60000);
  }

  function updateOpeningStatus() {
    if (!openingStatusBadge || !openingStatusText) return;

    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let isOpen = false;
    let closingTimeText = '';
    let openingNextText = '';

    // Schedule:
    // Sunday (0) to Thursday (4): 8:00 (480 min) - 22:00 (1320 min)
    // Friday (5): 8:00 (480 min) - 13:00 (780 min)
    // Saturday (6): Closed

    if (day >= 0 && day <= 4) {
      // Sunday - Thursday
      if (currentMinutes >= 480 && currentMinutes < 1320) {
        isOpen = true;
        closingTimeText = 'עד 22:00';
      } else if (currentMinutes < 480) {
        openingNextText = 'היום ב-8:00';
      } else {
        openingNextText = day === 4 ? 'מחר (שישי) ב-8:00' : 'מחר ב-8:00';
      }
    } else if (day === 5) {
      // Friday
      if (currentMinutes >= 480 && currentMinutes < 780) {
        isOpen = true;
        closingTimeText = 'עד 13:00 (יום שישי)';
      } else {
        openingNextText = 'ביום ראשון ב-8:00';
      }
    } else {
      // Saturday
      openingNextText = 'ביום ראשון ב-8:00';
    }

    if (isOpen) {
      openingStatusBadge.classList.remove('status-closed');
      openingStatusBadge.classList.add('status-open');
      openingStatusText.innerHTML = `<strong>פתוח כעת</strong> • נסגר ב-${closingTimeText}`;
    } else {
      openingStatusBadge.classList.remove('status-open');
      openingStatusBadge.classList.add('status-closed');
      openingStatusText.innerHTML = `<strong>סגור כעת</strong> • נפתח ${openingNextText}`;
    }
  }

  /* --------------------------------------------------------------------------
     7. Photo Gallery Lightbox
     -------------------------------------------------------------------------- */
  function initLightbox() {
    if (!imageLightboxModal) return;

    if (lightboxCloseBtn) {
      lightboxCloseBtn.addEventListener('click', closeLightbox);
    }

    if (lightboxBackdrop) {
      lightboxBackdrop.addEventListener('click', closeLightbox);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && imageLightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  window.openLightbox = function (imgSrc, captionText) {
    if (!imageLightboxModal || !lightboxImg) return;
    lightboxImg.src = imgSrc;
    if (lightboxCaption) {
      lightboxCaption.textContent = captionText || 'מספרת אלמנט';
    }
    imageLightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function () {
    if (!imageLightboxModal) return;
    imageLightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  /* --------------------------------------------------------------------------
     8. Copy Address to Clipboard with Toast Notification
     -------------------------------------------------------------------------- */
  window.copyAddressText = function () {
    const address = 'יוסי בנאי 44';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(address).then(() => {
        showToast('הכתובת הועתקה ללוח: ' + address);
      }).catch(() => {
        fallbackCopy(address);
      });
    } else {
      fallbackCopy(address);
    }
  };

  function fallbackCopy(text) {
    const input = document.createElement('textarea');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand('copy');
      showToast('הכתובת הועתקה: ' + text);
    } catch (e) {
      showToast('יוסי בנאי 44');
    }
    document.body.removeChild(input);
  }

  function showToast(msg) {
    if (!toastNotification || !toastText) return;
    toastText.textContent = msg;
    toastNotification.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3200);
  }

  /* --------------------------------------------------------------------------
     9. Navigation Active State on Scroll
     -------------------------------------------------------------------------- */
  function initNavHighlight() {
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
    const sections = document.querySelectorAll('section[id]');
    if (!navLinks.length || !sections.length) return;

    window.addEventListener('scroll', () => {
      let currentSectionId = '';
      const scrollPos = window.scrollY + 180;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSectionId = section.getAttribute('id');
        }
      });

      if (currentSectionId) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    }, { passive: true });
  }

})();
