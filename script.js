let siteData = {}, aboutData = {}, books = [], journalEntries = [];

async function loadAllData() {
  try {
    const [s, a, b, j] = await Promise.all([
      fetch('content/site.json').catch(() => ({ json: () => ({}) })),
      fetch('content/about.json').catch(() => ({ json: () => ({}) })),
      fetch('content/books.json').catch(() => ({ json: () => ({ entries: [] }) })),
      fetch('content/journal.json').catch(() => ({ json: () => ({ entries: [] }) }))
    ]);
    siteData = await s.json();
    aboutData = await a.json();
    const bd = await b.json(), jd = await j.json();
    books = (bd.entries || []).sort((a, b) => new Date(b.date) - new Date(a.date));
    journalEntries = (jd.entries || []).sort((a, b) => new Date(b.date) - new Date(a.date));
    return true;
  } catch (e) { console.error(e); return false; }
}

function generateStars(count = 80) {
  const bg = document.createElement('div');
  bg.className = 'stars-bg';
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'twinkle';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    const sz = 1 + Math.random() * 2.5;
    s.style.width = sz + 'px'; s.style.height = sz + 'px';
    s.style.setProperty('--dur', (2 + Math.random() * 4) + 's');
    s.style.setProperty('--delay', Math.random() * 5 + 's');
    if (Math.random() < 0.15) s.style.boxShadow = `0 0 ${sz * 3}px rgba(255,248,220,.5)`;
    bg.appendChild(s);
  }
  document.body.insertBefore(bg, document.body.firstChild);
}

function addMoonDecorations() {
  const m1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  m1.setAttribute('class', 'moon-deco moon-phase-anim');
  m1.setAttribute('style', 'top:80px;right:3%;width:90px;height:90px;position:fixed;');
  m1.setAttribute('viewBox', '0 0 100 100');
  m1.innerHTML = '<defs><radialGradient id="mg1" cx="40%" cy="40%"><stop offset="0%" stop-color="#f5e6d3"/><stop offset="100%" stop-color="#d4a857"/></radialGradient></defs><circle cx="50" cy="50" r="36" fill="url(#mg1)"/><circle cx="64" cy="45" r="28" fill="#150c2b"/>';
  document.body.appendChild(m1);
  const m2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  m2.setAttribute('class', 'moon-deco slow-spin');
  m2.setAttribute('style', 'bottom:15%;right:2%;width:60px;height:60px;position:fixed;');
  m2.setAttribute('viewBox', '0 0 100 100');
  m2.innerHTML = '<circle cx="50" cy="50" r="38" fill="#f5e6d3" opacity=".6"/><circle cx="60" cy="48" r="32" fill="#150c2b"/>';
  document.body.appendChild(m2);
}

