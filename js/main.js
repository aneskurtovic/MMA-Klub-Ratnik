document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ==========================================
  // 1. LANGUAGE SWITCHER
  // ==========================================
  let currentLang = localStorage.getItem('ratnik-lang') || 'bs';
  const langToggle = document.getElementById('langToggle');

  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      var value = getNestedValue(translations[lang], key);
      if (value !== null) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = value;
        } else {
          el.textContent = value;
        }
      }
    });

    updateLangToggleUI(lang);
    localStorage.setItem('ratnik-lang', lang);
  }

  function getNestedValue(obj, path) {
    return path.split('.').reduce(function(acc, part) {
      return acc && acc[part] !== undefined ? acc[part] : null;
    }, obj);
  }

  function updateLangToggleUI(lang) {
    var active = langToggle.querySelector('.lang-active');
    var inactive = langToggle.querySelector('.lang-inactive');
    if (lang === 'bs') {
      active.textContent = 'BS';
      inactive.textContent = 'EN';
    } else {
      active.textContent = 'EN';
      inactive.textContent = 'BS';
    }
  }

  langToggle.addEventListener('click', function() {
    setLanguage(currentLang === 'bs' ? 'en' : 'bs');
  });

  // Apply saved language on load
  setLanguage(currentLang);

  // ==========================================
  // 2. NAVBAR SCROLL BEHAVIOR
  // ==========================================
  var navbar = document.getElementById('navbar');

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 50) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }, { passive: true });

  // ==========================================
  // 3. SMOOTH SCROLL NAVIGATION
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      var targetId = this.getAttribute('href');
      var target = document.querySelector(targetId);
      if (target) {
        var navbarHeight = navbar.offsetHeight;
        var targetPosition = target.offsetTop - navbarHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        closeMobileMenu();
      }
    });
  });

  // ==========================================
  // 4. MOBILE MENU TOGGLE
  // ==========================================
  var menuToggle = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', function() {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

  function closeMobileMenu() {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  // ==========================================
  // 5. SCROLL ANIMATIONS (Intersection Observer)
  // ==========================================
  var animateElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Trigger counter animation if stat numbers are present
          var counters = entry.target.querySelectorAll('.stat-number');
          if (counters.length > 0) {
            animateCounters(entry.target);
          }

          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    });

    animateElements.forEach(function(el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything
    animateElements.forEach(function(el) {
      el.classList.add('visible');
    });
  }

  // ==========================================
  // 6. COUNTER ANIMATION
  // ==========================================
  function animateCounters(container) {
    container.querySelectorAll('.stat-number').forEach(function(counter) {
      var target = parseInt(counter.getAttribute('data-count'), 10);
      var duration = 2000;
      var step = target / (duration / 16);
      var current = 0;

      var timer = setInterval(function() {
        current += step;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, 16);
    });
  }

  // ==========================================
  // 7. GALLERY LIGHTBOX
  // ==========================================
  var lightbox = document.getElementById('lightbox');
  var galleryItems = document.querySelectorAll('.gallery-item');
  var lightboxCaption = lightbox.querySelector('.lightbox-caption');
  var lightboxImageContainer = lightbox.querySelector('.lightbox-image-container');
  var currentIndex = 0;

  galleryItems.forEach(function(item, index) {
    item.addEventListener('click', function() {
      currentIndex = index;
      openLightbox();
    });
  });

  function openLightbox() {
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    updateLightboxContent();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    var item = galleryItems[currentIndex];
    var placeholder = item.querySelector('.gallery-placeholder');
    var captionEl = placeholder.querySelector('span');
    lightboxCaption.textContent = captionEl ? captionEl.textContent : '';

    // Clone the placeholder content for display
    lightboxImageContainer.innerHTML = '';
    var icon = document.createElement('i');
    icon.className = 'fas fa-image';
    lightboxImageContainer.appendChild(icon);
  }

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);

  lightbox.querySelector('.lightbox-prev').addEventListener('click', function() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightboxContent();
  });

  lightbox.querySelector('.lightbox-next').addEventListener('click', function() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    updateLightboxContent();
  });

  // Close on backdrop click
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      updateLightboxContent();
    }
    if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % galleryItems.length;
      updateLightboxContent();
    }
  });

  // ==========================================
  // 8. CONTACT FORM HANDLING
  // ==========================================
  var contactForm = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    var nameInput = contactForm.querySelector('#name');
    var emailInput = contactForm.querySelector('#email');
    var messageInput = contactForm.querySelector('#message');

    // Clear previous errors
    contactForm.querySelectorAll('.error').forEach(function(el) {
      el.classList.remove('error');
    });

    var valid = true;

    if (!nameInput.value.trim()) {
      nameInput.classList.add('error');
      valid = false;
    }

    if (!emailInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
      emailInput.classList.add('error');
      valid = false;
    }

    if (!messageInput.value.trim()) {
      messageInput.classList.add('error');
      valid = false;
    }

    if (valid) {
      contactForm.style.display = 'none';
      formSuccess.hidden = false;

      setTimeout(function() {
        contactForm.reset();
        contactForm.style.display = '';
        formSuccess.hidden = true;
      }, 5000);
    }
  });

  // ==========================================
  // 9. ACTIVE NAV LINK HIGHLIGHTING
  // ==========================================
  var sections = document.querySelectorAll('section[id]');
  var navLinksAll = document.querySelectorAll('.nav-links a');

  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          navLinksAll.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { rootMargin: '-50% 0px -50% 0px' });

    sections.forEach(function(section) {
      sectionObserver.observe(section);
    });
  }
});
