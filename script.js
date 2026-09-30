// ==============================
// 🌙 MOONLIGHT BOOK READER — SCRIPT
// Preserved original functions + added: Featured Review, Search, Journal Icons (lazy loaded), 4 latest cards
// ==============================

// --- Icon Mapping ---
const iconMap = {
  'OBSERVATION': 'images/journal-icons/icon-observation.png',
  'OPINION': 'images/journal-icons/icon-opinion.png',
  'HOT TAKE': 'images/journal-icons/icon-hottake.png',
  'REFLECTION': 'images/journal-icons/icon-reflection.png',
  'QUOTE': 'images/journal-icons/icon-quote.png',
  'BOOK HAUL': 'images/journal-icons/icon-bookhaul.png',
  'RECOMMENDATION': 'images/journal-icons/icon-recommendation.png',
  'LIFE': 'images/journal-icons/icon-life.png'
};

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
  return '★'.repeat(full) + (half ? '☆' : '') + '✧'.repeat(empty);
}

// --- Rich Text Parser (ORIGINAL — preserved) ---
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

// --- State (ORIGINAL — preserved) ---
let siteData = {}, aboutData = {}, books = [], journalEntries = [];
let activeGenreFilter = null;

// --- Get URL Parameter Helper (ORIGINAL — preserved) ---
function getUrlParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// --- GENRE TAG HELPERS (ORIGINAL — preserved) ---
function getGenreClass(name) {
  if (!name) return 'custom-genre';
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\- ]/g, '')
    .replace(/\s+/g, '-');
}
function buildGenreTags(bookOrEntry) {
  let tags = [];
  if (bookOrEntry.mainGenre || bookOrEntry.genre) {
    const mainG = bookOrEntry.mainGenre || bookOrEntry.genre;
    tags.push(`<span class="genre-tag ${getGenreClass(mainG)}">${mainG.trim()}</span>`);
  }
  if (bookOrEntry.otherGenres) {
    bookOrEntry.otherGenres.split(',').forEach(g => {
      g = g.trim();
      if (g) tags.push(`<span class="genre-tag ${getGenreClass(g)}">${g}</span>`);
    });
  }
  return tags.join('');
}

// --- Load Data (ORIGINAL — preserved & extended) ---
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
  } catch (err) {
    console.error('Error loading data:', err);
  }
}

// --- Render Profile (ORIGINAL — preserved) ---
function renderProfile() {
  const titleEl = document.getElementById('siteTitle');
  const taglineEl = document.getElementById('siteTagline');
  if (titleEl && siteData.title) titleEl.textContent = siteData.title;
  if (taglineEl && siteData.tagline) taglineEl.textContent = siteData.tagline;
}

// --- Render Social Links (ORIGINAL — preserved) ---
function renderSocialLinks(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const links = siteData.socialLinks || [];
  container.innerHTML = links.map(link =>
    `<a href="${link.url}" target="_blank" rel="noopener" class="social-link">${link.platform}</a>`
  ).join('');
}

// --- Render About (ORIGINAL — preserved) ---
function renderAbout() {
  const bioEl = document.getElementById('aboutBio');
  if (bioEl && aboutData.bio) {
    bioEl.innerHTML = aboutData.bio;
  }
}

// --- Render Stats (ORIGINAL — preserved) ---
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
    if (b.otherGenres) {
      b.otherGenres.split(',').forEach(g => {
        g = g.trim().toLowerCase();
        if (g) allGenres.add(g);
      });
    }
  });
  
  if (genreCountEl) genreCountEl.textContent = allGenres.size;
}

