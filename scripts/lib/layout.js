/**
 * Shared page chrome for the generated Jira app pages and their legal pages:
 * the <head> (consent mode, analytics, SEO tags), the site header and the footer.
 * Keeping it in one place means every generated page looks and behaves the same.
 */
const BASE_URL = 'https://noxvoidsoftware.github.io';

// Vendor page on the Atlassian Marketplace, linked from every product page.
const VENDOR_URL = 'https://marketplace.atlassian.com/vendors/401220834/noxvoid-software';

// Escapes text for use inside HTML attributes and text nodes.
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Google Consent Mode v2 + Tag Manager: same snippet as the hand-written pages.
const CONSENT_SNIPPET = `  <!-- Google Consent Mode v2: opt-in in the EEA, UK and Switzerland; granted elsewhere unless the visitor opts out -->
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    (function () {
      var c = null;
      try { c = JSON.parse(localStorage.getItem('nv_consent')); } catch (e) {}
      var base = { functionality_storage: 'granted', security_storage: 'granted' };
      function state(a, m) {
        return { ad_storage: m, ad_user_data: m, ad_personalization: m, analytics_storage: a,
                 functionality_storage: base.functionality_storage, security_storage: base.security_storage };
      }
      if (c && c.v === 1) {
        gtag('consent', 'default', state(c.analytics ? 'granted' : 'denied', c.marketing ? 'granted' : 'denied'));
      } else {
        var optIn = state('denied', 'denied');
        optIn.region = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH'];
        optIn.wait_for_update = 500;
        gtag('consent', 'default', optIn);
        gtag('consent', 'default', state('granted', 'granted'));
      }
    })();
    gtag('set', 'ads_data_redaction', true);
    dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
  </script>
  <!-- Google Tag Manager -->
  <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-M6N9TKNK"></script>
  <script defer src="assets/consent.js"></script>`;

/**
 * Builds everything from <!DOCTYPE> to </head>.
 * @param {object} p
 * @param {string} p.title          full <title> text
 * @param {string} p.description    meta description
 * @param {string} p.path           page file relative to the site root, e.g. 'domainguard-jira.html'
 * @param {string} [p.ogType]       'website' (default) or 'product'
 * @param {string} [p.ogTitle]      defaults to the title
 * @param {string} [p.ogDescription] defaults to the description
 */
function head(p) {
  const url = `${BASE_URL}/${p.path}`;
  const title = esc(p.title);
  const description = esc(p.description);
  const ogTitle = esc(p.ogTitle || p.title);
  const ogDescription = esc(p.ogDescription || p.description);
  const ogImage = p.ogImage ? `${BASE_URL}/${p.ogImage.replace(/^\//, '')}` : `${BASE_URL}/assets/logo-512.png`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
${CONSENT_SNIPPET}
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${url}">
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
  <meta name="theme-color" content="#0a0f1d">
  <link rel="stylesheet" href="styles.css">

  <!-- Open Graph -->
  <meta property="og:type" content="${p.ogType || 'website'}">
  <meta property="og:title" content="${ogTitle}">
  <meta property="og:description" content="${ogDescription}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${ogImage}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${ogTitle}">
  <meta name="twitter:description" content="${ogDescription}">
  <meta name="twitter:image" content="${ogImage}">
${p.extraHead ? `${p.extraHead}\n` : ''}</head>`;
}

/** Opens <body> and renders the site header. `active` is 'cloud', 'jira' or 'blog'. */
function siteHeader(active) {
  const cls = (key) => (key === active ? ' class="active"' : '');
  return `
<body>
  <div class="site-wrapper">
    <!-- Header -->
    <header class="site-header">
      <div class="container header-inner">
        <a href="index.html" class="brand-logo" aria-label="NoxVoid Software Home">
          <img src="assets/logo.svg" alt="NoxVoid Logo" class="brand-icon" width="34" height="34">
          <span class="brand-name">NoxVoid <span class="brand-sub">Software</span></span>
        </a>
        <nav class="site-nav" aria-label="Main Navigation">
          <ul class="nav-list">
            <li><a href="index.html#products"${cls('cloud')}>Cloud Apps</a></li>
            <li><a href="index.html#atlassian"${cls('jira')}>Jira Apps</a></li>
            <li><a href="blog.html"${cls('blog')}>Blog</a></li>
            <li><a href="index.html#contact" class="btn btn-sm btn-outline">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
`;
}

/** Renders the footer and closes the page. `links` ([{ label, href }]) go before "Back to Home". */
function siteFooter(links = []) {
  const items = links
    .map((l) => `          <a href="${esc(l.href)}" class="product-link-secondary">${esc(l.label)}</a>\n`)
    .join('');
  return `
    <!-- Footer -->
    <footer class="site-footer">
      <div class="container footer-inner">
        <p>© ${new Date().getFullYear()} NoxVoid Software. All rights reserved.</p>
        <div class="footer-links">
${items}          <a href="index.html" class="product-link">Back to Home</a>
        </div>
      </div>
    </footer>
  </div>
</body>
</html>
`;
}

module.exports = { BASE_URL, VENDOR_URL, esc, head, siteHeader, siteFooter };