const socialIcons = {
  goodreads: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 0C5.149 0 0 5.149 0 11.5S5.149 23 11.5 23 23 17.851 23 11.5 17.851 0 11.5 0zm4.607 17.528c-.365.166-.747.297-1.142.395v.183c0 .322.023.623.058.902h-7.31c.07-.503.14-1.006.14-1.517 0-.51-.07-1.013-.14-1.517h3.31c.14.47.21.97.21 1.484 0 .693-.14 1.34-.386 1.926h1.54c.105-.28.175-.595.175-.937v-2.37c0-.342-.07-.658-.175-.937h-1.54c.246.586.386 1.233.386 1.926 0 .514-.07 1.014-.21 1.484H7.83c.14-.47.21-.97.21-1.484 0-.514-.07-1.014-.21-1.484h3.31c-.14-.47-.21-.97-.21-1.484 0-.51.07-1.013.21-1.517H7.55c.14-.503.21-1.006.21-1.517 0-.51-.07-1.013-.21-1.517h7.31c-.035.28-.058.58-.058.902v.183c.395.098.777.229 1.142.395v-2.23h1.575v11.19h-1.575v-2.23z"/></svg>`,
  storygraph: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.5 4.5h3v15h-3v-15zm-4 3h3v12h-3v-12zm8 1.5h3v10.5h-3V9zm4 3h3v7.5h-3V12z"/></svg>`,
  instagram: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  twitter: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  threads: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 10.8c-1.149-2.128-4.043-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.562.139 1.902 0 3.08 0 4.3c0 .679.133 3.194.23 3.677.768 3.872 4.433 4.956 7.43 5.342-2.482.28-6.86.758-7.387 2.43-.408 1.28-.197 5.394 6.612 6.722 2.913.571 4.896.922 5.113 1.482.323.845-.21 2.107-3.482.977-2.027-.701-2.34-1.052-3.106-1.838l-.156-.154c-.86-.86-1.66-1.96-1.66-3.18 0-.42.34-.76.76-.76.27 0 .53.11.72.3l1.84 1.56c.65.55 1.5.86 2.4.86s1.75-.31 2.4-.86l1.84-1.56c.19-.19.45-.3.72-.3.42 0 .76.34.76.76 0 1.22-.8 2.32-1.66 3.18l-.156.154c-.766.786-1.079 1.137-3.106 1.838-3.272 1.13-3.805.132-3.482-.977.217-.56.8-1.09 2.2-1.38 4.203-.87 6.842-1.58 6.842-4.94 0-.39-.02-2.58-.23-3.677C23.867 3.194 24 4.979 24 4.3 24 3.08 23.861 1.902 23.098 1.562c-.659-.296-1.664-.618-4.3.043-2.755 1.942-5.649 5.867-6.798 7.995z"/></svg>`,
  tiktok: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v3.07c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.65-1.35 3.81-.97 1.51-2.37 2.53-4.18 2.91-1.53.33-3.06.26-4.58-.09-1.74-.41-3.34-1.34-4.57-2.82-.98-1.19-1.49-2.64-1.5-4.21-.01-1.54-.26-3.07-.9-4.37 1.48.35 3.02.53 4.6.52.02-1.48.01-2.97.01-4.46 1.06-.02 2.11-.19 3.14-.52.43-.14.83-.35 1.18-.62.58-.44 1.02-1.03 1.3-1.69.27-.66.38-1.38.32-2.09.01-.46.02-.91.01-1.37z"/></svg>`,
  youtube: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  pinterest: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.913 2.168-2.913 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.088.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>`,
  letterboxd: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M8.29 14.286a10.282 10.282 0 0 1-4.27 2.555V7.18a10.282 10.282 0 0 1 4.27 2.555v4.551zm11.918-6.18v8.027a10.282 10.282 0 0 1-4.27-2.556v-4.55a10.282 10.282 0 0 1 4.27-2.556zM12 18.51a9.98 9.98 0 0 0-4.27-.976v-4.551c1.355.336 2.78.514 4.27.514 1.49 0 2.915-.178 4.27-.514v4.55A9.98 9.98 0 0 0 12 18.51zm0-13.02c1.49 0 2.915.178 4.27.514v4.551a9.98 9.98 0 0 0-4.27-.977 9.98 9.98 0 0 0-4.27.977v-4.55A9.98 9.98 0 0 1 12 5.49z"/></svg>`,
  bloglovin: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 24c-3.313 0-6-2.687-6-6v-4.784c0-3.312 2.687-6 6-6s6 2.688 6 6V18c0 3.313-2.687 6-6 6zm0-14.47c-1.916 0-3.47 1.554-3.47 3.47V18c0 1.916 1.554 3.47 3.47 3.47s3.47-1.554 3.47-3.47v-4.784c0-1.916-1.554-3.47-3.47-3.47zM11.094 0l2.074 1.23-2.074 3.588L9.02 1.23 11.094 0z"/></svg>`,
  mastodon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M23.268 5.313c-.35-1.624-2.564-2.969-5.243-2.969-1.76 0-3.465.515-4.915 1.478C11.977 4.29 10.535 4.72 9 4.719c-2.758 0-5.09.97-6.618 2.748C.817 9.112 0 11.415 0 13.907c0 4.408 2.855 8.125 6.822 9.545.763.274 1.579.513 2.437.712 1.31.296 2.686.458 4.087.458.835 0 1.657-.048 2.46-.143a3.38 3.38 0 0 0 1.722-1.298c.064-.1.12-.203.17-.309.048-.103.09-.208.125-.314.082-.246.145-.504.188-.77.116-.73.174-1.476.174-2.227v-.793c0-1.553-.026-3.025-.067-4.418-.017-.588-.078-1.166-.183-1.732zm-4.057 5.447c-.096 1.253-.28 2.47-.547 3.647-.195.852-.424 1.66-.688 2.42-.192.55-.423 1.073-.69 1.567-.072.13-.148.257-.227.38-.066.102-.136.202-.21.3-.074.097-.152.19-.233.28-.088.096-.18.186-.275.272-.102.093-.208.18-.318.262-.114.085-.232.164-.354.238-.127.077-.259.148-.394.213-.14.068-.285.128-.433.182-.152.055-.309.1-.469.138-.164.04-.332.07-.503.09-.174.02-.351.03-.53.03-.187 0-.372-.01-.555-.03-.185-.02-.367-.05-.545-.09-.178-.04-.353-.09-.523-.148-.168-.058-.33-.127-.486-.206-.156-.078-.304-.167-.444-.265-.138-.097-.267-.205-.387-.322-.117-.114-.226-.238-.326-.37-.102-.134-.193-.277-.274-.428-.082-.15-.153-.31-.213-.476-.06-.166-.11-.34-.148-.52-.04-.18-.068-.366-.085-.557-.018-.19-.027-.385-.027-.583 0-.198.01-.393.027-.583.017-.19.046-.376.085-.557.038-.18.088-.354.148-.52.06-.166.13-.326.213-.476.08-.15.172-.293.274-.428.1-.132.209-.256.326-.37.12-.117.25-.225.387-.322.14-.098.288-.187.444-.265.156-.08.318-.148.486-.206.17-.06.345-.108.523-.148.178-.04.36-.07.545-.09.183-.02.368-.03.555-.03.179 0 .356.01.53.03.171.02.339.05.503.09.16.038.317.083.469.138.148.054.293.114.433.182.135.065.267.136.394.213.122.074.24.153.354.238.11.082.216.169.318.262.095.086.187.176.275.272.081.09.159.183.233.28.074.098.144.198.21.3.079.123.155.25.227.38.267.494.498 1.017.69 1.567.264.76.452 1.604.547 2.42.09.76.135 1.54.135 2.32 0 .78-.045 1.56-.135 2.32z"/></svg>`,
  email: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
};

