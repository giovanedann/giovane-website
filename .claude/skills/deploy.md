# Skill: Deploy to Vercel

Deploy the website to Vercel.

## Usage

```
/deploy
```

## Instructions

When the user runs this skill:

1. **Pre-deployment checks**:
   - Ensure we're on the correct branch (usually `main`)
   - Run `/build` skill to validate everything compiles
   - Check for uncommitted changes

2. **If using Vercel CLI** (vercel installed):
   ```bash
   # Preview deployment
   vercel

   # Production deployment
   vercel --prod
   ```

3. **If using Git-based deployment** (recommended):
   ```bash
   # Ensure all changes are committed
   git status

   # Push to main (triggers Vercel auto-deploy)
   git push origin main
   ```

4. **Post-deployment**:
   - Provide the deployment URL
   - Remind user to check:
     - All pages load correctly
     - Images are displaying
     - Meta tags are correct (use social media debuggers)
     - Mobile responsiveness

## First-Time Setup

If Vercel is not connected yet, guide the user:

1. Go to [vercel.com](https://vercel.com)
2. Import the GitHub repository
3. Configure:
   - Framework preset: Next.js
   - Build command: `pnpm build`
   - Output directory: `.next`
4. Add environment variables from `.env.local`
5. Deploy

## Environment Variables Checklist

Ensure these are set in Vercel dashboard:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GISCUS_REPO`
- `NEXT_PUBLIC_GISCUS_REPO_ID`
- `NEXT_PUBLIC_GISCUS_CATEGORY`
- `NEXT_PUBLIC_GISCUS_CATEGORY_ID`
