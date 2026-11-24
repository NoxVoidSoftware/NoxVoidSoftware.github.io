const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const matter = require('gray-matter');
const { marked } = require('marked');

const ROOT_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT_DIR, 'content', 'blog');
const BLOG_OUT_DIR = path.join(ROOT_DIR, 'blog');
const BASE_URL = 'https://noxvoidsoftware.github.io';

if (!fs.existsSync(BLOG_OUT_DIR)) {
  fs.mkdirSync(BLOG_OUT_DIR, { recursive: true });
}

// Read width/height from local PNG headers so blog images emit explicit dimensions (zero CLS)
function getPngDimensions(href) {
  if (!href || /^https?:\/\//i.test(href)) return null;
  const rel = href.replace(/^\.\.\//, '').replace(/^\//, '');
  const fullPath = path.join(ROOT_DIR, rel);
  if (!fullPath.endsWith('.png') || !fs.existsSync(fullPath)) return null;
  try {
    const fd = fs.openSync(fullPath, 'r');
    const buf = Buffer.alloc(24);
    fs.readSync(fd, buf, 0, 24, 0);
    fs.closeSync(fd);
    if (buf.toString('ascii', 1, 4) === 'PNG') {
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
    }
  } catch (e) {}
  return null;
}

// Ensure markdown images render with native lazy loading, async decoding, and explicit dimensions
marked.use({
  renderer: {
    image(token) {
      const href = token.href || '';
      const text = escapeHtml(token.text || '');
      const titleAttr = token.title ? ` title="${escapeHtml(token.title)}"` : '';
      const dims = getPngDimensions(href);
      const dimAttrs = dims ? ` width="${dims.width}" height="${dims.height}"` : '';
      return `<img src="${href}" alt="${text}"${titleAttr}${dimAttrs} loading="lazy" decoding="async">`;
    }
  }
});

// 1. Read and parse all markdown articles
const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
const articles = [];

for (const file of files) {
  const filePath = path.join(CONTENT_DIR, file);
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(rawContent);

  const slug = data.slug || path.basename(file, '.md');
  const htmlBody = marked.parse(content);

  const rawTitle = String(data.title || 'Untitled');
  const rawSeoTitle = String(data.seoTitle || rawTitle);
  const rawDescription = String(data.description || '');
  // gray-matter turns unquoted YAML dates into Date objects — normalize to YYYY-MM-DD
  const date = data.date instanceof Date
    ? data.date.toISOString().split('T')[0]
    : String(data.date || new Date().toISOString().split('T')[0]);

  // Extract first image in the article for rich social previews (fallback to logo)
  const imageMatch = content.match(/!\[.*?\]\((.*?)\)/);
  let socialImage = `${BASE_URL}/assets/logo-512.png`;
  let twitterCard = 'summary';

  if (imageMatch && imageMatch[1]) {
    const rawImg = imageMatch[1].trim();
    if (/^https?:\/\//i.test(rawImg)) {
      socialImage = rawImg;
    } else {
      socialImage = `${BASE_URL}/${rawImg.replace(/^\.\.\//, '').replace(/^\//, '')}`;
    }
    twitterCard = 'summary_large_image';
  }

  articles.push({
    rawTitle,
    rawDescription,
    title: escapeHtml(rawTitle),
    seoTitle: escapeHtml(rawSeoTitle),
    description: escapeHtml(rawDescription),
    titleJson: toJsonLd(rawTitle),
    descriptionJson: toJsonLd(rawDescription),
    date,
    dateDisplay: formatDate(date),
    category: escapeHtml(data.category || 'General'),
    readTime: escapeHtml(data.readTime || '3 min read'),
    slug,
    htmlBody,
    socialImage,
    twitterCard,
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// JSON string literal that is safe to embed inside <script type="application/ld+json">
function toJsonLd(str) {
  return JSON.stringify(str).replace(/</g, '\\u003c');
}

function formatDate(isoDate) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  if (isNaN(d)) return isoDate;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
}

// Sort by date descending
articles.sort((a, b) => new Date(b.date) - new Date(a.date));

console.log(`Parsed ${articles.length} markdown articles.`);

// 2. Generate individual article HTML pages
for (const art of articles) {
  const articleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <!-- Google Consent Mode v2: opt-in in the EEA, UK and Switzerland; granted elsewhere unless the visitor opts out -->
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
  <script defer src="../assets/consent.js"></script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <title>${art.seoTitle} — NoxVoid Blog</title>
  <meta name="description" content="${art.description}">
  <link rel="canonical" href="${BASE_URL}/blog/${art.slug}.html">
  <link rel="describedby" href="${BASE_URL}/llms.txt">
  <link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
  <link rel="apple-touch-icon" href="../assets/apple-touch-icon.png">
  <meta name="theme-color" content="#0a0f1d">
  <link rel="stylesheet" href="../styles.css">
  
  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${art.title}">
  <meta property="og:description" content="${art.description}">
  <meta property="og:url" content="${BASE_URL}/blog/${art.slug}.html">
  <meta property="og:image" content="${art.socialImage}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="${art.twitterCard}">
  <meta name="twitter:title" content="${art.title}">
  <meta name="twitter:description" content="${art.description}">
  <meta name="twitter:image" content="${art.socialImage}">

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": "${BASE_URL}/blog/${art.slug}.html#article",
        "isPartOf": {
          "@type": "WebPage",
          "@id": "${BASE_URL}/blog/${art.slug}.html"
        },
        "headline": ${art.titleJson},
        "description": ${art.descriptionJson},
        "datePublished": "${art.date}",
        "dateModified": "${art.date}",
        "mainEntityOfPage": "${BASE_URL}/blog/${art.slug}.html",
        "image": "${art.socialImage}",
        "author": {
          "@type": "Organization",
          "name": "NoxVoid Software",
          "url": "${BASE_URL}"
        },
        "publisher": {
          "@type": "Organization",
          "name": "NoxVoid Software",
          "logo": {
            "@type": "ImageObject",
            "url": "${BASE_URL}/assets/logo-512.png",
            "width": 512,
            "height": 512
          }
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "${BASE_URL}/blog/${art.slug}.html#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "${BASE_URL}"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": "${BASE_URL}/blog.html"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": ${art.titleJson},
            "item": "${BASE_URL}/blog/${art.slug}.html"
          }
        ]
      }
    ]
  }
  </script>
</head>
<body>
  <div class="site-wrapper">
    <header class="site-header">
      <div class="container header-inner">
        <a href="../index.html" class="brand-logo" aria-label="NoxVoid Software Home">
          <img src="../assets/logo.svg" alt="NoxVoid Logo" class="brand-icon" width="34" height="34">
          <span class="brand-name">NoxVoid <span class="brand-sub">Software</span></span>
        </a>
        <nav class="site-nav">
          <ul class="nav-list">
            <li><a href="../index.html#products">Products</a></li>
            <li><a href="../blog.html">Blog</a></li>
            <li><a href="../index.html#contact" class="btn btn-sm btn-outline">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <main>
      <article class="container article-container">
        <div class="breadcrumb-nav">
          <a href="../blog.html" class="breadcrumb-link">&larr; Back to all blog posts</a>
        </div>

        <header class="article-header">
          <div class="blog-meta">
            <span>${art.category}</span>
            <span>•</span>
            <time datetime="${art.date}">${art.dateDisplay}</time>
            <span>•</span>
            <span>${art.readTime}</span>
          </div>
          <h1 class="article-title">${art.title}</h1>
        </header>

        <div class="article-content">
          ${art.htmlBody}
        </div>
      </article>
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <p>© 2026 NoxVoid Software. All rights reserved.</p>
        <a href="../index.html" class="product-link">Back to Home</a>
      </div>
    </footer>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(BLOG_OUT_DIR, `${art.slug}.html`), articleHtml, 'utf-8');
  console.log(`Generated blog/${art.slug}.html`);
}

