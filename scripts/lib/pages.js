/**
 * Generators for the Jira app product pages and their legal pages.
 *
 *   content/apps/<slug>.json            -> <app.file>            (product page; none with "legalOnly": true)
 *   content/legal/<slug>/<doc>.md       -> <doc>-<slug>.html     (privacy / terms / security)
 *   content/legal/_shared/<doc>/*.md    -> sections shared by all apps, pulled in with {{> doc/name}}
 *
 * Text fields in the JSON may use inline Markdown (**bold**, `code`, [links](url)).
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');
const { BASE_URL, VENDOR_URL, esc, head, siteHeader, siteFooter } = require('./layout');

// Legal documents every app has, in the order they are cross-linked.
const LEGAL_DOCS = [
  { key: 'privacy', label: 'Privacy Policy' },
  { key: 'terms', label: 'Terms of Use' },
  { key: 'security', label: 'Security' },
];

// Inline Markdown -> HTML (no wrapping <p>).
const md = (text) => marked.parseInline(String(text ?? ''));

// External link attributes used for every off-site button and link.
const EXT = 'target="_blank" rel="noopener noreferrer"';

// Small "open in new tab" arrow shown on the primary Marketplace button.
const EXTERNAL_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>`;

const legalFile = (doc, slug) => `${doc}-${slug}.html`;
const legalLinks = (slug) => LEGAL_DOCS.map((d) => ({ label: d.label, href: legalFile(d.key, slug) }));
const isExternal = (href) => /^https?:/.test(href);

// Formats 2026-11-22 as "November 22, 2026" (UTC, so the date never shifts).
function longDate(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  });
}

// gray-matter turns unquoted YAML dates into Date objects; normalise to YYYY-MM-DD.
function isoDate(value) {
  return value instanceof Date ? value.toISOString().split('T')[0] : String(value);
}

/* ------------------------------------------------------------------ */
/* Product pages                                                       */
/* ------------------------------------------------------------------ */

function renderBadges(badges) {
  return badges
    .map((b) => `            <div class="badge-pill badge-${b.tone || 'indigo'}">
              <span class="badge-dot" aria-hidden="true"></span>
              <span>${esc(b.text)}</span>
            </div>`)
    .join('\n');
}

// Hero buttons: Marketplace (primary), Knowledge Base (secondary), extra links (outline).
function renderHeroActions(app) {
  const buttons = [
    `            <a href="${esc(app.marketplace.url)}" ${EXT} class="btn btn-primary">
              <span>${esc(app.marketplace.label)}</span>
              ${EXTERNAL_ICON}
            </a>`,
  ];
  if (app.knowledgeBase) {
    buttons.push(`            <a href="${esc(app.knowledgeBase)}" ${EXT} class="btn btn-secondary">
              <span>Knowledge Base &rarr;</span>
            </a>`);
  }
  for (const link of app.extraLinks || []) {
    const attrs = isExternal(link.href) ? ` ${EXT}` : '';
    buttons.push(`            <a href="${esc(link.href)}"${attrs} class="btn btn-outline">
              <span>${esc(link.label)}</span>
            </a>`);
  }
  return buttons.join('\n');
}

function renderChips(chips = []) {
  if (!chips.length) return '';
  const items = chips
    .map((c) => `            <span><span aria-hidden="true">${c.icon}</span> ${md(c.text)}</span>`)
    .join('\n');
  return `
          <div class="hero-chips">
${items}
          </div>
`;
}

function renderHighlights(highlights) {
  const cards = highlights
    .map((h) => `            <div class="feature-box highlight-card">
              <div class="highlight-icon" aria-hidden="true">${h.icon}</div>
              <h3>${esc(h.title)}</h3>
              <p>${md(h.text)}</p>
            </div>`)
    .join('\n');
  return `          <div class="highlight-grid">
${cards}
          </div>`;
}

function renderFeatures(features) {
  const boxes = features
    .map((f, i) => `            <div class="feature-box">
              <h4>${i + 1}. ${esc(f.title)}</h4>
              <p>${md(f.text)}</p>
            </div>`)
    .join('\n');
  return `          <h3 class="section-title">Features</h3>
          <div class="features-list">
${boxes}
          </div>`;
}

function renderSteps(steps) {
  const items = steps.items
    .map((s, i) => `              <div class="workflow-step">
                <span class="value-num">${String(i + 1).padStart(2, '0')}</span>
                <div>
                  <strong>${esc(s.title)}:</strong>
                  <span> ${md(s.text)}</span>
                </div>
              </div>`)
    .join('\n');
  return `          <div class="about-card product-card-block">
            <h3>${esc(steps.heading)}</h3>
            <div class="workflow-steps">
${items}
            </div>
          </div>`;
}

function renderAudience(audience) {
  if (!audience) return '';
  const items = audience.items
    .map((a) => `              <li><strong>${esc(a.title)}:</strong> ${md(a.text)}</li>`)
    .join('\n');
  return `
          <div class="product-section">
            <h3>${esc(audience.heading)}</h3>
            <p class="section-lead">${md(audience.intro)}</p>
            <ul class="product-list">
${items}
            </ul>
          </div>
`;
}

