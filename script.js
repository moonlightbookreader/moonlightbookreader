// ==============================
// 🌙 MOONLIGHT BOOK READER — SCRIPT
// Matches CSS exactly · Correct paths · Pills show properly
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

// --- Helper: Generate Stars ---
function renderStars(rating) {
  const full = Math.floor(rating || 0);
  const half = (rating || 0) % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
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
  const bioEl = document.getElementById('aboutBio');
  if (bioEl && aboutData.bio) bioEl.innerHTML = aboutData.bio;
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
    ? `<span class="format-pill">${book.format.toUpperCase()}</span>` 
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
  
  let c = `<div class="book-card"><div class="book-header">${cover}<div class="book-meta">
    <a href="book.html?id=${book.id}" class="book-title">${book.title}</a>
    <p class="book-author">by ${book.author} ${fmt}</p>
    <div class="book-rating">${stars}</div>
    <div class="book-genres">${tags}</div>
    ${dateLine}
  </div></div>`;
  
  if (full) {
    if (book.excerpt) c += `<p class="book-excerpt">${book.excerpt}</p>`;
    if (book.fullReview) c += `<div class="review-content">${parseRichText(book.fullReview)}</div>`;
    if (book.highlights && book.highlights.length) {
      c += `<div class="quotes-section"><h3>Quotes</h3><ul>`;
      book.highlights.forEach(h => { c += `<li>${h}</li>`; });
      c += `</ul></div>`;
    }
    if (book.verdict) c += `<div class="verdict-section"><h3>Verdict</h3><p>${book.verdict}</p></div>`;
    c += `<a href="books.html" class="back-link-pill">← Back to Reviews</a>`;
  } else {
    if (book.excerpt) c += `<p class="book-excerpt">${book.excerpt}</p>`;
    c += `<a href="book.html?id=${book.id}" class="read-more">Read full review →</a>`;
  }
  return c + `</div>`;
}

// --- Render Journal Entry — matches CSS classes exactly ---
function renderJournalEntry(e, full = false) {
  const iconSrc = iconMap[e.type] || '';
  const iconHtml = iconSrc 
    ? `<img src="${iconSrc}" alt="${e.type}" class="journal-icon" loading="lazy" />` 
    : '';
  const typePill = buildTypePill(e);
  
  let c = `<div class="journal-entry">`;
  
  if (full) {
    c += `<div class="journal-card-header">
      ${iconHtml}
      <div>
        <h3 class="journal-title">${e.title}</h3>
        <p class="journal-date">${e.date ? formatDateDisplay(e.date) : ''}</p>
        <div class="journal-type-tag">${typePill}</div>
      </div>
    </div>`;
    c += `<div class="review-content">${parseRichText(e.text)}</div>`;
    if (e.attribution) c += `<p class="journal-attribution">— ${e.attribution}</p>`;
    c += `<a href="journal.html" class="back-link-pill">← Back to Journal</a>`;
  } else {
    c += `<div class="journal-card-header">
      ${iconHtml}
      <div>
        <a href="journal.html?id=${e.id}" class="journal-title">${e.title}</a>
        <p class="journal-date">${e.date ? formatDateDisplay(e.date) : ''}</p>
        <div class="journal-type-tag">${typePill}</div>
      </div>
    </div>`;
    const t = document.createElement('div');
    t.innerHTML = parseRichText(e.text);
    const txt = t.textContent || '';
    c += `<p class="journal-snippet">${txt.length > 220 ? txt.substring(0, 220) + '...' : txt}</p>`;
    c += `<a href="journal.html?id=${e.id}" class="read-more">Continue reading →</a>`;
  }
  return c + `</div>`;
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
  container.innerHTML = filtered.map(book => renderBookCard(book, false)).join('');
}

