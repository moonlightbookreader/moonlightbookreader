🌙 Moonlight Book Reader — Complete Website Package
====================================================

📁 WHAT'S IN THIS PACKAGE
------------------------
Root files:
  .pages.yml        → Pages CMS configuration (dashboard)
  .nojekyll         → Tells GitHub Pages to serve all files correctly
  style.css         → All shared styles (cozy moon theme)
  script.js         → All shared JavaScript (loading, rendering, icons)
  index.html        → Home page (profile, stats, latest content)
  books.html        → All Book Reviews listing page
  book.html         → Single book detail page (uses ?id= URL parameter)
  journal.html      → All Journal Entries listing page
  journal-entry.html → Single journal entry page (uses ?id= URL parameter)
  about.html        → About page
  favicon.png       → Crescent moon browser tab icon (replace with your own!)

content/ folder (your editable content):
  content/site.json       → Your name, tagline, profile photo, ALL social links
  content/about.json      → About page text
  content/books.json      → ALL your book reviews
  content/journal.json    → ALL your journal entries
  content/images/         → Folder for all your uploaded images

🚀 HOW TO UPLOAD TO GITHUB
--------------------------
1. Unzip this file on your computer
2. Go to your GitHub repository (moonlight-book-reader)
3. Click "Add file" → "Upload files"
4. Drag and drop ALL files and folders from the unzipped package
   (including .pages.yml, .nojekyll, style.css, script.js, all HTML files, 
   the content/ folder, etc.)
5. Scroll down → click "Commit changes" ✅

⚠️ IMPORTANT: Replace favicon.png with your own preferred icon!

📝 HOW TO ADD CONTENT (via Pages CMS)
------------------------------------
1. Go to https://app.pagescms.org
2. Sign in with GitHub → select your repo
3. You'll see 4 sections:
   - Site Profile & Social  → Edit your name, tagline, profile pic, social links
   - About Page            → Edit your bio
   - Book Reviews          → Click "+ Add item" to add a new review
   - Journal Entries       → Click "+ Add item" to add a journal entry

4. For Book Reviews:
   - "id" = simple slug like "midnight-library" (no spaces, used in URL)
   - Fill in title, author, category, format, rating, date...
   - "Full Review" uses rich-text editor — click the image icon to insert photos!
   - "Highlights" = click "Add item" for each highlight point

5. For Journal Entries:
   - "id" = simple slug like "rainy-sunday-reading"
   - "Content" uses rich-text editor — insert images anywhere!

✨ FEATURES
----------
✅ Actual separate pages (Home, Reviews, Journal, About)
✅ Each review & entry has its own shareable URL
✅ Dynamic stats on home page (auto-updates with each new book)
✅ Format field: Physical / Audiobook / E-Book
✅ Images in reviews AND journal entries (rich-text editor)
✅ 17 social platforms with auto-appearing icons
✅ Cozy moonlit purple & gold theme

🔗 HOW IT WORKS
--------------
- Pages CMS edits the JSON files in content/
- The HTML pages load those JSON files and display them beautifully
- Layout (HTML/CSS/JS) is separate from content (JSON)
- You can change layout anytime without touching your reviews!

💛 Need help? You've got this! Your cozy reading nook is ready. 🌙✨
