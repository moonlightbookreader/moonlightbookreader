// ==============================
// 🌙 MOONLIGHT BOOK READER — SCRIPT
// FIXED: Newest first on homepage · journal links → journal-entry.html
// Half-star fix: ★ inside .star-half for perfect baseline alignment
// ==============================
// --- Icon Mapping ---
const iconMap = {
  'OBSERVATION': 'content/images/journal-icons/icon-observation.png',
  'OPINION': 'content/images/journal-icons/icon-opinion.png',
  'HOT TAKE': 'content/images/journal-icons/icon-hottake.png',
  'REFLECTION': 'content/images/journal-icons/icon-reflection.png',
  'QUOTE': 'content/images/journal-icons/icon-quote.png',
  'BOOK HAUL': 'content/images/journal-icons/icon-bookhaul.png',
  'RECOMMENDATION': 'content/images/journal-icons/icon-recommendation.png',
  'LIFE': 'content/images/journal-icons/icon-life.png'
};
// --- State ---
let siteData = {}, aboutData = {}, books = [], journalEntries = [];
let activeGenreFilter = null;
let activeTypeFilter = null;
// --- Helper: Format Date ---
function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  });
}
// --- Generate Stars with VISUAL half-star support ✨ ---
function renderStars(rating) {
  const r = parseFloat(rating) || 0;
  const full = Math.floor(r);
  const half = (r % 1) >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  
  let html = '<span class="star-rating">';
  html += '<span class="star-full">' + '★'.repeat(full) + '</span>';
  if (half) {
    html += '<span class="star-half">★</span>';
  }
  html += '<span class="star-empty">' + '★'.repeat(empty) + '</span>';
  html += '</span>';
  return html;
}
// --- Rich Text Parser ---
function parseRichText(text) {
  if (!text) return '';
  let parsed = text;
  parsed = parsed.replace(/\+\+/g, '');
  parsed = parsed.split('\n').map(line => {
    if (line.trim().startsWith('>')) {
      const content = line.trim().replace(/^>\s*/, '');
      return `<blockquote>${content}</blockquote>`;
    }
    return line;
  }).join('\n');
  parsed = parsed.replace(/\*\*\*([^*]+)\*\*\*/g, '<em><strong>$1</strong></em>');
  parsed = parsed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  parsed = parsed.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  parsed = parsed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  parsed = parsed.replace(/\n/g, '<br>');
  return parsed;
}
// --- Get URL Parameter Helper ---
function getUrlParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}
// --- Helpers ---
function getGenreClass(name) {
  if (!name) return 'custom-genre';
  return name.trim().toLowerCase().replace(/[^a-z0-9\- ]/g, '').replace(/\s+/g, '-');
}
function getTypeClass(name) {
  if (!name) return 'custom-type';
  return name.trim().toLowerCase().replace(/[^a-z0-9\- ]/g, '').replace(/\s+/g, '-');
}
// Build genre pills — matches CSS class .genre-pill
function buildGenreTags(bookOrEntry, clickable = true) {
  const makePill = (g) => {
    const cls = getGenreClass(g);
    const label = g.trim();
    if (label.toLowerCase() === 'magical realism') {
      if (clickable) {
        return `<a href="books.html?genre=magical-realism" class="genre-pill magical-realism">${label}</a>`;
      }
      return `<span class="genre-pill magical-realism">${label}</span>`;
    }
    if (clickable) {
      return `<a href="books.html?genre=${encodeURIComponent(cls)}" class="genre-pill ${cls}">${label}</a>`;
    }
    return `<span class="genre-pill ${cls}">${label}</span>`;
  };
  let tags = [];
  if (bookOrEntry.mainGenre || bookOrEntry.genre) {
    tags.push(makePill(bookOrEntry.mainGenre || bookOrEntry.genre));
  }
  if (bookOrEntry.otherGenres) {
    bookOrEntry.otherGenres.split(',').forEach(g => {
      g = g.trim(); if (g) tags.push(makePill(g));
    });
  }
  return tags.join('');
}
// Build journal type pill — matches CSS class .entry-type-pill
function buildTypePill(entry) {
  const t = entry.type || 'THOUGHTS';
  const cls = getTypeClass(t);
  return `<a href="journal.html?type=${encodeURIComponent(cls)}" class="entry-type-pill ${cls}">${t.toUpperCase()}</a>`;
}
// --- Load Data ---
async function loadAllData() {
  try {
    const [siteRes, booksRes, journalRes, aboutRes] = await Promise.all([
      fetch('site.json').catch(() => ({ ok: false })),
      fetch('content/books.json'),
      fetch('content/journal.json'),
      fetch('content/about.json').catch(() => ({ ok: false }))
    ]);
    if (siteRes.ok) siteData = await siteRes.json();
    if (aboutRes.ok) aboutData = await aboutRes.json();
    const booksData = await booksRes.json();
    books = booksData.entries || [];
    const journalData = await journalRes.json();
    journalEntries = journalData.entries || [];
  } catch (err) { console.error('Error loading data:', err); }
}
// --- Render Profile ---
function renderProfile() {
  const titleEl = document.getElementById('siteTitle');
  const taglineEl = document.getElementById('siteTagline');
  if (titleEl && siteData.title) titleEl.textContent = siteData.title;
  if (taglineEl && siteData.tagline) taglineEl.textContent = siteData.tagline;
}
// --- Render Social Links ---
function renderSocialLinks(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const links = siteData.socialLinks || [];
  container.innerHTML = links.map(link =>
    `<a href="${link.url}" target="_blank" rel="noopener" class="social-link">${link.platform}</a>`
  ).join('');
}
// --- Render About ---
function renderAbout() {
  const introEl = document.getElementById('aboutIntro');
  const headingEl = document.getElementById('aboutHeading');
  const bioEl = document.getElementById('aboutBio');
  const signoffEl = document.getElementById('aboutSignoff');
  
  if (introEl && aboutData.introLine) introEl.textContent = aboutData.introLine;
  if (headingEl && aboutData.heading) headingEl.textContent = aboutData.heading;
  
  if (bioEl && aboutData.bioParagraphs) {
    const paragraphs = Array.isArray(aboutData.bioParagraphs) 
      ? aboutData.bioParagraphs 
      : [aboutData.bioParagraphs];
    bioEl.innerHTML = paragraphs.map(p => `<p>${parseRichText(p)}</p>`).join('');
  } else if (bioEl && aboutData.bio) {
    bioEl.innerHTML = `<p>${parseRichText(aboutData.bio)}</p>`;
  }
  
  if (signoffEl && aboutData.signoff) signoffEl.textContent = aboutData.signoff;
}
// --- Render Stats ---
function renderStats() {
  const bookCountEl = document.getElementById('statBooks');
  const genreCountEl = document.getElementById('statGenres');
  if (!books || books.length === 0) {
    if (bookCountEl) bookCountEl.textContent = '0';
    if (genreCountEl) genreCountEl.textContent = '0';
    return;
  }
  if (bookCountEl) bookCountEl.textContent = books.length;
  const allGenres = new Set();
  books.forEach(b => {
    if (b.mainGenre) allGenres.add(b.mainGenre.trim().toLowerCase());
    if (b.genre) allGenres.add(b.genre.trim().toLowerCase());
    if (b.otherGenres) b.otherGenres.split(',').forEach(g => {
      g = g.trim().toLowerCase(); if (g) allGenres.add(g);
    });
  });
  if (genreCountEl) genreCountEl.textContent = allGenres.size;
}
// --- Render Book Card ---
function renderBookCard(book, full = false) {
  const cover = book.coverImage
    ? `<img src="${book.coverImage}" alt="${book.title}" class="book-cover" loading="lazy" onerror="this.style.display='none';">`
    : `<div class="book-cover-placeholder">📖</div>`;
  
  const tags = buildGenreTags(book, !full);
  const stars = renderStars(book.rating || 0);
  
  const fmt = book.format 
    ? `<span class="book-format-label">Book Format:</span><span class="format-pill">${book.format.toUpperCase()}</span>` 
    : '';
  
  const startDate = book.startDate 
    ? `<span>Started: ${formatDateDisplay(book.startDate)}</span>` 
    : '';
  const endDate = book.date 
    ? `<span>Finished: ${formatDateDisplay(book.date)}</span>` 
    : '';
  const dateLine = (startDate || endDate) 
    ? `<div class="reading-dates">${startDate}${startDate && endDate ? ' · ' : ''}${endDate}</div>` 
    : '';
  
  const formatLine = fmt ? `<div class="book-format-line">${fmt}</div>` : '';
  
  let triggerHtml = '';
  if (book.triggerWarnings && book.triggerWarnings.trim()) {
    const warnings = book.triggerWarnings.split(',').map(w => w.trim()).filter(w => w);
    if (warnings.length > 0) {
      triggerHtml = `<div class="trigger-warnings">
        <div class="trigger-label">⚠ Trigger Warnings</div>
        <div class="trigger-list">${warnings.join(' · ')}</div>
      </div>`;
    }
  }
  
  let c = '';
  
  if (full) {
    c += `<a href="books.html" class="back-link-pill back-link-pill--top">← Back to Reviews</a>`;
    c += `<div class="single-book-container">`;
    c += `<div class="book-card"><div class="book-header">${cover}<div class="book-meta">
      <a href="book.html?id=${book.id}" class="book-title">${book.title}</a>
      <p class="book-author">by ${book.author}</p>
      <div class="book-rating">${stars}</div>
      <div class="book-genres">${tags}</div>
      ${dateLine}
      ${formatLine}
    </div></div>`;
    
    if (book.excerpt) c += `<p class="book-excerpt">${book.excerpt}</p>`;
    c += triggerHtml;
    if (book.fullReview) c += `<div class="review-content">${parseRichText(book.fullReview)}</div>`;
    
    c += `<div class="review-divider"></div>`;
    
    if (book.highlights && book.highlights.length) {
      c += `<div class="quotes-section"><h3>Quotes</h3><ul>`;
      book.highlights.forEach(h => { c += `<li>${h}</li>`; });
      c += `</ul></div>`;
    }
    if (book.verdict) c += `<div class="verdict-section"><h3>Verdict</h3><p>${book.verdict}</p></div>`;
    c += `</div>`;
    c += `<a href="books.html" class="back-link-pill back-link-pill--bottom">← Back to Reviews</a>`;
  } else {
    c += `<div class="book-card"><div class="book-header">${cover}<div class="book-meta">
      <a href="book.html?id=${book.id}" class="book-title">${book.title}</a>
      <p class="book-author">by ${book.author}</p>
      <div class="book-rating">${stars}</div>
      <div class="book-genres">${tags}</div>
      ${dateLine}
      ${formatLine}
    </div></div>`;
    
    if (book.excerpt) c += `<p class="book-excerpt">${book.excerpt}</p>`;
    c += `<a href="book.html?id=${book.id}" class="read-more">Read full review →</a>`;
    c += `</div>`;
  }
  
  return c;
}
// --- Render Journal Entry ---
function renderJournalEntry(e, full = false) {
  const iconSrc = iconMap[e.type] || '';
  const iconClass = full ? 'journal-icon-large' : 'journal-icon';
  const iconHtml = iconSrc 
    ? `<img src="${iconSrc}" alt="${e.type}" class="${iconClass}" loading="lazy" />` 
    : '';
  const typePill = buildTypePill(e);
  
  let c = '';
  
  if (full) {
    c += `<a href="journal.html" class="back-link-pill back-link-pill--top">← Back to Journal</a>`;
    c += `<div class="journal-entry-wrapper">`;
    c += `<div class="journal-entry">
      <div class="journal-card-header">
        ${iconHtml}
        <div>
          <h3 class="journal-title">${e.title}</h3>
          <p class="journal-date">${e.date ? formatDateDisplay(e.date) : ''}</p>
          <div class="journal-type-tag">${typePill}</div>
        </div>
      </div>
      <div class="review-content">${parseRichText(e.text)}</div>`;
    if (e.attribution) c += `<p class="journal-attribution">— ${e.attribution}</p>`;
    c += `</div>`;
    c += `</div>`;
    c += `<a href="journal.html" class="back-link-pill back-link-pill--bottom">← Back to Journal</a>`;
  } else {
    c += `<div class="journal-entry">
      <div class="journal-card-header">
        ${iconHtml}
        <div>
          <a href="journal-entry.html?id=${e.id}" class="journal-title">${e.title}</a>
          <p class="journal-date">${e.date ? formatDateDisplay(e.date) : ''}</p>
          <div class="journal-type-tag">${typePill}</div>
        </div>
      </div>`;
    const t = document.createElement('div');
    t.innerHTML = parseRichText(e.text);
    const txt = t.textContent || '';
    c += `<p class="journal-snippet">${txt.length > 220 ? txt.substring(0, 220) + '...' : txt}</p>`;
    c += `<a href="journal-entry.html?id=${e.id}" class="read-more">Continue reading →</a>`;
    c += `</div>`;
  }
  
  return c;
}
// --- Apply Filters from URL ---
function applyFiltersFromURL() {
  activeGenreFilter = getUrlParam('genre');
  activeTypeFilter = getUrlParam('type');
}
// --- Render Books List ---
function renderBooksList() {
  const container = document.getElementById('booksContainer');
  if (!container) return;
  applyFiltersFromURL();
  
  const filtered = activeGenreFilter
    ? books.filter(b => {
        const main = getGenreClass(b.mainGenre || b.genre || '');
        const others = (b.otherGenres || '').split(',').map(g => getGenreClass(g));
        return main === activeGenreFilter || others.includes(activeGenreFilter);
      })
    : books;
  
  if (filtered.length === 0) {
    container.innerHTML = '<p class="empty-state">No matching reviews ✨</p>';
    return;
  }
  
  container.className = 'books-grid';
  container.innerHTML = filtered.map(book => renderBookCard(book, false)).join('');
}
// --- ⭐ Auto-Update Featured Review ---
function renderFeaturedReview() {
  const featured = books.find(b => b.featured === true);
  const section = document.getElementById('featuredSection');
  
  if (!featured) {
    if (section) section.style.display = 'none';
    return;
  }
  
  if (section) section.style.display = 'block';
  
  const titleEl = document.getElementById('featuredTitle');
  if (titleEl) titleEl.textContent = featured.title || 'Untitled';
  
  const authorEl = document.getElementById('featuredAuthor');
  if (authorEl) authorEl.textContent = `by ${featured.author || 'Unknown Author'}`;
  
  const ratingEl = document.getElementById('featuredRating');
  if (ratingEl) {
    ratingEl.innerHTML = `${renderStars(featured.rating)} <span style="font-size:1rem; vertical-align:middle;">${parseFloat(featured.rating) || 0}/5</span>`;
  }
  
  const genresEl = document.getElementById('featuredGenres');
  if (genresEl) {
    let tags = '';
    const addTag = (g) => {
      const cls = getGenreClass(g);
      const isMagical = g.trim().toLowerCase() === 'magical realism';
      tags += `<a href="books.html?genre=${encodeURIComponent(cls)}" class="genre-pill ${isMagical ? 'magical-realism' : cls}">${g.trim()}</a>`;
    };
    if (featured.mainGenre) addTag(featured.mainGenre);
    if (featured.otherGenres) {
      const others = Array.isArray(featured.otherGenres) ? featured.otherGenres : String(featured.otherGenres).split(',');
      others.forEach(g => { if (g.trim()) addTag(g); });
    }
    genresEl.innerHTML = tags;
  }
  
  const excerptEl = document.getElementById('featuredExcerpt');
  if (excerptEl) excerptEl.textContent = featured.excerpt || 'No excerpt yet...';
  
  const btnEl = document.getElementById('featuredButton');
  if (btnEl) btnEl.href = `book.html?id=${featured.id}`;
  
  const imgEl = document.getElementById('featuredBookImg');
  if (imgEl && featured.coverImage) {
    imgEl.src = featured.coverImage;
    imgEl.alt = featured.title || '';
  }
}
// --- 🔍 Search ---
function initSearch() {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  if (!input || !results) return;
  
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.innerHTML = ''; results.style.display = 'none'; return; }
    const matches = books.filter(b =>
      (b.title && b.title.toLowerCase().includes(q)) ||
      (b.author && b.author.toLowerCase().includes(q)) ||
      (b.mainGenre && b.mainGenre.toLowerCase().includes(q))
    ).slice(0, 5);
    
    if (matches.length === 0) {
      results.innerHTML = '<p class="no-results">No matches found ✨</p>';
      results.style.display = 'block';
      return;
    }
    results.innerHTML = matches.map(b => `
      <a href="book.html?id=${b.id}" class="search-result-item">
        <span class="result-title">${b.title}</span>
        <span class="result-author">by ${b.author}</span>
      </a>
    `).join('');
    results.style.display = 'block';
  });
  
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !results.contains(e.target)) {
      results.style.display = 'none';
    }
  });
}
// --- Page Load ---
document.addEventListener('DOMContentLoaded', async () => {
  await loadAllData();
  
  renderProfile();
  renderSocialLinks('socialLinks');
  renderAbout();
  renderStats();
  renderFeaturedReview();
  
  // ✅ Latest Reviews — NEWEST FIRST (4 items)
  const latestReviewsContainer = document.getElementById('latestReviewsContainer');
  if (latestReviewsContainer) {
    const latest = books.slice().reverse().slice(0, 4);
    latestReviewsContainer.className = 'books-grid';
    latestReviewsContainer.innerHTML = latest.length === 0
      ? '<p class="empty-state">No reviews yet... your first book awaits ✨</p>'
      : latest.map(b => renderBookCard(b, false)).join('');
  }
  
  // ✅ Latest Journal — NEWEST FIRST (4 items)
  const latestJournalContainer = document.getElementById('latestJournalContainer');
  if (latestJournalContainer) {
    const latest = journalEntries.slice().reverse().slice(0, 4);
    latestJournalContainer.innerHTML = latest.length === 0
      ? '<p class="empty-state">No entries yet... thoughts coming soon 🌙</p>'
      : latest.map(e => renderJournalEntry(e, false)).join('');
  }
  
  // Books Page
  if (document.getElementById('booksContainer')) renderBooksList();
  
  // Journal Listing Page (journal.html)
  if (document.getElementById('journalContainer')) {
    applyFiltersFromURL();
    const filtered = activeTypeFilter
      ? journalEntries.filter(e => getTypeClass(e.type || 'THOUGHTS') === activeTypeFilter)
      : journalEntries;
    document.getElementById('journalContainer').innerHTML = filtered.length === 0
      ? '<p class="empty-state">No matching entries ✨</p>'
      : filtered.map(e => renderJournalEntry(e, false)).join('');
  }
  
  // Single Book Page
  const bookId = getUrlParam('id');
  if (bookId && books.length > 0) {
    const book = books.find(b => b.id === bookId);
    const container = document.getElementById('singleBook');
    if (book && container) {
      container.innerHTML = renderBookCard(book, true);
    }
  }
  
  // Single Journal Entry Page (journal-entry.html)
  const entryId = getUrlParam('id');
  if (entryId && journalEntries.length > 0 && document.getElementById('singleJournalEntry')) {
    const entry = journalEntries.find(e => e.id === entryId);
    const container = document.getElementById('singleJournalEntry');
    if (entry && container) {
      container.innerHTML = renderJournalEntry(entry, true);
    }
  }
  
  initSearch();
});
