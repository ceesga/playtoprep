/*
  Copyright (c) 2026 PlayToPrep.nl — Alle rechten voorbehouden.
  Zie LICENSE voor volledige voorwaarden.
*/

(function () {
  async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  function isLoggedIn() {
    return sessionStorage.getItem('ptp_auth') === '1';
  }

  async function doLogin() {
    const usernameEl = document.getElementById('login-username');
    const passwordEl = document.getElementById('login-password');
    const errorEl    = document.getElementById('login-error');
    const username   = usernameEl.value.trim();
    const password   = passwordEl.value;

    if (!username || !password) {
      errorEl.textContent = 'Vul je naam en wachtwoord in.';
      errorEl.style.display = 'block';
      return;
    }

    const hash = await sha256(password);
    const user = USERS.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.passwordHash === hash
    );

    if (user) {
      sessionStorage.setItem('ptp_auth', '1');
      sessionStorage.setItem('ptp_user', user.username);
      errorEl.style.display = 'none';
      show('s-start');
    } else {
      errorEl.textContent = 'Naam of wachtwoord klopt niet.';
      errorEl.style.display = 'block';
      passwordEl.value = '';
      passwordEl.focus();
    }
  }

  // Expose globally so onclick in HTML kan aanroepen
  window.doLogin = doLogin;

  document.addEventListener('DOMContentLoaded', function () {
    // Als sessie al actief is: sla loginscherm over
    if (isLoggedIn()) {
      show('s-start');
      return;
    }

    // Enter-toets in wachtwoordveld triggert login
    const passwordEl = document.getElementById('login-password');
    if (passwordEl) {
      passwordEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') doLogin();
      });
    }

    const usernameEl = document.getElementById('login-username');
    if (usernameEl) {
      usernameEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          document.getElementById('login-password').focus();
        }
      });
    }
  });
})();
