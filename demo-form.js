/* ============================================================
   Apos 4 page - demo build of the lead form (portfolio copy).
   Same validation as production (full name, phone, optional
   email, required region; aria-invalid + focus on the first bad
   field), but a valid submit only shows a demo notice.
   Nothing is sent anywhere: no network request, no tag-manager
   events, no CRM.
   ============================================================ */
(function () {
  'use strict';

  var DEMO_MSG = 'זה דף הדגמה – הטופס לא שולח פרטים לשום מקום.';
  var LINK_MSG = 'זה דף הדגמה – הקישור והחיוג מנותקים בעותק הזה.';

  /* ---------- toast (phone CTAs, outbound links) ---------- */
  var toastEl = null, toastTimer = null;
  function toast(text) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'demo-toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = text;
    toastEl.classList.remove('show');
    void toastEl.offsetWidth; // replay the transition on repeated clicks
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 3600);
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-demo-phone]'), function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); toast(DEMO_MSG); });
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-demo-link]'), function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); toast(LINK_MSG); });
  });

  /* ---------- form ---------- */
  var form = document.getElementById('lead-form');
  if (!form) return;
  var msg = document.getElementById('demo-msg');

  function setError(inputId, errId, show) {
    var input = document.getElementById(inputId);
    var err = document.getElementById(errId);
    if (err) err.hidden = !show;
    if (input) {
      if (show) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    }
  }
  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(String(value).toLowerCase());
  }
  function digitsOnly(value) {
    return String(value).replace(/\D/g, '');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // honeypot: a real visitor never sees or fills this field
    var hp = document.getElementById('f4-company');
    if (hp && hp.value) return;

    var name = (document.getElementById('f4-name').value || '').trim();
    var phone = (document.getElementById('f4-phone').value || '').trim();
    var email = (document.getElementById('f4-email').value || '').trim();
    var ezorEl = form.querySelector('input[name="ezor"]:checked');

    var nameBad = name.split(/\s+/).filter(Boolean).length < 2;
    var phoneBad = digitsOnly(phone).length < 9;
    var emailBad = email !== '' && !validEmail(email); // email is optional
    var ezorBad = !ezorEl;

    setError('f4-name', 'err-name', nameBad);
    setError('f4-phone', 'err-phone', phoneBad);
    setError('f4-email', 'err-email', emailBad);
    var ezorErr = document.getElementById('err-ezor');
    if (ezorErr) ezorErr.hidden = !ezorBad;

    if (nameBad || phoneBad || emailBad || ezorBad) {
      if (msg) msg.hidden = true;
      var firstBad = form.querySelector('[aria-invalid="true"]');
      if (firstBad) firstBad.focus();
      else if (ezorBad) form.querySelector('input[name="ezor"]').focus();
      return;
    }

    // valid: production posted the lead here - the demo only says so
    if (msg) {
      msg.textContent = DEMO_MSG;
      msg.hidden = false;
    }
  });
})();
