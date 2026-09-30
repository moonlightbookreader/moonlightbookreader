// ─── Parse Markdown: links, bold, line breaks ───
function parseRichText(text) {
  if (!text) return '';

  let parsed = text;

  // Convert [link text](url) → clickable link
  parsed = parsed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Convert **bold text** → bold
  parsed = parsed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Convert line breaks
  parsed = parsed.replace(/\n/g, '<br>');

  return parsed;
}

let siteData = {}, aboutData = {}, books = [], journalEntries = [];

// ─── GENRE TAG HELPERS ───
let activeGenreFilter = null;

function getGenreClass(name) {
  if (!name) return 'custom-genre';
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

function buildGenreTags(book) {
  const tags = [];
  
  // Main Genre (supports both 'category' and 'mainGenre' for backward compatibility)
  const mainG = book.mainGenre || book.category;
  if (mainG) {
    tags.push({ name: mainG.trim(), class: getGenreClass(mainG) });
  }
  
  // Additional Genres (comma-separated)
  if (book.otherGenres) {
    book.otherGenres.split(',')
      .map(g => g.trim())
      .filter(g => g)
      .forEach(name => {
        tags.push({ name, class: getGenreClass(name) });
      });
  }
  
  if (!tags.length) return '';
  
  return `
    <div class="genre-tags">
      ${tags.map(t => `
        <span class="genre-tag ${t.class}" data-genre="${t.name}">
          ${t.name}
        </span>
      `).join('')}
    </div>
  `;
}

function setGenreFilter(genreName) {
  activeGenreFilter = (activeGenreFilter === genreName) ? null : genreName;
  renderBooksList();
}

function bookMatchesGenre(book) {
  if (!activeGenreFilter) return true;
  
  const allGenres = [];
  const mainG = book.mainGenre || book.category;
  if (mainG) allGenres.push(mainG.trim());
  if (book.otherGenres) {
    book.otherGenres.split(',').map(g => g.trim()).filter(g => g).forEach(g => allGenres.push(g));
  }
  
  return allGenres.includes(activeGenreFilter);
}

function attachGenreListeners() {
  document.querySelectorAll('.genre-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      setGenreFilter(tag.dataset.genre);
    });
    
    if (tag.dataset.genre === activeGenreFilter) {
      tag.classList.add('active');
    } else {
      tag.classList.remove('active');
    }
  });
}

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
  redbubble: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M9.5 8.5h5v1h-5zm0 2h5v1h-5zm0 2h3v1h-3z"/></svg>`,
  amazon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M15.93 17.09c-2.31 1.06-4.73 1.58-7.22 1.58-3.36 0-6.55-1.24-9.08-3.48-.19-.17-.02-.42.21-.28 2.59 1.5 5.78 2.41 9.09 2.41 2.24 0 4.69-.49 6.95-1.42.34-.14.63.22.05.58z"/><path d="M16.54 15.47c-.29-.36-1.89-.17-2.61-.1-.22.02-.25-.17-.06-.31.13-.09.38-.26.58-.35.19-.09.4-.27.57-.4.23-.17.4-.39.52-.64.12-.25.18-.52.18-.79 0-.42-.09-.79-.27-1.11-.18-.32-.44-.57-.76-.74-.32-.17-.68-.25-1.08-.25-.58 0-1.12.11-1.6.33-.48.22-.88.53-1.19.93-.31.4-.53.87-.65 1.4-.12.53-.18 1.09-.18 1.66 0 .57.06 1.12.18 1.65.12.53.34 1 .65 1.4.31.4.71.73 1.19.95.48.22 1.02.33 1.6.33.53 0 1.06-.07 1.58-.21.52-.14.99-.35 1.41-.63.42-.28.76-.62 1.02-1.02.26-.4.39-.85.39-1.33 0-.37-.07-.7-.21-1-.14-.3-.34-.54-.6-.72z"/><path d="M19.74 14.53c-.35-.45-.77-.82-1.26-1.1-.49-.28-1.03-.42-1.62-.42-.52 0-1.01.09-1.47.27-.46.18-.87.43-1.22.75-.35.32-.63.7-.83 1.14-.2.44-.3.92-.3 1.43 0 .51.1 1 .3 1.43.2.43.48.82.83 1.14.35.32.76.57 1.22.75.46.18.95.27 1.47.27.59 0 1.13-.14 1.62-.42.49-.28.91-.65 1.26-1.1.35-.45.6-.96.75-1.52.15-.56.23-1.14.23-1.74 0-.6-.08-1.18-.23-1.74-.15-.56-.4-1.07-.75-1.52z"/></svg>`,
  amazonWishlist: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
  etsy: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-.5 19H8.5v-5H6.5V9h2v-2.5c0-1.93 1.57-3.5 3.5-3.5h2v4h-1c-.55 0-1 .45-1 1V9h2.5v5H12v5z"/></svg>`,
  kofi: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
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
  // Count all genres including additional ones
  const allGenres = new Set();
  books.forEach(book => {
    const mainG = book.mainGenre || book.category;
    if (mainG) allGenres.add(mainG.trim());
    if (book.otherGenres) {
      book.otherGenres.split(',').map(g => g.trim()).filter(g => g).forEach(g => allGenres.add(g));
    }
  });
  if (g) g.textContent = allGenres.size;
}

