// === STAR RATING DISPLAY ===
function renderStars(rating) {
  const full = Math.floor(rating);
  const empty = 5 - full;
  return '<span class="star-filled">★</span>'.repeat(full) + '<span class="star-empty">★</span>'.repeat(empty);
}

// === EXTRACT ALL GENRES (standard + custom) ===
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

// === RENDER BOOK REVIEW CARD ===
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

// === RENDER JOURNAL ENTRY CARD ===
function renderJournalCard(entry) {
  return `
    <article class="journal-card" data-type="${entry.type}">
      <span class="entry-type-badge type-${entry.type.replace(/\s+/g, '-').toLowerCase()}">${entry.type}</span>
      <h3 class="entry-title">${entry.title}</h3>
      <p class="entry-date">${new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <div class="entry-preview">${entry.text.substring(0, 200)}...</div>
      <a href="journal-entry.html?id=${entry.id}" class="read-entry-btn">Read More →</a>
    </article>
  `;
}

// === GENRE FILTERING ===
function setupGenreFilter() {
  const container = document.getElementById('reviews-container');
  if (!container) return;

  let allReviews = [];
  
  fetch('content/books.json')
    .then(res => res.json())
    .then(data => {
      allReviews = data.entries || [];
      renderFilteredReviews('all');
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

// === JOURNAL TYPE FILTERING ===
function setupJournalFilter() {
  const container = document.getElementById('journal-container');
  if (!container) return;

  let allEntries = [];
  
  fetch('content/journal.json')
    .then(res => res.json())
    .then(data => {
      allEntries = data.entries || [];
      renderFilteredEntries('all');
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

// === PAGE DETECTION ===
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('reviews-container')) setupGenreFilter();
  if (document.getElementById('journal-container')) setupJournalFilter();
});
