/* Ancha Radhakrishna Murthy — family archive interactions */
(function () {
  'use strict';

  var LANG_KEY = 'arm-lang';

  /* ---------- preloader ---------- */
  var preloader = document.getElementById('preloader');
  function hidePreloader() {
    if (preloader) preloader.classList.add('done');
  }
  window.addEventListener('load', function () {
    setTimeout(hidePreloader, 900);
  });
  // safety: never trap the user behind the preloader
  setTimeout(hidePreloader, 3500);

  /* ---------- language toggle ---------- */
  var toggle = document.getElementById('langToggle');
  var opts = toggle ? toggle.querySelectorAll('.lang-opt') : [];

  function applyLang(lang) {
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('[data-en]').forEach(function (el) {
      var val = el.getAttribute('data-' + lang);
      if (val !== null) el.textContent = val;
    });
    opts.forEach(function (o) {
      o.classList.toggle('active', o.getAttribute('data-lang') === lang);
    });
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  }

  function currentLang() {
    try { return localStorage.getItem(LANG_KEY) || 'en'; } catch (e) { return 'en'; }
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('lang') === 'te' ? 'en' : 'te';
      applyLang(next);
    });
    applyLang(currentLang());
  }

  /* ---------- header on scroll ---------- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCap = document.getElementById('lightboxCap');
  var lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, alt, cap) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightboxCap.textContent = cap || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  document.querySelectorAll('.g-item').forEach(function (item) {
    item.addEventListener('click', function () {
      var img = item.querySelector('img');
      var cap = item.querySelector('figcaption');
      openLightbox(img.src, img.alt, cap ? cap.textContent : '');
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
})();