// --- ⭐ Featured Review — matches index.html structure exactly ---
function renderFeaturedReview() {
  const featured = books.find(b => b.featured === true);
  const container = document.getElementById('featuredContainer');
  if (!container) return;
  
  if (!featured) { container.innerHTML = ''; return; }
  
  const genrePills = [];
  const makePill = (g) => {
    const cls = getGenreClass(g);
    const label = g.trim();
    if (label.toLowerCase() === 'magical realism') {
      return `<a href="books.html?genre=magical-realism" class="genre-pill magical-realism">${label}</a>`;
    }
    return `<a href="books.html?genre=${encodeURIComponent(cls)}" class="genre-pill">${label}</a>`;
  };
  if (featured.mainGenre) genrePills.push(makePill(featured.mainGenre));
  if (featured.otherGenres) {
    featured.otherGenres.split(',').forEach(g => { g = g.trim(); if (g) genrePills.push(makePill(g)); });
  }
  
  // ✅ CORRECT IMAGE PATH — uses YOUR filename
  const coverSrc = featured.coverImage || 'content/images/midnight-library.jpg';
  
  container.innerHTML = `
    <div class="featured-book-wrap">
      <div class="featured-content">
        <span class="featured-tag">⭐ Featured Review</span>
        <h3 class="featured-title">${featured.title}</h3>
        <p class="featured-author">by ${featured.author}</p>
        <div class="featured-rating">
          ${renderStars(featured.rating)}
          <span>${featured.rating || '0'}/5</span>
        </div>
        <div class="featured-genres">${genrePills.join('')}</div>
        <p class="featured-excerpt">${featured.excerpt || ''}</p>
        <a href="book.html?id=${featured.id}" class="btn btn-primary featured-btn">Read Full Review →</a>
      </div>
      <div class="book-frame-wrapper">
        <div class="golden-ornate-frame"></div>
        <img 
          src="${coverSrc}" 
          alt="${featured.title}" 
          class="featured-book-3d"
          loading="lazy"
          onerror="this.style.display='none';this.previousElementSibling.style.background='linear-gradient(135deg, #2a1a52, #1e1240)'"
        />
      </div>
    </div>
  `;
    // ✨ Hover effect — re-attached after every render
  const wrapper = document.getElementById('featuredFrameWrapper');
  const book = document.getElementById('featuredBookImg');
  const overlay = document.getElementById('featuredOverlay');
  
  if (wrapper && book) {
    wrapper.addEventListener('mouseenter', function() {
      book.style.transform = 'perspective(900px) rotateY(-8deg) rotateX(2deg) translateZ(25px) scale(1.04)';
      book.style.boxShadow = 'inset 15px 0 20px -10px rgba(255,255,255,0.18), inset -12px 0 25px -8px rgba(0,0,0,0.6), -25px 20px 50px rgba(0,0,0,0.55), 0 15px 35px rgba(0,0,0,0.4), 8px 0 20px rgba(0,0,0,0.25)';
      if (overlay) overlay.style.filter = 'drop-shadow(0 0 20px rgba(255,223,100,0.6)) drop-shadow(0 0 35px rgba(255,215,0,0.35))';
    });
    
    wrapper.addEventListener('mouseleave', function() {
      book.style.transform = 'perspective(900px) rotateY(-14deg) rotateX(5deg) translateZ(10px)';
      book.style.boxShadow = 'inset 15px 0 20px -10px rgba(255,255,255,0.15), inset -12px 0 25px -8px rgba(0,0,0,0.6), -20px 15px 40px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.35)';
      if (overlay) overlay.style.filter = 'drop-shadow(0 0 10px rgba(255,215,0,0.25))';
    });
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
  
  // Latest Reviews
  const latestReviewsContainer = document.getElementById('latestReviewsContainer');
  if (latestReviewsContainer) {
    const latest = books.slice(0, 4);
    latestReviewsContainer.innerHTML = latest.length === 0
      ? '<p class="empty-state">No reviews yet... your first book awaits ✨</p>'
      : latest.map(b => renderBookCard(b, false)).join('');
  }
  
  // Latest Journal
  const latestJournalContainer = document.getElementById('latestJournalContainer');
  if (latestJournalContainer) {
    const latest = journalEntries.slice(0, 4);
    latestJournalContainer.innerHTML = latest.length === 0
      ? '<p class="empty-state">No entries yet... thoughts coming soon 🌙</p>'
      : latest.map(e => renderJournalEntry(e, false)).join('');
  }
  
  // Books Page
  if (document.getElementById('booksContainer')) renderBooksList();
  
  // Journal Page with type filter
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
  
  // Single Journal Page
  const entryId = getUrlParam('id');
  if (entryId && journalEntries.length > 0) {
    const entry = journalEntries.find(e => e.id === entryId);
    const container = document.getElementById('singleJournalEntry');
    if (entry && container) {
      container.innerHTML = renderJournalEntry(entry, true);
    }
  }
  
  initSearch();
});

// ⭐ Auto-Update Featured Review — preserves ALL styling ✨
function renderFeaturedReview() {
  const featured = books.find(b => b.featured === true);
  const section = document.getElementById('featuredSection');
  
  if (!featured) {
    if (section) section.style.display = 'none';
    return;
  }
  
  if (section) section.style.display = 'block';
  
  // Title
  const titleEl = document.getElementById('featuredTitle');
  if (titleEl) titleEl.textContent = featured.title || 'Untitled';
  
  // Author
  const authorEl = document.getElementById('featuredAuthor');
  if (authorEl) authorEl.textContent = `by ${featured.author || 'Unknown Author'}`;
  
  // Rating with half-star support ✨
  const ratingEl = document.getElementById('featuredRating');
  if (ratingEl) {
    const r = parseFloat(featured.rating) || 0;
    const full = Math.floor(r);
    const half = (r % 1) >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    ratingEl.innerHTML = `${'★'.repeat(full)}${half ? '⯨' : ''}${'☆'.repeat(empty)} ${r}/5`;
  }
  
  // Genres
  const genresEl = document.getElementById('featuredGenres');
  if (genresEl) {
    let tags = '';
    const addTag = (g) => {
      const cls = g.trim().toLowerCase().replace(/[^a-z0-9\- ]/g, '').replace(/\s+/g, '-');
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
  
  // Excerpt
  const excerptEl = document.getElementById('featuredExcerpt');
  if (excerptEl) excerptEl.textContent = featured.excerpt || 'No excerpt yet...';
  
  // Button link
  const btnEl = document.getElementById('featuredButton');
  if (btnEl) btnEl.href = `book.html?id=${featured.id}`;
  
  // Book cover image
  const imgEl = document.getElementById('featuredBookImg');
  if (imgEl && featured.coverImage) {
    imgEl.src = featured.coverImage;
    imgEl.alt = featured.title || '';
  }
}