// 3. Generate blog.html index
const blogCardsHtml = articles.map(art => `
          <article>
            <a href="blog/${art.slug}.html" class="blog-card">
              <div class="blog-meta">
                <span>${art.category}</span>
                <span>•</span>
                <time datetime="${art.date}">${art.dateDisplay}</time>
                <span>•</span>
                <span>${art.readTime}</span>
              </div>
              <h2 class="blog-card-title">${art.title}</h2>
              <p class="blog-card-desc">${art.description}</p>
              <span class="product-link">Read full story &rarr;</span>
            </a>
          </article>`).join('\n');

const blogIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <!-- Google Consent Mode v2: opt-in in the EEA, UK and Switzerland; granted elsewhere unless the visitor opts out -->
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
  <script defer src="assets/consent.js"></script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <title>Blog & Studio Updates — NoxVoid Software</title>
  <meta name="description" content="Engineering articles, workflow optimization guides, and studio updates from NoxVoid Software.">
  <link rel="canonical" href="${BASE_URL}/blog.html">
  <link rel="describedby" href="${BASE_URL}/llms.txt">
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
  <meta name="theme-color" content="#0a0f1d">
  <link rel="stylesheet" href="styles.css">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Blog & Studio Updates — NoxVoid Software">
  <meta property="og:description" content="Engineering articles, workflow optimization guides, and studio updates from NoxVoid Software.">
  <meta property="og:url" content="${BASE_URL}/blog.html">
  <meta property="og:image" content="${BASE_URL}/assets/logo-512.png">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Blog & Studio Updates — NoxVoid Software">
  <meta name="twitter:description" content="Engineering articles, workflow optimization guides, and studio updates from NoxVoid Software.">
  <meta name="twitter:image" content="${BASE_URL}/assets/logo-512.png">

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "${BASE_URL}/blog.html#collection",
        "name": "NoxVoid Studio Blog",
        "url": "${BASE_URL}/blog.html",
        "description": "Practical notes on cloud architecture, agile delivery, incident transparency, and software craftsmanship.",
        "publisher": {
          "@type": "Organization",
          "name": "NoxVoid Software",
          "url": "${BASE_URL}"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "${BASE_URL}/blog.html#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "${BASE_URL}"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": "${BASE_URL}/blog.html"
          }
        ]
      }
    ]
  }
  </script>