function renderTrust(trust) {
  return `          <div class="about-card product-card-block">
            <div class="trust-heading">
              <span aria-hidden="true">${trust.icon}</span>
              <h3>${esc(trust.heading)}</h3>
            </div>
            <p>${md(trust.text)}</p>
          </div>`;
}

function renderQuickstart(qs) {
  const items = qs.steps.map((s) => `              <li>${md(s)}</li>`).join('\n');
  return `          <div class="product-section">
            <h3>${esc(qs.heading)}</h3>
            <ol class="product-list">
${items}
            </ol>
          </div>`;
}

// Sidebar spec list. Vendor and Support rows are added for every app.
function renderSidebar(app) {
  const specs = [
    ...app.specs.map((s) => ({ label: s.label, html: md(s.value), accent: s.accent })),
    { label: 'Vendor', html: `<a href="${VENDOR_URL}" ${EXT} class="product-link">NoxVoid Software</a>` },
    { label: 'Support', html: `<a href="mailto:${esc(app.supportEmail)}" class="product-link">${esc(app.supportEmail)}</a>` },
  ];
  const rows = specs
    .map((s) => `              <li class="spec-item">
                <span class="spec-label">${esc(s.label)}</span>
                <span class="spec-value${s.accent ? ` spec-${s.accent}` : ''}">${s.html}</span>
              </li>`)
    .join('\n');

  const buttons = [
    `            <a href="${esc(app.marketplace.url)}" ${EXT} class="btn btn-primary btn-block">${esc(app.marketplace.label)}</a>`,
  ];
  if (app.knowledgeBase) {
    buttons.push(`            <a href="${esc(app.knowledgeBase)}" ${EXT} class="btn btn-secondary btn-sm btn-block">User Documentation</a>`);
  }
  for (const link of app.extraLinks || []) {
    const attrs = isExternal(link.href) ? ` ${EXT}` : '';
    buttons.push(`            <a href="${esc(link.href)}"${attrs} class="btn btn-outline btn-sm btn-block">${esc(link.label)} &rarr;</a>`);
  }

  const legal = legalLinks(app.slug)
    .map((l) => `<a href="${l.href}">${esc(l.label)}</a>`)
    .join(' <span>•</span> ');

  return `        <aside class="product-sidebar">
          <div class="product-sidebar-card">
            <h4 class="sidebar-title">Marketplace Specs</h4>
            <ul class="spec-list">
${rows}
            </ul>
${buttons.join('\n')}
            <p class="blog-meta sidebar-legal">${legal}</p>
          </div>
        </aside>`;
}

function buildAppJsonLd(app) {
  const url = `${BASE_URL}/${app.file}`;
  const imageUrl = app.seo?.iconPng
    ? `${BASE_URL}/${app.seo.iconPng.replace(/^\//, '')}`
    : `${BASE_URL}/assets/logo-512.png`;

  const softwareNode = {
    '@type': 'WebApplication',
    '@id': `${url}#software`,
    'name': app.legalName || app.name,
    'alternateName': app.name,
    'url': url,
    'description': app.seo.description || app.lead,
    'applicationCategory': 'BusinessApplication',
    'operatingSystem': 'Atlassian Cloud / Web Browser',
    'browserRequirements': 'Requires JavaScript. Compatible with all modern browsers.',
    'isAccessibleForFree': Boolean(app.seo?.freeTier),
    'image': imageUrl,
    'publisher': {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      'name': 'NoxVoid Software',
      'url': BASE_URL,
      'logo': {
        '@type': 'ImageObject',
        'url': `${BASE_URL}/assets/logo-512.png`,
        'width': 512,
        'height': 512
      }
    }
  };

  if (app.seo?.freeTier) {
    softwareNode.offers = {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
      'availability': 'https://schema.org/InStock',
      'url': app.marketplace?.url || url
    };
  }

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      softwareNode,
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': BASE_URL
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Jira Apps',
            'item': `${BASE_URL}/#atlassian`
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': app.name,
            'item': url
          }
        ]
      }
    ]
  };

  return `  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
  </script>`;
}

