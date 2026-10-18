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

  /* ---------- sitar photos: tap to compare restored vs original scan ---------- */
  function compareBadgeText(fig) {
    var lang = document.documentElement.getAttribute('lang') || 'en';
    var side = fig.classList.contains('showing-original') ? 'b' : 'a';
    var custom = fig.getAttribute('data-badge-' + side + '-' + lang) || fig.getAttribute('data-badge-' + side + '-en');
    if (custom) return custom;
    if (side === 'b') {
      return lang === 'te' ? '\u0c05\u0c38\u0c32\u0c41 \u0c38\u0c4d\u0c15\u0c3e\u0c28\u0c4d' : 'Original scan';
    }
    return lang === 'te' ? '\u0c2a\u0c41\u0c28\u0c30\u0c41\u0c26\u0c4d\u0c27\u0c30\u0c3f\u0c02\u0c1a\u0c3f\u0c28\u0c26\u0c3f' : 'Restored';
  }
  document.querySelectorAll('.photo-compare').forEach(function (fig) {
    var frame = fig.querySelector('.compare-frame');
    var badge = fig.querySelector('.compare-badge');
    if (!frame || !badge) return;
    badge.textContent = compareBadgeText(fig);
    frame.addEventListener('click', function (e) {
      e.stopPropagation();
      fig.classList.toggle('showing-original');
      badge.textContent = compareBadgeText(fig);
    });
  });
  /* hint pill also toggles the compare */
  document.querySelectorAll('.photo-compare .swap-hint').forEach(function (hint) {
    hint.addEventListener('click', function (e) {
      e.stopPropagation();
      var fig = hint.closest('.photo-compare');
      if (!fig) return;
      fig.classList.toggle('showing-original');
      var badge = fig.querySelector('.compare-badge');
      if (badge) badge.textContent = compareBadgeText(fig);
    });
  });

  /* ---------- expand button: enlarge any chapter photo ---------- */
  document.querySelectorAll('.chapter-figure').forEach(function (fig) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'expand-btn';
    btn.setAttribute('aria-label', 'Enlarge photo');
    btn.textContent = '\u2922';
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var srcImg = fig.querySelector('.compare-hd') || fig.querySelector('img');
      if (fig.classList.contains('photo-compare') && fig.classList.contains('showing-original')) {
        srcImg = fig.querySelector('.compare-orig') || srcImg;
      }
      if (!srcImg) return;
      var cap = fig.querySelector('figcaption');
      openLightbox(srcImg.src, srcImg.alt || '', cap ? cap.textContent : '');
    });
    fig.appendChild(btn);
  });

  var _applyLang = applyLang;
  applyLang = function (lang) {
    _applyLang(lang);
    document.querySelectorAll('.photo-compare').forEach(function (fig) {
      var badge = fig.querySelector('.compare-badge');
      if (badge) badge.textContent = compareBadgeText(fig);
    });
  };

})();