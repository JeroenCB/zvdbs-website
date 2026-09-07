# Deployment Guide: ZVDBS Website

Get your website live in 15 minutes.

## Step 1: Database Setup (MongoDB)

### Option A: Free Cloud Database (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new project "ZVDBS"
4. Create a cluster (free tier)
5. Create a database user with password
6. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/zvdbs?retryWrites=true&w=majority`

### Option B: Local Database

```bash
# Install MongoDB locally (macOS with Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Connection string for local:
# MONGODB_URI=mongodb://localhost:27017/zvdbs
```

## Step 2: GitHub Repository

```bash
# Initialize git repo
cd zvdbs-website
git init
git add .
git commit -m "Initial commit: ZVDBS website MVP"

# Create repo on GitHub and push
git remote add origin https://github.com/yourusername/zvdbs-website.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### 1. Connect GitHub

1. Go to [vercel.com](https://vercel.com)
2. Sign up / Login
3. Click "Import Project"
4. Select "GitHub" and authorize
5. Find and select your `zvdbs-website` repository

### 2. Set Environment Variables

In Vercel project settings, add:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/zvdbs?retryWrites=true&w=majority
PAYLOAD_SECRET = generate-random-string-32-chars-minimum
NODE_ENV = production
```

To generate a random secret:
```bash
openssl rand -hex 16
```

### 3. Deploy

Click "Deploy" and Vercel will:
- Build your Next.js app
- Deploy automatically
- Give you a live URL (`zvdbs-website.vercel.app`)

## Step 4: Setup Custom Domain

1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add custom domain: `zvdbs.nl`
3. Update DNS records (instructions in Vercel)
4. Wait 5-15 minutes for DNS propagation

## Step 5: Initialize Payload Admin

1. Visit your deployed site
2. Go to `/admin`
3. Login with default credentials (set in MongoDB)
4. Create your first admin user
5. Start adding news!

## Verification Checklist

- [ ] Site loads at `zvdbs.nl`
- [ ] Admin panel accessible
- [ ] Can create/edit news articles
- [ ] News appears on homepage
- [ ] Statistics page loads
- [ ] Mobile responsive

## Environment Variables Reference

| Variable | Example | Purpose |
|----------|---------|---------|
| `MONGODB_URI` | `mongodb+srv://...` | Database connection |
| `PAYLOAD_SECRET` | `abc123...` | Admin authentication |
| `NODE_ENV` | `production` | Environment mode |

## Troubleshooting

### "Database connection failed"
- Check MONGODB_URI is correct
- Ensure MongoDB cluster is running
- Whitelist Vercel IP in MongoDB security

### "Admin page blank"
- Check browser console for errors
- Verify PAYLOAD_SECRET is set
- Redeploy from Vercel dashboard

### "Homepage shows no news"
- Check news articles were created in admin
- Verify database connection works
- Check browser console for API errors

## Maintenance

### Regular Backups
```bash
# MongoDB backup (monthly)
mongodump --uri="MONGODB_URI" --out=./backups/$(date +%Y-%m-%d)
```

### Update Dependencies
```bash
npm update
npm audit fix
git commit -am "Update dependencies"
git push
```

### Monitor Vercel
- Check Vercel dashboard for errors
- Review build logs if deploy fails
- Monitor performance in Analytics tab

## Next: Content Migration

Once deployed, migrate existing content:

1. Get old site content (WordPress export)
2. Create news articles in Payload admin
3. Copy club records to Records collection
4. Update member information
5. Test everything works

---

**Estimated Time:** 15 minutes  
**Cost:** Free (MongoDB Atlas free tier)  
**Support:** See README.md
