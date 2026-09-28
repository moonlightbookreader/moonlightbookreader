# 🌙 Moonlight Book Reader

A cozy nocturnal reading journal website — book reviews, literary musings, and recommendations, all by lamplight.

Built with pure HTML/CSS/JavaScript + **Decap CMS** for easy content editing.

---

## ✨ Features

- 📚 **Book Reviews** with category filters, search, and detailed modal view
- 🌙 **Moonlit Musings** journal section for quotes, opinions, reflections
- 📖 **Reading Recommendations** — themed book lists
- 👤 **About section** with customizable profile and social links
- ✉️ **Newsletter signup** (stored locally in browser)
- ✨ **Animated starry background** with ambient moon decorations
- 🎨 **Warm midnight purple & gold aesthetic** with elegant typography
- ✍️ **Decap CMS admin panel** at `/admin` — write posts without touching code!

---

## 🚀 Quick Deploy (5 minutes)

### Option A: Deploy to Netlify (RECOMMENDED)

This is the easiest way and enables the CMS admin panel.

#### 1. Create a GitHub repository
- Go to https://github.com/new and create a new repository (name it something like `moonlight-book-reader`)
- Upload all these files to the repo

#### 2. Connect to Netlify
- Go to https://app.netlify.com and sign up/login
- Click **"Add new site"** → **"Import an existing project"**
- Connect your GitHub account and select your repository
- **Build settings:** leave everything as default (Netlify will detect it as a static site)
- Click **"Deploy site"**

#### 3. Enable Identity & Git Gateway (for the CMS admin panel)
- In your Netlify site dashboard, go to **Site configuration** → **Identity**
- Click **Enable Identity**
- Under **Registration**, choose **Invite only** (so only you can register)
- Under **Services**, click **Enable Git Gateway**
- Go to **Identity** → **Invite users** and send yourself an invitation

#### 4. Start writing!
- Go to `https://your-site.netlify.app/admin`
- Log in with the email you invited
- You'll see a clean dashboard with:
  - 📚 **Book Reviews** — add/edit reviews, upload covers
  - 🌙 **Moonlit Musings** — write journal entries
  - 📖 **Reading Recommendations** — manage book lists
  - ⚙️ **Site Settings** — profile pic, social links, about text

---

### Option B: Quick test (no CMS)

Just drag & drop the entire folder onto https://app.netlify.com/drop — you get a live site instantly, but the `/admin` CMS won't work until you set up Identity & Git Gateway as above.

---

## 📝 How to use the CMS

Once logged in at `/admin`:

### Adding a Book Review
1. Click **📚 Book Reviews** → **All Reviews** → **Edit**
2. Click **+ Add Books** at the bottom
3. Fill in: Title, Author, Category, Rating, Date
4. Upload a cover image (optional — beautiful gradient shows if blank)
5. Write your excerpt and full review
6. Add key highlights and your verdict
7. Click **Publish** → changes go live automatically!

### Adding a Journal Entry
1. Click **🌙 Moonlit Musings** → **All Journal Entries** → **Edit**
2. Click **+ Add Entries**
3. Choose the type (QUOTE, OPINION, OBSERVATION, HOT TAKE, REFLECTION)
4. Fill in the text and date
5. **Publish**!

---

## 📁 Project Structure

```
moonlight-book-reader/
├── index.html              # Main website
├── netlify.toml             # Netlify configuration
├── README.md                # This file
├── admin/
│   ├── index.html           # Decap CMS admin panel
│   └── config.yml           # CMS content schema
├── content/                 # All editable content (JSON files)
│   ├── books.json           # Book reviews
│   ├── journal.json         # Journal entries
│   ├── recommendations.json # Book recommendation lists
│   ├── about.json           # About section text
│   └── site.json            # Profile, name, social links
└── images/
    └── uploads/             # CMS-uploaded images go here
```

---

## 🎨 Customization Tips

### Colors & Fonts
The design uses CSS variables at the top of `index.html`. You can easily change:
- `--bg` — main background (deep purple `#150c2b`)
- `--accent` — gold highlights (`#d4a857`)
- `--text` — warm cream text (`#f5e6d3`)

### Hero Image
Replace the hero reading nook image URL in `index.html` (search for "Cozy night reading nook") with your own photo.

---

## 🛠️ Local Development

To preview locally:
```bash
cd moonlight-book-reader
python3 -m http.server 8000
# Then open http://localhost:8000
```

Note: The `/admin` CMS only works on a live Netlify deploy with Identity enabled.

---

## 💝 Made with

- Pure HTML, CSS, and JavaScript (no frameworks!)
- Tailwind CSS CDN
- Decap CMS (open-source content management)
- Google Fonts: Playfair Display, Lora, Caveat
- Lots of tea, moonlight, and love for books 🌙📚✨
