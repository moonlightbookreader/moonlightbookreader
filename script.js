// === Star Rating Display ===
function renderStars(rating) {
  const full = Math.floor(rating || 0);
  const empty = 5 - full;
  return '<span class="star-filled">★</span>'.repeat(full) + '<span class="star-empty">★</span>'.repeat(empty);
}

// === Get All Genres (standard + custom) ===
function getAllGenres(entry) {
  let genres = [];
  if (entry.category && Array.isArray(entry.category)) {
    genres = genres.concat(entry.category);
  }
  if (entry.customGenres) {
    const custom = entry.customGenres.split(',').map(g => g.trim()).filter(g => g);
    genres = genres.concat(custom);
  }
  return genres;
}

// === Render Book Card ===
function renderReviewCard(entry) {
  const genres = getAllGenres(entry);
  const genreTags = genres.map(g => `<span class="genre-tag">${g}</span>`).join('');
  
  return `
    <article class="book-card" data-genres='${JSON.stringify(genres)}'>
      ${entry.coverImage ? `<img src="${entry.coverImage}" alt="${entry.title} cover" class="book-cover">` : ''}
      <div class="book-info">
        <h3 class="book-title">${entry.title}</h3>
        <p class="book-author">by ${entry.author}</p>
        <div class="rating-stars">${renderStars(entry.rating)}</div>
        <p class="book-format">${entry.format || 'Physical'}</p>
        <div class="genre-tags">${genreTags}</div>
        ${entry.excerpt ? `<p class="book-excerpt">${entry.excerpt}</p>` : ''}
        <a href="book.html?id=${entry.id}" class="read-review-btn">Read Full Review →</a>
      </div>
    </article>
  `;
}

// === Render Journal Card ===
function renderJournalCard(entry) {
  const typeClass = (entry.type || '').toLowerCase().replace(/\s+/g, '-');
  return `
    <article class="journal-card" data-type="${entry.type || ''}">
      <span class="entry-type-badge type-${typeClass}">${entry.type || 'GENERAL'}</span>
      <h3 class="entry-title">${entry.title}</h3>
      <p class="entry-date">${entry.date ? new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
      <div class="entry-preview">${(entry.text || '').substring(0, 200)}...</div>
      <a href="journal-entry.html?id=${entry.id}" class="read-entry-btn">Read More →</a>
    </article>
  `;
}

// === Update Stats on Homepage ===
function updateStats() {
  Promise.all([
    fetch('content/books.json').then(r => r.json()).catch(() => ({ entries: [] })),
    fetch('content/journal.json').then(r => r.json()).catch(() => ({ entries: [] }))
  ]).then(([booksData, journalData]) => {
    const books = booksData.entries || [];
    const allGenres = new Set();
    books.forEach(book => {
      getAllGenres(book).forEach(g => allGenres.add(g));
    });
    
    const statBooks = document.getElementById('stat-books');
    const statGenres = document.getElementById('stat-genres');
    
    if (statBooks) statBooks.textContent = books.length;
    if (statGenres) statGenres.textContent = allGenres.size;
  });
}

// === Genre Filtering ===
function setupGenreFilter() {
  const container = document.getElementById('reviews-container');
  if (!container) return;

  let allReviews = [];
  
  fetch('content/books.json')
    .then(res => res.json())
    .then(data => {
      allReviews = data.entries || [];
      renderFilteredReviews('all');
    })
    .catch(() => {
      container.innerHTML = '<p class="empty-state">No reviews yet... your first book awaits ✨</p>';
    });

  function renderFilteredReviews(selectedFilter) {
    const filtered = selectedFilter === 'all' 
      ? allReviews 
      : allReviews.filter(entry => getAllGenres(entry).includes(selectedFilter));
    
    container.innerHTML = filtered.length 
      ? filtered.map(renderReviewCard).join('')
      : '<p class="empty-state">No reviews found in this genre yet... more coming soon 🌙</p>';
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderFilteredReviews(btn.dataset.filter);
    });
  });
}

// === Journal Type Filtering ===
function setupJournalFilter() {
  const container = document.getElementById('journal-container');
  if (!container) return;

  let allEntries = [];
  
  fetch('content/journal.json')
    .then(res => res.json())
    .then(data => {
      allEntries = data.entries || [];
      renderFilteredEntries('all');
    })
    .catch(() => {
      container.innerHTML = '<p class="empty-state">No entries yet... thoughts coming soon 🌙</p>';
    });

  function renderFilteredEntries(selectedType) {
    const filtered = selectedType === 'all' 
      ? allEntries 
      : allEntries.filter(entry => entry.type === selectedType);
    
    container.innerHTML = filtered.length 
      ? filtered.map(renderJournalCard).join('')
      : '<p class="empty-state">No entries yet... thoughts coming soon 🌙</p>';
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderFilteredEntries(btn.dataset.filter);
    });
  });
}

// === Initialize ===
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('stat-books')) updateStats();
  if (document.getElementById('reviews-container')) setupGenreFilter();
  if (document.getElementById('journal-container')) setupJournalFilter();
});
