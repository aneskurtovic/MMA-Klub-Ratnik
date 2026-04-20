document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ==========================================
  // 1. LANGUAGE SWITCHER
  // ==========================================
  var currentLang = localStorage.getItem('ratnik-lang') || 'bs';
  var langToggle = document.getElementById('langToggle');

  function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      var value = getNestedValue(translations[lang], key);
      if (value !== null) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = value;
        } else if (value.indexOf('\n') !== -1) {
          el.innerHTML = value.replace(/\n/g, '<br>');
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

  setLanguage(currentLang);

  // ==========================================
  // 2. NAVBAR SCROLL + STICKY CTA VISIBILITY
  // ==========================================
  var navbar = document.getElementById('navbar');
  var stickyCta = document.getElementById('stickyCta');
  var hero = document.getElementById('hero');

  function onScroll() {
    var y = window.pageYOffset;

    if (y > 50) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }

    // Sticky CTA appears after hero scrolls out, hides near the contact section
    if (stickyCta && hero) {
      var heroBottom = hero.offsetTop + hero.offsetHeight;
      var contactEl = document.getElementById('contact');
      var contactTop = contactEl ? contactEl.offsetTop - 200 : Infinity;
      var inZone = y > heroBottom - 80 && y < contactTop;
      stickyCta.classList.toggle('visible', inZone);
    }

    if (backToTop) {
      backToTop.classList.toggle('visible', y > 400);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ==========================================
  // 3. SMOOTH SCROLL NAVIGATION
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var navbarHeight = navbar.offsetHeight;
      var targetPosition = target.offsetTop - navbarHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      closeMobileMenu();
    });
  });

  // ==========================================
  // 4. MOBILE MENU TOGGLE
  // ==========================================
  var menuToggle = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', function() {
    var isOpen = menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  function closeMobileMenu() {
    menuToggle.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  // ==========================================
  // 5. SCROLL ANIMATIONS + COUNTERS
  // ==========================================
  var animateElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });

    animateElements.forEach(function(el) { observer.observe(el); });

    // Trust strip counters: animate once on entry
    var trustStrip = document.getElementById('trust');
    if (trustStrip) {
      var trustObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            animateCounters(entry.target);
            trustObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.25 });
      trustObserver.observe(trustStrip);
    }
  } else {
    animateElements.forEach(function(el) { el.classList.add('visible'); });
  }

  function animateCounters(container) {
    container.querySelectorAll('[data-count]').forEach(function(counter) {
      var target = parseInt(counter.getAttribute('data-count'), 10);
      if (isNaN(target)) return;
      var duration = 1400;
      var step = Math.max(1, target / (duration / 16));
      var current = 0;
      counter.textContent = '0';
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
  // 6. FAQ ACCORDION
  // ==========================================
  document.querySelectorAll('.faq-q').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = btn.closest('.faq-item');
      var answer = item.querySelector('.faq-a');
      var isOpen = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
      if (isOpen) {
        answer.hidden = false;
      } else {
        answer.hidden = true;
      }
    });
  });

  // ==========================================
  // 7. CONTACT FORM — Formspree + fallback
  // ==========================================
  var contactForm = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      var nameInput = contactForm.querySelector('#name');
      var emailInput = contactForm.querySelector('#email');
      var messageInput = contactForm.querySelector('#message');

      contactForm.querySelectorAll('.error').forEach(function(el) {
        el.classList.remove('error');
        el.removeAttribute('aria-invalid');
      });
      contactForm.querySelectorAll('.form-error').forEach(function(el) {
        el.hidden = true;
      });

      var valid = true;

      if (!nameInput.value.trim()) {
        nameInput.classList.add('error');
        nameInput.setAttribute('aria-invalid', 'true');
        document.getElementById('name-error').hidden = false;
        valid = false;
      }
      if (!emailInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
        emailInput.classList.add('error');
        emailInput.setAttribute('aria-invalid', 'true');
        document.getElementById('email-error').hidden = false;
        valid = false;
      }
      if (!messageInput.value.trim()) {
        messageInput.classList.add('error');
        messageInput.setAttribute('aria-invalid', 'true');
        document.getElementById('message-error').hidden = false;
        valid = false;
      }

      if (!valid) return;

      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = '…';

      var action = contactForm.getAttribute('action') || '';
      var isFormspreeConfigured = action.indexOf('YOUR_FORM_ID') === -1 && /formspree\.io\/f\/.+/.test(action);

      function showSuccess() {
        contactForm.style.display = 'none';
        formSuccess.hidden = false;
        setTimeout(function() {
          contactForm.reset();
          contactForm.style.display = '';
          formSuccess.hidden = true;
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }, 6000);
      }

      function showError() {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        var msg = getNestedValue(translations[currentLang], 'contact.errorSubmit') || 'Send failed.';
        alert(msg);
      }

      if (!isFormspreeConfigured) {
        // Formspree endpoint not set yet — show local success (no network call)
        showSuccess();
        return;
      }

      var data = new FormData(contactForm);
      fetch(action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function(res) {
        if (res.ok) showSuccess();
        else showError();
      }).catch(showError);
    });

    ['name', 'email', 'message'].forEach(function(fieldId) {
      var field = document.getElementById(fieldId);
      if (!field) return;
      field.addEventListener('input', function() {
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
        var errorEl = document.getElementById(fieldId + '-error');
        if (errorEl) errorEl.hidden = true;
      });
    });
  }

  // ==========================================
  // 8. BACK TO TOP
  // ==========================================
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

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

    sections.forEach(function(section) { sectionObserver.observe(section); });
  }

  // Initial scroll-state evaluation
  onScroll();
});
