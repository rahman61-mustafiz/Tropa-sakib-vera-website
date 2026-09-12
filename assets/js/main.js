// Vera Wellness — shared site behavior
document.addEventListener('DOMContentLoaded', function () {

  // Mobile menu toggle
  var toggle = document.querySelector('.menu-toggle');
  var panel = document.querySelector('.mobile-panel');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
      var expanded = panel.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });
    // close menu after a link is tapped
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { panel.classList.remove('open'); });
    });
  }

  // Mobile Services sub-menu accordion
  var subToggle = document.querySelector('.mobile-services-toggle');
  var subPanel = document.querySelector('.mobile-sub');
  if (subToggle && subPanel) {
    subToggle.addEventListener('click', function (e) {
      e.preventDefault();
      subPanel.style.display = subPanel.style.display === 'flex' ? 'none' : 'flex';
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) { o.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });

  // Reveal-on-scroll, with a safety net so content is never left invisible
  // (JS timing edge cases, crawlers, screenshot/preview tools that don't scroll).
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }
  // Force-reveal anything still hidden shortly after load, so a missed
  // trigger never permanently hides real content.
  window.setTimeout(function () {
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
      el.classList.add('in');
    });
  }, 1200);

  // Hero video: swap to a still poster if it fails to load (offline, slow network, file:// preview)
  var heroVideo = document.querySelector('.hero video');
  if (heroVideo) {
    heroVideo.addEventListener('error', function () {
      heroVideo.style.display = 'none';
      var hero = heroVideo.closest('.hero');
      if (hero) hero.classList.add('video-failed');
    });
  }

  // Contact form: mailto-based submit with a friendly success state
  var form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('#name').value.trim();
      var phone = form.querySelector('#phone').value.trim();
      var interest = form.querySelector('#interest') ? form.querySelector('#interest').value : '';
      var message = form.querySelector('#message').value.trim();

      var subject = encodeURIComponent('Free trial / enquiry — Vera Wellness');
      var body = encodeURIComponent(
        'Name: ' + name + '\n' +
        'Phone: ' + phone + '\n' +
        'Interested in: ' + interest + '\n\n' +
        'Message:\n' + message
      );
      window.location.href = 'mailto:hello@verawellness.example?subject=' + subject + '&body=' + body;

      form.hidden = true;
      var success = document.querySelector('.form-success');
      if (success) success.classList.add('show');
    });
  }
});
