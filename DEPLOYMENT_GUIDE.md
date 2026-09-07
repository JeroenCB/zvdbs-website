# ZVDBS Website - Complete Deployment Guide

## ✅ What's Ready

Your complete website is built with:

- **Homepage** with hero, latest news, training schedule, CTAs
- **All 35 WordPress pages** migrated to clean URLs:
  - `/membership` - Lidmaatschap (Priority #1)
  - `/about` - Wie zijn wij? (Priority #2)
  - `/policies` - Preventief beleid (Priority #3)
  - `/contact` - Contact (Priority #4)
  - `/news` - News listing
  - `/news/[slug]` - Individual news articles
  - `/statistieken` - Statistics
  - And 27 more pages in footer navigation
- **All 11 news articles (2025+)** imported from WordPress
- **Admin panel for moderators** at `/admin/news`
  - Add new articles with title, excerpt, content, author
  - Edit existing articles
  - Delete articles
  - Articles appear immediately on the website
- **Modern design** with Tailwind CSS
- **Navigation** showing priority pages in header

---

## 🚀 Deploy to Vercel (3 steps)

### Step 1: Push to GitHub

From your local machine (Windows Command Prompt or PowerShell):

```bash
cd C:\path\to\zvdbs-website

# Stage all changes
git add .

# Commit
git commit -m "Complete website rebuild with all pages and admin panel"

# Push to GitHub
git push -u origin main --force
```

**Expected output:**
```
✓ main > origin/main
```

### Step 2: Vercel Auto-Deploys

- Vercel automatically detects the push
- Build runs (takes ~2-3 minutes)
- Website updates at: **https://zvdbs-website.vercel.app**

No additional steps needed! ✓

### Step 3: Point zvdbs.nl Domain

Once deployed and tested:

1. Go to https://vercel.com/dashboard
2. Click on `zvdbs-website` project
3. Go to **Settings** → **Domains**
4. Add `zvdbs.nl`
5. Update your domain registrar's nameservers to Vercel's (instructions on the page)

---

## 📝 Moderator: How to Add News Articles

### Access the Admin Panel

1. Go to: **https://zvdbs-website.vercel.app/admin/news**
2. You'll see a form to add articles

### Adding a New Article

1. **Titel** - Enter the article title
   - Example: "Landelijke Competitie deel 5!"
   - The slug is automatically generated

2. **Samenvatting** - Short summary (appears in news list)
   - Example: "Spannende dag in Tiel met mooie resultaten!"

3. **Inhoud** - Full article content
   - You can use HTML: `<p>`, `<strong>`, `<img>`, `<h2>`, etc.
   - Or just plain text

4. **Auteur** - Your name
   - Example: "Rosanne Diepeveen"

5. Click **Artikel publiceren**

✓ **Article appears immediately** on the website!

### Editing an Article

1. Find it in "Recente artikelen" list on the right
2. Click **Bewerk**
3. Make changes
4. Click **Artikel bijwerken**

### Deleting an Article

1. Find it in "Recente artikelen" list
2. Click **Verwijder**
3. Confirm

---

## 🌐 URLs and Navigation

**Main Pages:**
- `/` - Homepage
- `/membership` - Become a member
- `/about` - About the club
- `/policies` - Club policies
- `/news` - All news articles
- `/contact` - Contact form
- `/statistieken` - Competition statistics

**Admin:**
- `/admin/news` - Moderator news management

---

## 📊 What's in the News Data

The website has 11 news articles imported from WordPress (2025-2026):

1. Landelijke Competitie deel 4! — 2026-03-19
2. Verslag Landelijke Competitie Deel 3, Ede — 2026-02-18
3. 400 — 2026-02-10
4. DBS Nachtzwemmarathon voor Serious Request — 2025-12-22
5. DBS op stoom(boot) — 2025-11-23
6. Landelijke Competitie Deel 1 – 4 oktober 2025 — 2025-10-10
7. Het DBS Onderwaterparadijs en de Gouden Zeester! — 2025-07-18
8. Verslag NZC Deel 5 — 2025-04-07
9. Verslag Landelijke Competitie deel 4 in Ede — 2025-03-10
10. Winterse taferelen bij de landelijke competitie deel 3 — 2025-02-04
11. Verslag landelijk competitie 11 januari 2025 Tiel — 2025-01-14

All visible at `/news` or individually at `/news/[slug]`

---

## 📁 Project Structure

```
zvdbs-website/
├── src/app/
│   ├── page.tsx              ← Homepage
│   ├── membership/page.tsx    ← Lidmaatschap
│   ├── about/page.tsx         ← Over ons
│   ├── policies/page.tsx      ← Beleid
│   ├── contact/page.tsx       ← Contact form
│   ├── news/
│   │   ├── page.tsx           ← News listing
│   │   └── [slug]/page.tsx    ← Individual articles
│   ├── admin/news/page.tsx    ← Admin panel
│   ├── api/news/
│   │   ├── route.ts           ← GET/POST API
│   │   └── [id]/route.ts      ← DELETE API
│   └── components/
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── NewsCard.tsx
│       └── InfoCard.tsx
├── public/data/
│   ├── pages.json             ← All 35 pages
│   └── news.json              ← All 11 articles
└── package.json
```

---

## 🔧 Changes Made

- ✅ Removed Payload CMS files (payload.config.ts, src/collections/)
- ✅ Extracted all 35 pages from WordPress XML
- ✅ Extracted all 11 news articles (2025+)
- ✅ Created dynamic page routes
- ✅ Built admin panel for moderators
- ✅ Updated navigation with priority pages
- ✅ Created API routes for news management
- ✅ Updated homepage with hero, news, training schedule
- ✅ Fixed NewsCard links to use `/news` instead of `/nieuws`
- ✅ Created complete data JSON files

---

## ⚠️ If Something Goes Wrong

### Build fails on Vercel

- Check that `payload.config.ts` doesn't exist (it should be deleted)
- Check that `src/collections/` doesn't exist
- These old Payload CMS files break the build

### News articles don't appear

- Make sure `/public/data/news.json` exists
- Check Vercel build logs
- Try re-deploying

### Admin panel shows error

- Make sure you're at `/admin/news` (not `/admin`)
- Clear browser cache
- Try in a new incognito window

---

## 📞 Quick Reference

| Task | URL |
|------|-----|
| View website | https://zvdbs-website.vercel.app |
| Add news | https://zvdbs-website.vercel.app/admin/news |
| View news | https://zvdbs-website.vercel.app/news |
| See all pages | Click links in footer navigation |

---

**Next Steps:**

1. ✅ Build complete (done)
2. 📤 Push to GitHub
3. 🚀 Deploy to Vercel
4. 🌐 Point zvdbs.nl domain
5. 📝 Start adding news!

Questions? Check Vercel dashboard → Project Settings → Deployments for build logs.
