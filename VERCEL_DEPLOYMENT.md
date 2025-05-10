# Deploying RaketDev on Vercel

This guide provides step-by-step instructions to deploy your RaketDev landing page on Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com) if you don't have one)
2. A GitHub, GitLab, or Bitbucket repository with your project code
3. A PostgreSQL database (Neon Database is recommended for Serverless PostgreSQL)

## Step 1: Prepare Your Database

1. Create a PostgreSQL database on [Neon](https://neon.tech/) or another provider
2. Get your PostgreSQL connection string in the format:
   ```
   postgresql://user:password@host:port/database
   ```

## Step 2: Push Your Code to a Repository

1. Create a repository on GitHub, GitLab, or Bitbucket
2. Push your code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <repository-url>
   git push -u origin main
   ```

## Step 3: Deploy on Vercel

1. Log in to your Vercel account
2. Click "Add New Project"
3. Import your repository
4. Configure the project settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add the following environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SESSION_SECRET`: A random string for session security (generate using a secure method)
   - `NODE_ENV`: Set to `production`
   - `REPLIT_DOMAINS`: Your Vercel deployment domain (can be added after first deployment)
   - `PORT`: `3000` (Vercel standard port)

6. Click "Deploy"

## Step 4: Post-Deployment Configuration

1. After deployment, go to your Vercel dashboard and find your deployment URL
2. Add this URL to the `REPLIT_DOMAINS` environment variable in your Vercel project settings
3. Trigger a new deployment for the change to take effect

## Step 5: Database Migration

Your database schema needs to be created on your production database. You have two options:

### Option 1: One-time migration
Use Drizzle Kit to push your schema to the production database:

```bash
# Install Drizzle Kit globally
npm install -g drizzle-kit

# Set your DATABASE_URL environment variable
export DATABASE_URL=your_production_database_url

# Run the migration
drizzle-kit push
```

### Option 2: Set up a migration in Vercel
Add a build step to your `package.json` that runs migrations during deployment:

```json
"build": "drizzle-kit push && npm run build:client && npm run build:server"
```

## Step 6: Verify Deployment

1. Visit your deployed site at the Vercel URL
2. Verify all features work correctly:
   - Home page loads with proper styling
   - Custom sections appear in navigation
   - Admin login works
   - Database content is displayed

## Troubleshooting

### Database Connection Issues
- Verify your DATABASE_URL is correct
- Ensure your database allows connections from Vercel's IP ranges
- Check Vercel logs for any connection errors

### Missing Content
- Verify your database has been properly seeded
- Check API routes for any errors

### Authentication Issues
- Make sure SESSION_SECRET is properly set
- Verify REPLIT_DOMAINS includes your Vercel domain

### Deployment Failures
- Check Vercel build logs for errors
- Ensure all dependencies are properly listed in package.json
- Verify build commands are correct

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Database Documentation](https://neon.tech/docs/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)