</head>
<body>
  <div class="site-wrapper">
    <header class="site-header">
      <div class="container header-inner">
        <a href="index.html" class="brand-logo" aria-label="NoxVoid Software Home">
          <img src="assets/logo.svg" alt="NoxVoid Logo" class="brand-icon" width="34" height="34">
          <span class="brand-name">NoxVoid <span class="brand-sub">Software</span></span>
        </a>
        <nav class="site-nav">
          <ul class="nav-list">
            <li><a href="index.html#products">Products</a></li>
            <li><a href="blog.html" class="active">Blog</a></li>
            <li><a href="index.html#about">About</a></li>
            <li><a href="index.html#contact" class="btn btn-sm btn-outline">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <main>
      <section class="hero-section" style="padding-block: 4rem 3rem;">
        <div class="container">
          <div class="breadcrumb-nav">
            <a href="index.html" class="breadcrumb-link">&larr; Back to NoxVoid Overview</a>
          </div>
          <h1 class="hero-title" style="margin-bottom: 0.75rem;">NoxVoid Studio Blog</h1>
          <p class="hero-lead" style="max-width: 640px; margin-inline: auto;">
            Practical notes on cloud architecture, agile delivery, incident transparency, and software craftsmanship.
          </p>
        </div>
      </section>

      <section class="container" style="padding-block: 3.5rem 5rem;">
        <div class="blog-grid">
${blogCardsHtml}
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <p>© 2026 NoxVoid Software. All rights reserved.</p>
        <a href="index.html" class="product-link">Back to Home</a>
      </div>
    </footer>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(ROOT_DIR, 'blog.html'), blogIndexHtml, 'utf-8');
console.log('Generated blog.html index.');

// 3b. Generate the Jira app product pages and their privacy/terms/security pages
// from content/apps/*.json and content/legal/ (see scripts/lib/pages.js).
const { buildAppPages } = require('./lib/pages');
buildAppPages(ROOT_DIR);

// 4. Generate dynamic sitemap.xml (using real git/source modification dates where available)
const today = new Date().toISOString().split('T')[0];

function getLastMod(sourceRelPath, fallback = today) {
  if (!sourceRelPath) return fallback;
  const full = path.join(ROOT_DIR, sourceRelPath);
  if (sourceRelPath.endsWith('.md') && fs.existsSync(full)) {
    try {
      const { data } = matter(fs.readFileSync(full, 'utf-8'));
      if (data.updated) {
        return data.updated instanceof Date ? data.updated.toISOString().split('T')[0] : String(data.updated);
      }
    } catch (e) {}
  }
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', sourceRelPath], {
      cwd: ROOT_DIR,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(out)) return out;
  } catch (e) {}
  return fallback;
}

