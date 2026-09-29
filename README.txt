🌙 Moonlight Book Reader — Beautiful Multi-Page Website
========================================================

📁 WHAT'S INSIDE
----------------
Root files (upload ALL to GitHub):
  .pages.yml        → Pages CMS config (FIXED YAML syntax!)
  .nojekyll         → Required for GitHub Pages
  style.css         → WIDER layout (1100px max), cozy moonlit theme
  script.js         → Stars, moons, data loading, all rendering
  index.html        → Home (hero image, quote, stats, latest content)
  books.html        → All Book Reviews
  book.html         → Single book detail (?id= parameter)
  journal.html      → All Journal entries
  journal-entry.html → Single journal entry (?id= parameter)
  about.html        → About page
  favicon.png       → Crescent moon tab icon

content/ folder:
  content/site.json       → Name, tagline, profile, 17 social links
  content/about.json      → About page bio
  content/books.json      → All book reviews
  content/journal.json    → All journal entries
  content/images/         → Auto-created on first image upload

🎨 DESIGN FIXES IN THIS VERSION
-------------------------------
• WIDER layout: max-width 1100px (fills browser much better)
• Hero grid: 1fr : 1.1fr (image gets more space)
• "currently reading..." sticker: fixed positioning, no longer cut off
• .pages.yml: simplified descriptions, no special characters that break YAML
• All fonts: Playfair Display + Lora + Caveat
• 85 twinkling stars + 2 decorative moons
• Deep purple (#150c2b) + warm gold (#d4a857) theme

🚀 UPLOAD INSTRUCTIONS
----------------------
1. Delete ALL old files from your GitHub repo first
2. Unzip this file → open moonlight-book-reader-v3/
3. GitHub → Add file → Upload files
4. Drag EVERYTHING from inside the folder (all root files + content folder)
5. Commit changes ✅
6. Settings → Pages → Source: Deploy from branch, Branch: main / (root) → Save
7. Wait 2-5 minutes → visit: https://moonlightbookreader.github.io/moonlightbookreader/

📝 PAGES CMS
------------
Go to app.pagescms.org — the .pages.yml should now work perfectly!
If it still says "unreadable", just refresh the CMS page after your files are committed.

💛 Your cozy reading nook is ready! 🌙📚✨
