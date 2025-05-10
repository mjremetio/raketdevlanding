# RaketDev - Modern Landing Page

A dynamic and interactive landing page for RaketDev, designed to highlight the company's technological innovation and service offerings with engaging user experience elements.

## Features

- Modern, responsive design using React, TypeScript, and Tailwind CSS
- Admin panel for content management
- Dark/light mode theme toggle 
- Custom sections that appear in both website and navigation
- Accessibility settings (colors, fonts, logo customization)
- Database-driven content management
- Text logo fallback when no custom logo is provided

## Deployment on Vercel

Follow these steps to deploy this project on Vercel:

### 1. Prepare your project

Make sure you have:
- A GitHub, GitLab, or Bitbucket repository with your code
- A PostgreSQL database (Neon Database recommended)

### 2. Set up Vercel

1. Create a Vercel account at [vercel.com](https://vercel.com/)
2. Click on "Add New Project"
3. Connect your repository 
4. Configure your project:
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 3. Environment Variables

Add the following environment variables in Vercel:

- `DATABASE_URL` - Your PostgreSQL connection string
- `SESSION_SECRET` - A long, random string for session security
- `NODE_ENV` - Set to `production`
- `REPLIT_DOMAINS` - The domain for your Vercel deployment (can be added after deployment)

### 4. Deploy

Click "Deploy" and wait for the build to complete.

### 5. Database Setup

After deployment:

1. Run migrations: Use the Vercel CLI or a separate script to run database migrations
2. Seed data: Ensure initial data is seeded in your database

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start the development server: `npm run dev`

## Admin Access

Default credentials:
- Username: raketdev
- Password: RaketDev2025!

## Technologies

- React with TypeScript
- Tailwind CSS
- PostgreSQL with Drizzle ORM
- Express.js backend
- React Query for data fetching
- Shadcn UI components