function renderStars(r) { let s = ''; for (let i = 1; i <= 5; i++) s += i <= r ? '★' : '☆'; return s; }
function formatDate(d) { return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); }

function renderSocialLinks(id) {
  const c = document.getElementById(id); if (!c) return; c.innerHTML = '';
  for (const [p, url] of Object.entries(siteData)) {
    if (url && socialIcons[p]) {
      const a = document.createElement('a');
      a.href = p === 'email' ? `mailto:${url}` : url;
      a.target = p === 'email' ? '_self' : '_blank';
      a.rel = 'noopener';
      a.className = 'social-icon';
      a.innerHTML = socialIcons[p];
      a.title = p.charAt(0).toUpperCase() + p.slice(1).replace(/([A-Z])/g, ' $1');
      c.appendChild(a);
    }
  }
}

function renderProfile() {
  if (siteData.name) {
    const n = document.getElementById('profileName'), t = document.getElementById('siteTitle');
    if (n) n.textContent = siteData.name;
    if (t) t.textContent = siteData.name;
  }
  if (siteData.tagline) {
    const p = document.getElementById('profileTagline'), s = document.getElementById('siteTagline');
    if (p) p.textContent = siteData.tagline;
    if (s) s.textContent = siteData.tagline;
  }
  if (siteData.profileImage) {
    const img = document.getElementById('profileImg');
    if (img) { img.src = siteData.profileImage; img.style.display = 'block'; }
  }
}