function renderBookCard(book, full = false) {
  const cover = book.coverImage 
  ? `<img src="${book.coverImage}" alt="${book.title}" class="book-cover" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">` 
    + `<div class="book-cover-placeholder" style="display:none;">📖</div>`
  : `<div class="book-cover-placeholder">📖</div>`;
  const fmt = book.format ? `<span class="book-format">${book.format}</span>` : '';
  const tags = buildGenreTags(book);
  
  let c = `<div class="book-card"><div class="book-header">${cover}<div class="book-meta"><a href="book.html?id=${book.id}" class="book-title">${book.title}</a><p class="book-author">by ${book.author}</p><div class="book-rating">${renderStars(book.rating || 0)}</div>${tags}<div class="book-tags">${fmt}</div></div></div>`;
  if (full) {
    if (book.excerpt) c += `<p class="book-excerpt">"${book.excerpt}"</p>`;
    if (book.fullReview) c += `<div class="book-full-content">${parseRichText(book.fullReview)}</div>`;
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

function renderBooksList() {
  const container = document.getElementById('booksContainer');
  if (!container) return;
  container.innerHTML = '';
  
  books.forEach(book => {
    if (!bookMatchesGenre(book)) return;
    container.innerHTML += renderBookCard(book, false);
  });
  
  attachGenreListeners();
  renderStats();
}

function renderJournalEntry(e, full = false) {
  let c = `<div class="journal-entry"><span class="journal-type">${e.type}</span><a href="journal-entry.html?id=${e.id}" class="journal-title">${e.title}</a>`;

  if (full) {
    // Full entry — show formatted links & bold ✨
    c += `<div class="journal-content">${parseRichText(e.text)}</div>`;

    if (e.attribution) c += `<p class="journal-attribution">— ${e.attribution}</p>`;
  } else {
    // Preview — show clean plain text 📝
    const t = document.createElement('div');
    t.innerHTML = parseRichText(e.text);
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

document.addEventListener('DOMContentLoaded', async () => {
  generateStars(85);
  addMoonDecorations();
  await loadAllData();
  
  renderProfile();
  renderSocialLinks('socialLinks');
  renderAbout();
  renderStats();
  
  // Render books list if on home/books page
  if (document.getElementById('booksContainer')) {
    renderBooksList();
  }
  
  // Single book page
  const bookId = getUrlParam('id');
  if (bookId && books.length > 0) {
    const book = books.find(b => b.id === bookId);
    if (book) {
      const singleContainer = document.getElementById('singleBook');
      if (singleContainer) {
        singleContainer.innerHTML = renderBookCard(book, true);
      }
    }
  }
  // ─── Render Journal Entries List ───
  if (document.getElementById('journalContainer')) {
    const journalContainer = document.getElementById('journalContainer');
    journalContainer.innerHTML = '';
    
    journalEntries.forEach(entry => {
      journalContainer.innerHTML += renderJournalEntry(entry, false);
    });
  }
  
  // Single journal entry page
  const entryId = getUrlParam('id');
  if (entryId && journalEntries.length > 0) {
    const entry = journalEntries.find(e => e.id === entryId);
    if (entry) {
      const singleEntryContainer = document.getElementById('singleJournalEntry');
      if (singleEntryContainer) {
        singleEntryContainer.innerHTML = renderJournalEntry(entry, true);
      }
    }
  }
});