const staticPages = [
  { url: '', source: 'index.html', priority: '1.0', changefreq: 'weekly' },
  { url: 'clientstatus.html', source: 'clientstatus.html', priority: '0.8', changefreq: 'monthly' },
  { url: 'collectly.html', source: 'collectly.html', priority: '0.8', changefreq: 'monthly' },
  { url: 'caseforge.html', source: 'caseforge.html', priority: '0.8', changefreq: 'monthly' },
  { url: 'collectly-jira.html', source: 'content/apps/collectly-jira.json', priority: '0.8', changefreq: 'monthly' },
  { url: 'cyclepulse-jira.html', source: 'content/apps/cyclepulse.json', priority: '0.8', changefreq: 'monthly' },
  { url: 'domainguard-jira.html', source: 'content/apps/domainguard.json', priority: '0.8', changefreq: 'monthly' },
  { url: 'wishly-jira.html', source: 'content/apps/wishly.json', priority: '0.8', changefreq: 'monthly' },
  { url: 'blog.html', lastmod: articles[0]?.date || today, priority: '0.7', changefreq: 'weekly' },
  { url: 'privacy.html', source: 'privacy.html', priority: '0.3', changefreq: 'yearly' },
  { url: 'privacy-collectly-jira.html', source: 'content/legal/collectly-jira/privacy.md', priority: '0.3', changefreq: 'yearly' },
  { url: 'security-collectly-jira.html', source: 'content/legal/collectly-jira/security.md', priority: '0.3', changefreq: 'yearly' },
  { url: 'terms-collectly-jira.html', source: 'content/legal/collectly-jira/terms.md', priority: '0.3', changefreq: 'yearly' },
  { url: 'privacy-cyclepulse.html', source: 'content/legal/cyclepulse/privacy.md', priority: '0.3', changefreq: 'yearly' },
  { url: 'security-cyclepulse.html', source: 'content/legal/cyclepulse/security.md', priority: '0.3', changefreq: 'yearly' },
  { url: 'terms-cyclepulse.html', source: 'content/legal/cyclepulse/terms.md', priority: '0.3', changefreq: 'yearly' },
  { url: 'privacy-domainguard.html', source: 'content/legal/domainguard/privacy.md', priority: '0.3', changefreq: 'yearly' },
  { url: 'security-domainguard.html', source: 'content/legal/domainguard/security.md', priority: '0.3', changefreq: 'yearly' },
  { url: 'terms-domainguard.html', source: 'content/legal/domainguard/terms.md', priority: '0.3', changefreq: 'yearly' },
  { url: 'privacy-wishly.html', source: 'content/legal/wishly/privacy.md', priority: '0.3', changefreq: 'yearly' },
  { url: 'security-wishly.html', source: 'content/legal/wishly/security.md', priority: '0.3', changefreq: 'yearly' },
  { url: 'terms-wishly.html', source: 'content/legal/wishly/terms.md', priority: '0.3', changefreq: 'yearly' },
  { url: 'privacy-clientstatus-monday.html', source: 'content/legal/clientstatus-monday/privacy.md', priority: '0.3', changefreq: 'yearly' },
  { url: 'security-clientstatus-monday.html', source: 'content/legal/clientstatus-monday/security.md', priority: '0.3', changefreq: 'yearly' },
  { url: 'terms-clientstatus-monday.html', source: 'content/legal/clientstatus-monday/terms.md', priority: '0.3', changefreq: 'yearly' },
];

const sitemapEntries = [
  ...staticPages.map(p => `  <url>
    <loc>${BASE_URL}/${p.url}</loc>
    <lastmod>${p.lastmod || getLastMod(p.source)}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),
  ...articles.map(art => `  <url>
    <loc>${BASE_URL}/blog/${art.slug}.html</loc>
    <lastmod>${art.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`)
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.join('\n')}
</urlset>`;

fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), sitemapXml, 'utf-8');
console.log('Generated sitemap.xml.');

// 5. Generate robots.txt (explicitly permitting AI search & citation bots alongside standard crawlers)
const robotsTxt = `User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;

fs.writeFileSync(path.join(ROOT_DIR, 'robots.txt'), robotsTxt, 'utf-8');
console.log('Generated robots.txt.');

// 6. Generate llms.txt (v2 machine-readable directory for AI search & developer agents)
const appsDir = path.join(ROOT_DIR, 'content', 'apps');
const jiraAppLines = fs.readdirSync(appsDir)
  .filter(f => f.endsWith('.json'))
  .sort()
  .map(f => JSON.parse(fs.readFileSync(path.join(appsDir, f), 'utf-8')))
  .filter(app => !app.legalOnly)
  .map(app => `- [${app.title}](${BASE_URL}/${app.file}): ${app.seo.description}`);

const blogLines = articles.map(
  art => `- [${art.rawTitle}](${BASE_URL}/blog/${art.slug}.html): ${art.rawDescription}`
);

const llmsTxt = `# NoxVoid Software

> Independent software studio building focused cloud SaaS platforms and 100% Forge-native Atlassian Jira Marketplace applications. Zero bloat, strict tenant isolation, and privacy-first architecture.

## Atlassian Jira & JSM Apps (Runs on Atlassian Forge)

${jiraAppLines.join('\n')}

## Cloud SaaS Platforms

- [ClientStatus](${BASE_URL}/clientstatus.html): Lightweight tokenized client portals and milestone tracking powered by 2-way Google Sheets sync.
- [Collectly](${BASE_URL}/collectly.html): Frictionless client document collection portals with automated reminders and 1-click ZIP exports.
- [CaseForge](${BASE_URL}/caseforge.html): Legal document automation and matter pipeline OS for solo practitioners and small law firms.

## Studio Blog & Engineering Notes

${blogLines.join('\n')}
`;

fs.writeFileSync(path.join(ROOT_DIR, 'llms.txt'), llmsTxt, 'utf-8');
console.log('Generated llms.txt.');