// --- Render Book Card (ORIGINAL — preserved) ---
function renderBookCard(book, full = false) {
  const cover = book.coverImage
    ? `<img src="${book.coverImage}" alt="${book.title}" class="book-cover" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">`
      + `<div class="book-cover-placeholder" style="display:none;">📖</div>`
    : `<div class="book-cover-placeholder">📖</div>`;
  const tags = buildGenreTags(book);
  const stars = renderStars(book.rating || 0);
  
  const fmt = book.format 
    ? `<p class="book-format-line"><strong>Book Format:</strong> <span class="book-format">${book.format}</span></p>` 
    : '';
  const startDate = book.startDate 
    ? `<span class="reading-date">Started: ${formatDateDisplay(book.startDate)}</span>` 
    : '';
  const endDate = book.date 
    ? `<span class="reading-date">Finished: ${formatDateDisplay(book.date)}</span>` 
    : '';
  const dateLine = (startDate || endDate) 
    ? `<div class="reading-dates">${startDate}${startDate && endDate ? ' · ' : ''}${endDate}</div>` 
    : '';
  
  let c = `<div class="book-card"><div class="book-header">${cover}<div class="book-meta">
    <a href="book/${book.id}" class="book-title">${book.title}</a>
    <p class="book-author">by ${book.author}</p>
    <div class="book-rating">${stars}</div>
    <div class="book-tags">${tags}</div>
    ${fmt}
    ${dateLine}
  </div></div>`;
  
  if (full) {
    if (book.excerpt) c += `<p class="book-excerpt">${book.excerpt}</p>`;
    if (book.fullReview) c += `<div class="book-full-content">${parseRichText(book.fullReview)}</div>`;
    if (book.highlights && book.highlights.length) {
      c += `<ul class="book-highlights"><strong style="color:var(--accent);font-family:'Playfair Display',serif;font-style:italic;">Quotes</strong>`;
      book.highlights.forEach(h => { c += `<li>${h}</li>`; });
      c += `</ul>`;
    }
    if (book.verdict) c += `<p class="book-verdict"><strong style="color:var(--accent);">Verdict:</strong> ${book.verdict}</p>`;
  } else {
    if (book.excerpt) c += `<p class="book-excerpt">${book.excerpt}</p>`;
    c += `<a href="book/${book.id}" class="read-more">Read full review →</a>`;
  }
  return c + `</div>`;
}

// --- 📖 Render Journal Entry — UPDATED with Icons ---
function renderJournalEntry(e, full = false) {
  const iconSrc = iconMap[e.type] || '';
  const iconHtml = iconSrc 
    ? `<img src="${iconSrc}" alt="${e.type}" class="journal-icon ${full ? 'journal-icon-large' : ''}" loading="lazy" />` 
    : '';

  let c = `<div class="journal-entry ${full ? 'journal-entry-full' : ''}">`;
  
  if (full) {
    // Full entry layout — icon on left, aligned to text (your sketch)
    c += `<div class="journal-full-header">
      <div class="journal-icon-column">${iconHtml}</div>
      <div class="journal-meta-column">
        <span class="journal-type">${e.type || 'THOUGHTS'}</span>
        <h3 class="journal-title">${e.title}</h3>
        <p class="journal-date">${e.date ? formatDateDisplay(e.date) : ''}</p>
      </div>
    </div>`;
    c += `<div class="journal-content-full">${parseRichText(e.text)}</div>`;
    if (e.attribution) c += `<p class="journal-attribution">— ${e.attribution}</p>`;
  } else {
    // Homepage card — icon top-left (56px)
    c += `<div class="journal-card-header">
      ${iconHtml}
      <div>
        <span class="journal-type">${e.type || 'THOUGHTS'}</span>
        <a href="journal/${e.id}" class="journal-title">${e.title}</a>
        <p class="journal-date">${e.date ? formatDateDisplay(e.date) : ''}</p>
      </div>
    </div>`;
    const t = document.createElement('div');
    t.innerHTML = parseRichText(e.text);
    const txt = t.textContent || '';
    c += `<p class="journal-snippet">${txt.length > 220 ? txt.substring(0, 220) + '...' : txt}</p>`;
    c += `<a href="journal/${e.id}" class="read-more">Continue reading →</a>`;
  }
  return c + `</div>`;
}

// --- Render Books List (ORIGINAL — preserved) ---
function renderBooksList() {
  const container = document.getElementById('booksContainer');
  if (!container) return;
  const filtered = activeGenreFilter
    ? books.filter(b => getGenreClass(b.mainGenre || '') === activeGenreFilter)
    : books;
  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state">No reviews yet... your first book awaits ✨</div>';
    return;
  }
  container.innerHTML = filtered.map(book => renderBookCard(book, false)).join('');
}

// --- ⭐ Featured Review ---
function renderFeaturedReview() {
  const featured = books.find(b => b.featured === true);
  const section = document.getElementById('featuredSection');
  const container = document.getElementById('featuredContainer');
  if (!section || !container) return;

  if (!featured) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  container.innerHTML = `
    <div class="featured-book-wrap">
      <div class="featured-book-mockup">
        <img src="${featured.coverImage || 'images/placeholder-cover.jpg'}" 
             alt="${featured.title}" 
             loading="lazy"
             class="featured-cover" />
        <div class="book-spine-glow"></div>
        <div class="book-moon-decoration"></div>
      </div>
      <div class="featured-content">
        <span class="featured-tag">⭐ Featured Review</span>
        <h3 class="featured-title">${featured.title}</h3>
        <p class="featured-author">by ${featured.author}</p>
        <p class="featured-rating">${renderStars(featured.rating)} <span>${featured.rating}/5</span></p>
        <div class="featured-genres">
          <span class="genre-pill">${featured.mainGenre}</span>
          ${featured.otherGenres ? featured.otherGenres.split(',').map(g => `<span class="genre-pill">${g.trim()}</span>`).join('') : ''}
        </div>
        <p class="featured-excerpt">${featured.excerpt || ''}</p>
        <a href="book/${featured.id}" class="btn btn-primary">Read Full Review →</a>
      </div>
    </div>
  `;
}

