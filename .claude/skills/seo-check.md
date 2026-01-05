# Skill: SEO Audit

Run an SEO audit on the website.

## Usage

```
/seo-check
```

## Instructions

When the user runs this skill, perform a comprehensive SEO audit:

### 1. Check Metadata Files

Verify these files exist and are properly configured:
- `app/layout.tsx` - Has proper metadata export
- `app/sitemap.ts` - Generates sitemap.xml
- `app/robots.ts` - Generates robots.txt
- `public/favicon.ico` - Favicon exists

### 2. Validate Page Metadata

For each page, check:
- Unique `title` (50-60 characters ideal)
- Unique `description` (150-160 characters ideal)
- Open Graph tags (`og:title`, `og:description`, `og:image`)
- Twitter Card tags

### 3. Check Blog Posts

For each MDX file in `content/posts/`:
- Has required frontmatter (title, description, date)
- Description length is appropriate
- Has a cover image defined

### 4. Validate Structure

- Proper heading hierarchy (h1 → h2 → h3)
- All images have `alt` attributes
- Internal links use Next.js `Link` component
- No broken links

### 5. Performance Indicators

- Check for large images that should be optimized
- Verify Next.js Image component is used
- Check for unused dependencies

### 6. Generate Report

Output a report with:
- ✅ Passing checks
- ⚠️ Warnings (improvements recommended)
- ❌ Errors (must fix)

## Post-Audit

Offer to:
- Fix any identified issues
- Generate missing meta tags
- Optimize images
- Create missing sitemap/robots files
