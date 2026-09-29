🌙 Moonlight Book Reader — Beautiful Multi-Page Website
========================================================

📁 FILE STRUCTURE
----------------
Root files (upload ALL of these to GitHub):
  .pages.yml        → Pages CMS configuration
  .nojekyll         → Required for GitHub Pages
  style.css         → ALL styles (cozy moonlit purple & gold theme)
  script.js         → ALL JavaScript (stars, data loading, rendering)
  index.html        → Home page (hero image, quote, stats, latest content)
  books.html        → All Book Reviews listing
  book.html         → Single book detail page (uses ?id= URL parameter)
  journal.html      → All Journal entries listing
  journal-entry.html → Single journal entry (uses ?id= URL parameter)
  about.html        → About page
  favicon.png       → Crescent moon browser tab icon

content/ folder (your editable content):
  content/site.json       → Your name, tagline, profile photo, social links
  content/about.json      → About page bio text
  content/books.json      → ALL your book reviews
  content/journal.json    → ALL your journal entries
  content/images/         → Auto-created when you upload first image

✨ DESIGN FEATURES
----------------
• Deep purple starry background with 85 twinkling stars ✨
• Two decorative moons (one drifting, one slowly spinning) 🌙
• Warm gold accent color (#d4a857) + silver-blue secondary
• Playfair Display (elegant serif titles) + Lora (body) + Caveat (handwritten)
• Hero reading nook image on home page
• Smooth hover animations, custom scrollbar, responsive design

🚀 HOW TO UPLOAD TO GITHUB PAGES
-------------------------------
1. Unzip this file
2. Go to your GitHub repo: moonlightbookreader
3. Delete ALL old files first (to avoid conflicts!)
4. Click "Add file" → "Upload files"
5. Drag and drop EVERYTHING from the unzipped folder:
   - All root files (.pages.yml, .nojekyll, style.css, script.js, all HTML, favicon.png)
   - The entire "content" folder
6. Scroll down → "Commit changes" ✅
7. Go to Settings → Pages → Source = Deploy from branch → main → / (root) → Save
8. Wait a few minutes → your site will be live at:
   https://moonlightbookreader.github.io/moonlightbookreader/

📝 HOW TO ADD CONTENT (via Pages CMS)
------------------------------------
1. Go to https://app.pagescms.org
2. Sign in with GitHub → select your repo
3. Four sections to edit:
   • Site Profile & Social  → name, tagline, profile pic, 17 social platforms
   • About Page            → bio paragraphs
   • Book Reviews          → click "+ Add item" for each review
   • Journal Entries       → click "+ Add item" for each entry

4. For Book Reviews:
   • "id" = simple slug like "midnight-library" (NO SPACES!)
   • Fill all fields → "Full Review" uses rich-text editor
   • Click the image icon 📷 in the editor to insert photos!
   • "Highlights" = click "Add item" for each bullet point

5. For Journal Entries:
   • "id" = simple slug like "rainy-sunday" (NO SPACES!)
   • "Content" = rich-text editor, insert images anywhere

✅ ALL FEATURES WORKING
----------------------
✓ Actual separate pages (Home, Reviews, Journal, About)
✓ Each review & entry has own shareable URL
✓ Dynamic stats on home page (auto-updates!)
✓ Format field: Physical / Audiobook / E-Book
✓ Images in reviews AND journal entries
✓ 17 social platforms (icons auto-appear when URL filled)
✓ Twinkling stars + moon decorations
✓ Cozy purple & gold literary theme

💛 Your cozy reading nook is ready! 🌙✨