// --- 🔍 Search Functionality ---
function initSearch() {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  if (!input || !results) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      results.innerHTML = '';
      results.style.display = 'none';
      return;
    }

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
      <a href="book/${b.id}" class="search-result-item">
        <span class="result-title">${b.title}</span>
        <span class="result-author">by ${b.author}</span>
      </a>
    `).join('');
    results.style.display = 'block';
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !results.contains(e.target)) {
      results.style.display = 'none';
    }
  });
}

// --- Starry Background Generator ✨ (ORIGINAL — preserved) ---
function generateStars(count = 80) {
  const container = document.querySelector('.stars-bg');
  if (!container) return;
  
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.classList.add('twinkle');
    star.style.setProperty('--dur', `${(Math.random() * 3) + 2}s`);
    star.style.setProperty('--delay', `${Math.random() * 4}s`);
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    container.appendChild(star);
  }
}
function addMoonDecorations(count = 6) {
  const container = document.querySelector('.stars-bg');
  if (!container) return;
  
  const moons = ['☾', '✧', '☽', '✦', '☆', '⁂'];
  for (let i = 0; i < count; i++) {
    const moon = document.createElement('div');
    moon.classList.add('moon-deco');
    moon.textContent = moons[Math.floor(Math.random() * moons.length)];
    moon.style.left = `${Math.random() * 90 + 5}%`;
    moon.style.top = `${Math.random() * 90 + 5}%`;
    container.appendChild(moon);
  }
}

// --- Page Load ---
document.addEventListener('DOMContentLoaded', async () => {
  await loadAllData();
  
  renderProfile();
  renderSocialLinks('socialLinks');
  renderAbout();
  renderStats();
  
  generateStars();
  addMoonDecorations();
  
  // Featured Review
  renderFeaturedReview();
  
  // Home page — latest reviews (4 cards)
  const latestReviewsContainer = document.getElementById('latestReviewsContainer');
  if (latestReviewsContainer) {
    const latest = books.slice(0, 4);
    if (latest.length === 0) {
      latestReviewsContainer.innerHTML = '<p class="empty-state">No reviews yet... your first book awaits ✨</p>';
    } else {
      latestReviewsContainer.innerHTML = latest.map(b => renderBookCard(b, false)).join('');
    }
  }
  
  // Home page — latest journal entries (3 cards with icons)
  const latestJournalContainer = document.getElementById('latestJournalContainer');
  if (latestJournalContainer) {
    const latest = journalEntries.slice(0, 3);
    if (latest.length === 0) {
      latestJournalContainer.innerHTML = '<p class="empty-state">No entries yet... thoughts coming soon 🌙</p>';
    } else {
      latestJournalContainer.innerHTML = latest.map(e => renderJournalEntry(e, false)).join('');
    }
  }
  
  // Books list page
  if (document.getElementById('booksContainer')) {
    renderBooksList();
  }
  
  // Journal list page
  if (document.getElementById('journalContainer')) {
    const container = document.getElementById('journalContainer');
    if (journalEntries.length === 0) {
      container.innerHTML = '<p class="empty-state">No entries yet... thoughts coming soon 🌙</p>';
    } else {
      container.innerHTML = journalEntries.map(e => renderJournalEntry(e, false)).join('');
    }
  }
  
  // Single book page
  const bookId = getUrlParam('id');
  if (bookId && books.length > 0) {
    const book = books.find(b => b.id === bookId);
    const container = document.getElementById('singleBook');
    if (book && container) {
      container.innerHTML = renderBookCard(book, true);
    } else if (container) {
      container.innerHTML = '<p class="empty-state">Book not found ✨</p>';
    }
  }
  
  // Single journal entry page — with larger icon layout
  const entryId = getUrlParam('id');
  if (entryId && journalEntries.length > 0) {
    const entry = journalEntries.find(e => e.id === entryId);
    const container = document.getElementById('singleJournalEntry');
    if (entry && container) {
      container.innerHTML = renderJournalEntry(entry, true);
    } else if (container) {
      container.innerHTML = '<p class="empty-state">Entry not found ✨</p>';
    }
  }
});