function buildLegalJsonLd(app, doc) {
  const file = legalFile(doc.key, app.slug);
  const url = `${BASE_URL}/${file}`;
  const appUrl = `${BASE_URL}/${app.file}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': BASE_URL
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': app.name,
        'item': appUrl
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': doc.label,
        'item': url
      }
    ]
  };

  return `  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
  </script>`;
}

function renderProductPage(app) {
  return `${head({
    title: `${app.seo.title} — NoxVoid`,
    description: app.seo.description,
    path: app.file,
    ogType: 'product',
    ogTitle: app.seo.ogTitle,
    ogDescription: app.seo.ogDescription,
    ogImage: app.seo.ogImage,
    extraHead: buildAppJsonLd(app),
  })}${siteHeader('jira')}
    <main>
      <!-- Hero -->
      <section class="product-hero">
        <div class="container">
          <div class="breadcrumb-nav">
            <a href="index.html#atlassian" class="breadcrumb-link">&larr; All Jira apps</a>
          </div>

          <img src="${esc(app.icon)}" alt="${esc(app.name)} icon" class="product-hero-icon" width="72" height="72">

          <div class="badge-row">
${renderBadges(app.badges)}
          </div>

          <h1 class="hero-title product-title">${esc(app.title)}</h1>
          <p class="hero-lead product-lead">${md(app.lead)}</p>
${renderChips(app.chips)}
          <div class="hero-actions">
${renderHeroActions(app)}
          </div>
        </div>
      </section>

      <!-- Main content -->
      <section class="container product-details-container">
        <div class="product-main-content">
          <h2>${esc(app.overview.heading)}</h2>
          <p class="section-lead">${md(app.overview.text)}</p>

${renderHighlights(app.highlights)}

${renderFeatures(app.features)}

${renderSteps(app.steps)}
${renderAudience(app.audience)}
${renderTrust(app.trust)}

${renderQuickstart(app.quickstart)}
        </div>

        <!-- Sidebar / Specs -->
${renderSidebar(app)}
      </section>
    </main>
${siteFooter(legalLinks(app.slug))}`;
}

/* ------------------------------------------------------------------ */
/* Legal pages                                                         */
/* ------------------------------------------------------------------ */

/**
 * Expands {{> doc/name}} includes from content/legal/_shared and numbers every
 * "## Heading" as "## N. Heading", so shared sections can sit anywhere in a policy.
 */
function buildLegalMarkdown(body, sharedDir) {
  const expanded = body.replace(/^\{\{>\s*([\w/-]+)\s*\}\}\s*$/gm, (_, name) => {
    const file = path.join(sharedDir, `${name}.md`);
    if (!fs.existsSync(file)) throw new Error(`Missing shared legal section: ${name}`);
    return fs.readFileSync(file, 'utf-8').trim();
  });
  let n = 0;
  return expanded.replace(/^## (.+)$/gm, (_, title) => `## ${++n}. ${title}`);
}

function renderLegalPage(app, doc, { description, updated, html }) {
  const file = legalFile(doc.key, app.slug);
  const title = `${doc.label} — ${app.legalName}`;
  const crossLinks = legalLinks(app.slug)
    .map((l) => `<a href="${l.href}">${esc(l.label)}</a>`)
    .join(' <span>•</span> ');

  return `${head({ title: `${title} — NoxVoid Software`, description, path: file, ogTitle: title, extraHead: buildLegalJsonLd(app, doc) })}${siteHeader(app.nav || 'jira')}
    <main>
      <article class="container article-container">
        <div class="breadcrumb-nav">
          <a href="${app.file}" class="breadcrumb-link">&larr; Back to ${esc(app.name)}</a>
        </div>

        <header class="article-header">
          <div class="blog-meta">
            <span>Legal</span>
            <span>•</span>
            <span>Last modified: <time datetime="${updated}">${longDate(updated)}</time></span>
          </div>
          <h1 class="article-title">${esc(title)}</h1>
        </header>

        <div class="article-content">
${html}
        </div>
        <p class="blog-meta legal-links">${crossLinks}</p>
      </article>
    </main>
${siteFooter(legalLinks(app.slug))}`;
}

/**
 * Builds every product page and its legal pages.
 * Returns the list of generated file names (for the sitemap).
 */
function buildAppPages(rootDir) {
  const appsDir = path.join(rootDir, 'content', 'apps');
  const legalDir = path.join(rootDir, 'content', 'legal');
  const sharedDir = path.join(legalDir, '_shared');
  const generated = [];

  const appFiles = fs.readdirSync(appsDir).filter((f) => f.endsWith('.json')).sort();
  for (const appFile of appFiles) {
    const app = JSON.parse(fs.readFileSync(path.join(appsDir, appFile), 'utf-8'));

    // "legalOnly": the app's page is written by hand (app.file); only its legal pages are generated.
    if (!app.legalOnly) {
      fs.writeFileSync(path.join(rootDir, app.file), renderProductPage(app), 'utf-8');
      generated.push(app.file);
      console.log(`Generated ${app.file}`);
    }

    for (const doc of LEGAL_DOCS) {
      const src = path.join(legalDir, app.slug, `${doc.key}.md`);
      const { data, content } = matter(fs.readFileSync(src, 'utf-8'));
      const html = marked.parse(buildLegalMarkdown(content, sharedDir));
      const file = legalFile(doc.key, app.slug);
      fs.writeFileSync(
        path.join(rootDir, file),
        renderLegalPage(app, doc, { description: data.description, updated: isoDate(data.updated), html }),
        'utf-8',
      );
      generated.push(file);
      console.log(`Generated ${file}`);
    }
  }
  return generated;
}

module.exports = { buildAppPages };
