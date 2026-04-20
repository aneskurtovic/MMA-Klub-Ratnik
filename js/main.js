/* MMA Klub Ratnik — site JS
   Language switching, navbar scroll, sticky CTA, back-to-top,
   FAQ accordion, contact form, scroll reveals, counters,
   hero parallax. */
(function(){
  'use strict';

  document.addEventListener('DOMContentLoaded', function(){

    // ---- Language switcher ----
    var currentLang = localStorage.getItem('ratnik-lang') || 'bs';
    var langToggle = document.getElementById('langToggle');

    function getNested(obj, path){
      return path.split('.').reduce(function(acc, p){
        return acc && acc[p] !== undefined ? acc[p] : null;
      }, obj);
    }
    function updateLangUI(lang){
      if (!langToggle) return;
      var a = langToggle.querySelector('.lang-active');
      var i = langToggle.querySelector('.lang-inactive');
      if (lang === 'bs'){ a.textContent='BS'; i.textContent='EN'; }
      else { a.textContent='EN'; i.textContent='BS'; }
    }
    function setLanguage(lang){
      currentLang = lang;
      document.documentElement.lang = lang;
      document.querySelectorAll('[data-i18n]').forEach(function(el){
        var key = el.getAttribute('data-i18n');
        var v = getNested(translations[lang], key);
        if (v === null) return;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = v;
        else if (v.indexOf('\n') !== -1) el.innerHTML = v.replace(/\n/g,'<br>');
        else el.textContent = v;
      });
      updateLangUI(lang);
      localStorage.setItem('ratnik-lang', lang);
    }
    if (langToggle){
      langToggle.addEventListener('click', function(){
        setLanguage(currentLang === 'bs' ? 'en' : 'bs');
      });
    }
    setLanguage(currentLang);

    // ---- Navbar scroll, back-to-top, sticky CTA, hero parallax ----
    var navbar = document.getElementById('navbar');
    var stickyCta = document.getElementById('stickyCta');
    var heroEl = document.getElementById('hero');
    var backToTop = document.getElementById('backToTop');
    var heroBg = document.querySelector('.hero-bg');

    function onScroll(){
      var y = window.pageYOffset;
      if (navbar) navbar.classList.toggle('navbar--scrolled', y > 40);
      if (stickyCta && heroEl){
        var heroBottom = heroEl.offsetTop + heroEl.offsetHeight;
        var contactEl = document.getElementById('contact');
        var contactTop = contactEl ? contactEl.offsetTop - 200 : Infinity;
        var inZone = y > heroBottom - 80 && y < contactTop;
        stickyCta.classList.toggle('visible', inZone);
      }
      if (backToTop) backToTop.classList.toggle('visible', y > 500);
      if (heroBg && y < window.innerHeight * 1.5){
        heroBg.style.transform = 'translate3d(0,' + (y * 0.15) + 'px, 0)';
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // ---- Smooth scroll ----
    document.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener('click', function(e){
        var id = this.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var offset = target.offsetTop - (navbar ? navbar.offsetHeight : 0) - 20;
        window.scrollTo({ top: offset, behavior: 'smooth' });
        closeMenu();
      });
    });

    // ---- Mobile menu ----
    var menuToggle = document.getElementById('menuToggle');
    var navLinks = document.getElementById('navLinks');
    function closeMenu(){
      if (!menuToggle) return;
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
      document.body.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded','false');
    }
    if (menuToggle){
      menuToggle.addEventListener('click', function(){
        var open = menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        menuToggle.setAttribute('aria-expanded', open);
      });
    }

    // ---- Scroll reveals + counters + active nav ----
    var animateEls = document.querySelectorAll('.animate-on-scroll');
    if ('IntersectionObserver' in window){
      var obs = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if (en.isIntersecting){
            en.target.classList.add('visible');
            obs.unobserve(en.target);
          }
        });
      }, { threshold: 0.12 });
      animateEls.forEach(function(el){ obs.observe(el); });

      var trust = document.getElementById('trust');
      if (trust){
        var tobs = new IntersectionObserver(function(entries){
          entries.forEach(function(en){
            if (en.isIntersecting){ animateCounters(en.target); tobs.unobserve(en.target); }
          });
        }, { threshold: 0.3 });
        tobs.observe(trust);
      }

      var sections = document.querySelectorAll('section[id]');
      var navAll = document.querySelectorAll('.nav-links a');
      var navObs = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if (en.isIntersecting){
            navAll.forEach(function(l){
              l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id);
            });
          }
        });
      }, { rootMargin: '-50% 0px -50% 0px' });
      sections.forEach(function(s){ navObs.observe(s); });
    } else {
      animateEls.forEach(function(el){ el.classList.add('visible'); });
    }

    function animateCounters(container){
      container.querySelectorAll('[data-count]').forEach(function(c){
        var target = parseInt(c.getAttribute('data-count'), 10);
        if (isNaN(target)) return;
        var duration = 1600;
        var step = Math.max(1, target / (duration / 16));
        var cur = 0; c.textContent = '0';
        var timer = setInterval(function(){
          cur += step;
          if (cur >= target){ c.textContent = target; clearInterval(timer); }
          else c.textContent = Math.floor(cur);
        }, 16);
      });
    }

    // ---- FAQ accordion ----
    document.querySelectorAll('.faq-q').forEach(function(btn){
      btn.addEventListener('click', function(){
        var item = btn.closest('.faq-item');
        var ans = item.querySelector('.faq-a');
        var open = item.classList.toggle('open');
        btn.setAttribute('aria-expanded', open);
        ans.hidden = !open;
      });
    });

    // ---- Contact form ----
    var form = document.getElementById('contactForm');
    var success = document.getElementById('formSuccess');
    if (form){
      form.addEventListener('submit', function(e){
        e.preventDefault();
        var name = form.querySelector('#name');
        var email = form.querySelector('#email');
        var msg = form.querySelector('#message');
        form.querySelectorAll('.error').forEach(function(el){ el.classList.remove('error'); el.removeAttribute('aria-invalid'); });
        form.querySelectorAll('.form-error').forEach(function(el){ el.hidden = true; });
        var ok = true;
        if (!name.value.trim()){
          name.classList.add('error'); name.setAttribute('aria-invalid','true');
          document.getElementById('name-error').hidden = false; ok = false;
        }
        if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){
          email.classList.add('error'); email.setAttribute('aria-invalid','true');
          document.getElementById('email-error').hidden = false; ok = false;
        }
        if (!msg.value.trim()){
          msg.classList.add('error'); msg.setAttribute('aria-invalid','true');
          document.getElementById('message-error').hidden = false; ok = false;
        }
        if (!ok) return;

        var submitBtn = form.querySelector('button[type="submit"]');
        var origText = submitBtn.textContent;
        submitBtn.disabled = true; submitBtn.textContent = '…';
        var action = form.getAttribute('action') || '';
        var configured = action.indexOf('YOUR_FORM_ID') === -1 && /formspree\.io\/f\/.+/.test(action);

        function showSuccess(){
          form.style.display = 'none';
          success.hidden = false;
          setTimeout(function(){
            form.reset(); form.style.display=''; success.hidden=true;
            submitBtn.disabled=false; submitBtn.textContent=origText;
          }, 6000);
        }
        function showError(){
          submitBtn.disabled=false; submitBtn.textContent=origText;
          alert(getNested(translations[currentLang],'contact.errorSubmit') || 'Send failed.');
        }
        if (!configured){ showSuccess(); return; }
        fetch(action, { method:'POST', body: new FormData(form), headers: { Accept:'application/json' } })
          .then(function(r){ r.ok ? showSuccess() : showError(); })
          .catch(showError);
      });
      ['name','email','message'].forEach(function(id){
        var f = document.getElementById(id);
        if (!f) return;
        f.addEventListener('input', function(){
          f.classList.remove('error');
          var e = document.getElementById(id+'-error'); if (e) e.hidden = true;
        });
      });
    }

    if (backToTop){
      backToTop.addEventListener('click', function(){ window.scrollTo({ top:0, behavior:'smooth' }); });
    }

    onScroll();
  });
})();
