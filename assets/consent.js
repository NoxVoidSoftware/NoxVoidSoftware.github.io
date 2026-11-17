/*
 * NoxVoid cookie consent (GDPR / ePrivacy) with Google Consent Mode v2.
 *
 * The <head> of every page sets all non-essential consent to "denied" BEFORE
 * Google Tag Manager loads. This script restores a saved choice or shows the
 * banner, and sends a consent "update" to GTM when the visitor decides.
 *
 * Any element with [data-cookie-settings] reopens the preferences.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'nv_consent';
  var CONSENT_VERSION = 1;
  var POLICY_URL = '/privacy.html';

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function readChoice() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && saved.v === CONSENT_VERSION) return saved;
    } catch (e) { /* storage blocked or corrupt */ }
    return null;
  }

  function saveChoice(choice) {
    choice.v = CONSENT_VERSION;
    choice.ts = new Date().toISOString();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(choice)); } catch (e) { /* ignore */ }
  }

  function applyChoice(choice) {
    var analytics = choice.analytics ? 'granted' : 'denied';
    var marketing = choice.marketing ? 'granted' : 'denied';
    gtag('consent', 'update', {
      analytics_storage: analytics,
      ad_storage: marketing,
      ad_user_data: marketing,
      ad_personalization: marketing
    });
    window.dataLayer.push({ event: 'consent_update', consent_analytics: choice.analytics, consent_marketing: choice.marketing });
  }

  var banner;

  function buildBanner() {
    banner = document.createElement('section');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'cookie-banner-title');
    banner.setAttribute('aria-describedby', 'cookie-banner-text');
    banner.hidden = true;
    banner.innerHTML =
      '<div class="cookie-banner-inner">' +
        '<h2 id="cookie-banner-title" class="cookie-banner-title">We value your privacy</h2>' +
        '<p id="cookie-banner-text" class="cookie-banner-text">We use essential storage to run this site. With your consent, we also use analytics cookies to understand how the site is used, and marketing cookies to measure our campaigns. You can change your choice at any time. ' +
          '<a href="' + POLICY_URL + '">Privacy &amp; Cookie Policy</a></p>' +
        '<div class="cookie-prefs" hidden>' +
          '<label class="cookie-pref"><input type="checkbox" checked disabled> <span><strong>Essential</strong> — required for the site to work. Always on.</span></label>' +
          '<label class="cookie-pref"><input type="checkbox" data-consent="analytics"> <span><strong>Analytics</strong> — anonymous usage statistics (Google Analytics).</span></label>' +
          '<label class="cookie-pref"><input type="checkbox" data-consent="marketing"> <span><strong>Marketing</strong> — measuring ads and campaigns.</span></label>' +
        '</div>' +
        '<div class="cookie-actions">' +
          '<button type="button" class="btn btn-sm btn-outline" data-action="reject">Reject all</button>' +
          '<button type="button" class="btn btn-sm btn-outline" data-action="customize">Customize</button>' +
          '<button type="button" class="btn btn-sm btn-outline" data-action="save" hidden>Save choices</button>' +
          '<button type="button" class="btn btn-sm btn-primary" data-action="accept">Accept all</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-action');
      if (action === 'customize') { showPrefs(true); return; }
      var choice;
      if (action === 'accept') choice = { analytics: true, marketing: true };
      else if (action === 'reject') choice = { analytics: false, marketing: false };
      else choice = {
        analytics: banner.querySelector('[data-consent="analytics"]').checked,
        marketing: banner.querySelector('[data-consent="marketing"]').checked
      };
      saveChoice(choice);
      applyChoice(choice);
      hideBanner();
    });
  }

  function showPrefs(show) {
    banner.querySelector('.cookie-prefs').hidden = !show;
    banner.querySelector('[data-action="customize"]').hidden = show;
    banner.querySelector('[data-action="save"]').hidden = !show;
  }

  function openBanner(withPrefs) {
    if (!banner) buildBanner();
    var current = readChoice() || { analytics: false, marketing: false };
    banner.querySelector('[data-consent="analytics"]').checked = !!current.analytics;
    banner.querySelector('[data-consent="marketing"]').checked = !!current.marketing;
    showPrefs(!!withPrefs);
    banner.hidden = false;
    banner.querySelector('[data-action="accept"]').focus({ preventScroll: true });
  }

  function hideBanner() {
    if (banner) banner.hidden = true;
  }

  function addFooterLink() {
    if (document.querySelector('[data-cookie-settings]')) return;
    var footer = document.querySelector('.site-footer .footer-inner');
    if (!footer) return;
    var link = document.createElement('button');
    link.type = 'button';
    link.className = 'cookie-settings-link';
    link.setAttribute('data-cookie-settings', '');
    link.textContent = 'Cookie settings';
    footer.appendChild(link);
  }

  // Opt-in consent is required in the EEA, UK and Switzerland. The <head> sets
  // region-based defaults from Google's IP geolocation; here we only decide
  // whether to pop the banner up. A European time zone is a cheap, private
  // signal that errs on the side of asking: if it misses an EEA visitor, their
  // consent still stays "denied" by the regional default.
  function needsOptIn() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      return /^Europe\//.test(tz) ||
        /^Atlantic\/(Canary|Madeira|Azores|Reykjavik|Faroe)$/.test(tz) ||
        /^(Arctic\/Longyearbyen|Asia\/Nicosia|Asia\/Famagusta)$/.test(tz);
    } catch (e) {
      return true;
    }
  }

  function init() {
    addFooterLink();
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-cookie-settings]')) { e.preventDefault(); openBanner(true); }
    });
    var saved = readChoice();
    if (saved) applyChoice(saved);
    else if (needsOptIn()) openBanner(false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