function renderStats() {
  const b = document.getElementById('statBooks'), g = document.getElementById('statGenres');
  if (b) b.textContent = books.length;
  if (g) g.textContent = [...new Set(books.map(x => x.category))].length;
}

function renderBookCard(book, full = false) {
  const cover = book.coverImage ? `<img src="${book.coverImage}" alt="${book.title}" class="book-cover">` : `<div class="book-cover-placeholder">📖</div>`;
  const fmt = book.format ? `<span class="book-format">${book.format}</span>` : '';
  let c = `<div class="book-card"><div class="book-header">${cover}<div class="book-meta"><a href="book.html?id=${book.id}" class="book-title">${book.title}</a><p class="book-author">by ${book.author}</p><div class="book-rating">${renderStars(book.rating || 0)}</div><div class="book-tags"><span class="book-category">${book.category}</span>${fmt}</div></div></div>`;
  if (full) {
    if (book.excerpt) c += `<p class="book-excerpt">"${book.excerpt}"</p>`;
    if (book.fullReview) c += `<div class="book-full-content">${book.fullReview}</div>`;
    if (book.highlights && book.highlights.length) {
      c += `<ul class="book-highlights"><strong style="color:var(--accent);font-family:'Playfair Display',serif;font-style:italic;">Highlights</strong>`;
      book.highlights.forEach(h => { c += `<li>${h}</li>`; });
      c += `</ul>`;
    }
    if (book.verdict) c += `<p class="book-verdict"><strong style="color:var(--accent);">Verdict:</strong> ${book.verdict}</p>`;
  } else {
    if (book.excerpt) c += `<p class="book-excerpt">"${book.excerpt}"</p>`;
    c += `<a href="book.html?id=${book.id}" class="read-more">Read full review →</a>`;
  }
  return c + `</div>`;
}

function renderJournalEntry(e, full = false) {
  let c = `<div class="journal-entry"><span class="journal-type">${e.type}</span><a href="journal-entry.html?id=${e.id}" class="journal-title">${e.title}</a><p class="journal-date">${formatDate(e.date)}</p>`;
  if (full) {
    c += `<div class="journal-content">${e.text}</div>`;
    if (e.attribution) c += `<p class="journal-attribution">— ${e.attribution}</p>`;
  } else {
    const t = document.createElement('div'); t.innerHTML = e.text;
    const txt = t.textContent || '';
    c += `<p style="color:var(--text-soft);margin-bottom:.5rem;">${txt.length > 220 ? txt.substring(0, 220) + '...' : txt}</p>`;
    c += `<a href="journal-entry.html?id=${e.id}" class="read-more">Continue reading →</a>`;
  }
  return c + `</div>`;
}

function renderAbout() {
  if (aboutData.heading) { const h = document.getElementById('aboutHeading'); if (h) h.textContent = aboutData.heading; }
  if (aboutData.introLine) { const e = document.getElementById('aboutIntro'); if (e) e.textContent = aboutData.introLine; }
  if (aboutData.signoff) { const e = document.getElementById('aboutSignoff'); if (e) e.textContent = aboutData.signoff; }
  const bio = document.getElementById('aboutBio');
  if (bio && aboutData.bioParagraphs && Array.isArray(aboutData.bioParagraphs)) {
    bio.innerHTML = '';
    aboutData.bioParagraphs.forEach(p => { const el = document.createElement('p'); el.textContent = p; bio.appendChild(el); });
  }
}

function getUrlParam(n) { return new URLSearchParams(window.location.search).get(n); }

document.addEventListener('DOMContentLoaded', () => { generateStars(85); addMoonDecorations(); });
