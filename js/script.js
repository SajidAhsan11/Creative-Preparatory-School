document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Prevent image dragging (cross-browser) ---------- */
  document.querySelectorAll('img').forEach(function (img) {
    img.setAttribute('draggable', 'false');
  });
  document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'IMG') e.preventDefault();
  });

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = siteNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  /* ---------- Close mobile nav after choosing a link ---------- */
  document.querySelectorAll('.site-nav a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 768) {
        siteNav.classList.remove('is-open');
        navToggle.classList.remove('is-active');
      }
    });
  });

  /* ---------- Highlight current page in nav ---------- */
  var currentPage = (window.location.pathname.split('/').pop() || 'index.html').split('#')[0];
  document.querySelectorAll('.site-nav > ul > li > a').forEach(function (link) {
    var linkPage = link.getAttribute('href').split('#')[0];
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('is-current');
    }
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Back to top ---------- */
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('is-visible', window.scrollY > 480);
    });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Gallery filters ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var filter = btn.getAttribute('data-filter');
      galleryItems.forEach(function (item) {
        var match = filter === 'all' || item.getAttribute('data-category') === filter;
        item.style.display = match ? '' : 'none';
      });
    });
  });

  /* ---------- Lightbox ---------- */
  var lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    var lightboxMedia = lightbox.querySelector('.lightbox-media');
    var lightboxTitle = lightbox.querySelector('.lightbox-caption h3');
    var lightboxDesc = lightbox.querySelector('.lightbox-caption p');

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var media = item.querySelector('svg, img');
        lightboxMedia.innerHTML = media ? media.outerHTML : '';
        lightboxTitle.textContent = item.getAttribute('data-title') || '';
        lightboxDesc.textContent = item.getAttribute('data-desc') || '';
        lightbox.classList.add('is-open');
      });
    });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.closest('.lightbox-close')) {
        lightbox.classList.remove('is-open');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') lightbox.classList.remove('is-open');
    });
  }

  /* ---------- Academics tabs ---------- */
  var tabBtns = document.querySelectorAll('.tab-btn');
  var tabPanels = document.querySelectorAll('.tab-panel');
  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabBtns.forEach(function (b) { b.classList.remove('is-active'); });
      tabPanels.forEach(function (p) { p.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var target = document.getElementById(btn.getAttribute('data-tab'));
      if (target) target.classList.add('is-active');
    });
  });

  /* ---------- Forms: front-end validation + friendly confirmation ---------- */
  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = form.checkValidity();
      if (!valid) {
        form.reportValidity();
        return;
      }
      var successBox = form.parentElement.querySelector('.form-success');
      var name = form.querySelector('[name="name"]');
      var mailLink = form.getAttribute('data-mailto');

      if (mailLink) {
        var subject = encodeURIComponent(form.getAttribute('data-subject') || 'Website enquiry');
        var bodyParts = [];
        form.querySelectorAll('input, select, textarea').forEach(function (field) {
          if (field.name) bodyParts.push(field.previousElementSibling ? field.previousElementSibling.textContent + ': ' + field.value : field.value);
        });
        var body = encodeURIComponent(bodyParts.join('\n'));
        window.location.href = 'mailto:' + mailLink + '?subject=' + subject + '&body=' + body;
      }

      if (successBox) {
        successBox.classList.add('is-visible');
        successBox.textContent = 'Thank you' + (name && name.value ? ', ' + name.value : '') + '! Your message has been prepared — please send it from your email app, or reach us directly via the Call/WhatsApp links below.';
      }
      form.reset();
    });
  });

  /* ---------- Footer year ---------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
