# ZVDBS Website Rebuild

Modern Next.js + Payload CMS website for Zwemvereniging de Blauwe Schuur.

## Tech Stack

- **Frontend:** Next.js 14 (React)
- **CMS:** Payload CMS (Headless)
- **Database:** MongoDB
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Quick Start

### 1. Clone & Install

```bash
git clone <repo-url>
cd zvdbs-website
npm install
```

### 2. Setup Environment

Copy `.env.example` to `.env.local` and update:

```bash
cp .env.example .env.local
```

Set your MongoDB URI (use MongoDB Atlas for cloud hosting).

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### 4. Access Payload CMS Admin

Navigate to `http://localhost:3000/admin` and login with default credentials.

## Project Structure

```
src/
├── app/              # Next.js app routes & pages
├── components/       # Reusable React components
├── collections/      # Payload CMS collection schemas
└── styles/          # Global styles
```

## Key Features

### News Management
- Add news in Payload CMS admin panel
- Appears automatically on homepage
- Simple form: Title → Content → Publish

### Statistics
- Filterable club records by stroke, category, distance
- Top swimmers leaderboard
- Personal record lookup

### Responsive Design
- Mobile-first approach
- Works on all devices
- No horizontal scrolling

## Database Models

### News
- Title, slug, content (richText), excerpt
- Featured image, category, published date
- Author name

### Records (Club Records)
- Member name, category, stroke, distance
- Time, date, location

### Members
- Name, gender, birth year, active status
- Personal records array

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Set environment variables (`MONGODB_URI`, `PAYLOAD_SECRET`)
4. Deploy

Your site will be live immediately!

## Editing Content

### Adding News
1. Go to `http://your-domain/admin`
2. Click "News" collection
3. Create new
4. Fill in title, content, excerpt
5. Click publish

### Adding Club Records
1. Go to Records collection
2. Add member name, category, stroke, distance, time, date
3. Publish

### Creating Pages
1. Go to Pages collection
2. Add title, slug, content
3. Publish (appears at `/[slug]`)

## Next Steps

1. [ ] Migrate existing content from old site
2. [ ] Set up MongoDB Atlas cluster
3. [ ] Configure custom domain (zvdbs.nl)
4. [ ] Add member authentication for personal records
5. [ ] Set up automated record updates from competition software
6. [ ] Add more interactive features (calendar, member profiles)

## Customization

### Colors
Edit `tailwind.config.js` to change colors:
- Primary blue: `#185FA5`
- Accent green: `#1D9E75`

### Typography
Update `src/app/globals.css` for custom fonts.

### Layout
Components are in `src/components/` - modify as needed.

## Support

For questions or issues, contact the development team.

---

**Created:** 2024 | **Status:** MVP Ready
