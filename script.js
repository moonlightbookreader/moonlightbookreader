function parseRichText(text) {
  if (!text) return '';

  let parsed = text;

  // Remove stray ++ markers
  parsed = parsed.replace(/\+\+/g, '');

  // Blockquotes: lines starting with >
  parsed = parsed.split('\n').map(line => {
    if (line.trim().startsWith('>')) {
      const content = line.trim().replace(/^>\s*/, '');
      return `<blockquote>${content}</blockquote>`;
    }
    return line;
  }).join('\n');

  // Convert ***bold italic*** → bold + italic
  parsed = parsed.replace(/\*\*\*([^*]+)\*\*\*/g, '<em><strong>$1</strong></em>');

  // Convert **bold** → bold
  parsed = parsed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Convert *italic* → italic
  parsed = parsed.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Convert [link text](url) → clickable link
  parsed = parsed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // Convert line breaks
  parsed = parsed.replace(/\n/g, '<br>');

  return parsed;
}

let siteData = {}, aboutData = {}, books = [], journalEntries = [];

// ─── Get URL Parameter Helper ───
function getUrlParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// ─── GENRE TAG HELPERS ───
let activeGenreFilter = null;

function getGenreClass(name) {
  if (!name) return 'genre-custom';
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\s+/g, '-');
}

function buildGenreTags(bookOrEntry) {
  let tags = [];

  // Primary genre
  if (bookOrEntry.mainGenre || bookOrEntry.genre) {
    const mainG = bookOrEntry.mainGenre || bookOrEntry.genre;
    tags.push(`<span class="genre-tag ${getGenreClass(mainG)}">${mainG.trim()}</span>`);
  }

  // Additional genres — ALSO as pills ✨
  if (bookOrEntry.otherGenres) {
    bookOrEntry.otherGenres.split(',').forEach(g => {
      g = g.trim();
      if (g) tags.push(`<span class="genre-tag ${getGenreClass(g)}">${g}</span>`);
    });
  }

  return tags.join('');
}

// ─── Load Data ───
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

// ─── Render Functions ───
function renderProfile() {
  const titleEl = document.getElementById('siteTitle');
  const taglineEl = document.getElementById('siteTagline');
  if (titleEl && siteData.title) titleEl.textContent = siteData.title;
  if (taglineEl && siteData.tagline) taglineEl.textContent = siteData.tagline;
}

function renderSocialLinks(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const links = siteData.socialLinks || [];
  container.innerHTML = links.map(link =>
    `<a href="${link.url}" target="_blank" rel="noopener" class="social-link">${link.platform}</a>`
  ).join('');
}

function renderAbout() {
  const bioEl = document.getElementById('aboutBio');
  if (bioEl && aboutData.bio) {
    bioEl.innerHTML = aboutData.bio;
  }
}

function renderStats() {
  const bookCountEl = document.getElementById('bookCount');
  const genreCountEl = document.getElementById('genreCount');
  if (bookCountEl) bookCountEl.textContent = books.length;
  if (genreCountEl) {
    const allGenres = new Set();
    books.forEach(b => {
      if (b.mainGenre) allGenres.add(b.mainGenre.trim().toLowerCase());
      if (b.otherGenres) b.otherGenres.split(',').forEach(g => allGenres.add(g.trim().toLowerCase()));
    });
    genreCountEl.textContent = allGenres.size;
  }
}

function renderBookCard(book, full = false) {
  const cover = book.coverImage
    ? `<img src="${book.coverImage}" alt="${book.title}" class="book-cover" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">`
      + `<div class="book-cover-placeholder" style="display:none;">📖</div>`
    : `<div class="book-cover-placeholder">📖</div>`;

  const tags = buildGenreTags(book);
  const stars = '★'.repeat(book.rating || 0) + '☆'.repeat(5 - (book.rating || 0));
  
  // Format line — on its own row
  const fmt = book.format 
    ? `<p class="book-format-line"><strong>Book Format:</strong> <span class="book-format">${book.format}</span></p>` 
    : '';

  // Dates — elegant display
  const startDate = book.startDate 
    ? `<span class="reading-date">Started: ${new Date(book.startDate).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}</span>` 
    : '';
  const endDate = book.date 
    ? `<span class="reading-date">Finished: ${new Date(book.date).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}</span>` 
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

function renderJournalEntry(e, full = false) {
  let c = `<div class="journal-entry">
    <span class="journal-type">${e.type || 'THOUGHTS'}</span>
    <a href="journal/${e.id}" class="journal-title">${e.title}</a>
    <p class="journal-date">${e.date || ''}</p>`;

  if (full) {
    c += `<div class="journal-content">${parseRichText(e.text)}</div>`;
    if (e.attribution) c += `<p class="journal-attribution">— ${e.attribution}</p>`;
  } else {
    const t = document.createElement('div');
    t.innerHTML = parseRichText(e.text);
    const txt = t.textContent || '';
    c += `<p style="color:var(--text-soft);margin-bottom:.5rem;">${txt.length > 220 ? txt.substring(0, 220) + '...' : txt}</p>`;
    c += `<a href="journal/${e.id}" class="read-more">Continue reading →</a>`;
  }

  return c + `</div>`;
}

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

// ─── Page Load ───
document.addEventListener('DOMContentLoaded', async () => {
  await loadAllData();

  renderProfile();
  renderSocialLinks('socialLinks');
  renderAbout();
  renderStats();

  // Home page — show latest reviews
  const latestReviewsContainer = document.getElementById('latestReviewsContainer');
  if (latestReviewsContainer) {
    const latest = books.slice(0, 3);
    if (latest.length === 0) {
      latestReviewsContainer.innerHTML = '<p class="empty-state">No reviews yet... your first book awaits ✨</p>';
    } else {
      latestReviewsContainer.innerHTML = latest.map(b => renderBookCard(b, false)).join('');
    }
  }

  // Home page — show latest journal entries
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

  // Single journal entry page
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
