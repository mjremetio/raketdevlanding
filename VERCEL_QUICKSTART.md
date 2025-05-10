# RaketDev - Quick Deployment Guide for Vercel

This quick start guide will help you deploy your RaketDev landing page on Vercel in just a few minutes.

## Step 1: Prepare Your Repository

Push your codebase to GitHub, GitLab, or BitBucket.

## Step 2: Set Up Vercel

1. Create an account or log in to [Vercel](https://vercel.com)
2. Click "Add New Project"
3. Connect to your repository
4. Keep default settings for most options

## Step 3: Configure Environment Variables

Add these environment variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `SESSION_SECRET` | A random string (e.g., run `openssl rand -hex 32` to generate) |
| `NODE_ENV` | `production` |
| `REPLIT_DOMAINS` | Your Vercel domain (can add after first deployment) |

## Step 4: Deploy

Click "Deploy" and wait for the process to complete.

## Step 5: Database Setup

After deployment, you need to set up your database schema:

```bash
# Install Drizzle CLI
npm install -g drizzle-kit

# Set database URL (replace with your actual connection string)
export DATABASE_URL="postgresql://user:password@host:port/database"

# Push schema to database
drizzle-kit push
```

## Step 6: Add Domain to Environment Variables

After your first deployment, get your Vercel domain and add it to the `REPLIT_DOMAINS` environment variable in your project settings.

## Step 7: Verify

Visit your deployed site and verify that everything works as expected:
- Home page loads correctly
- Custom sections display in navigation
- Login to admin panel works
- All content is visible

## Need Help?

See the full [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) file for detailed instructions and troubleshooting tips.