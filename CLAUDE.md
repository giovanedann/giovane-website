# Giovane's Personal Website

## Claude Instructions

**IMPORTANT**: When generating code for this project, ALWAYS use the `context7` MCP tool first to fetch up-to-date documentation for the libraries being used (Next.js, shadcn/ui, Aceternity UI, Tailwind, Framer Motion, etc.). This ensures code follows current best practices and API patterns.

**IMPORTANT**: DO NOT add comments unless they are explaining some explicit behavior about the code that can't be explained with the code itself. The code should be enough for explaining what it does. You should not write any useful comments like "Buttons", "BackgroundBoxes", just to tell you're instantiating or using something.

**IMPORTANT**: If a bug appears to be caused by React StrictMode (double rendering in development), inform the user about it first instead of immediately changing the code. StrictMode intentionally runs effects twice to help find bugs - this is expected behavior in development and doesn't occur in production. Only make code changes if the user confirms it's actually a problem or if the double-invocation causes real issues (like duplicate API calls or state corruption).

## Project Overview

A personal website with three distinct user journeys:

1. **Engineers/Tech People** → Blog with technical posts
2. **Recruiters** → Professional portfolio/presentation
3. **Wanderers** → Typing roguelike game

## Tech Stack

- **Framework**: Next.js 16.x (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (base components)
- **Animated Components**: Aceternity UI (animated/fancy components)
- **Animations**: Framer Motion (powers Aceternity + custom animations)
- **Blog Content**: MDX (Markdown + JSX)
- **Comments**: Giscus (GitHub Discussions)
- **Search**: Client-side with Fuse.js
- **Hosting**: Vercel
- **Package Manager**: pnpm (preferred) or npm

## Animation Guidelines

This project prioritizes smooth, polished animations throughout the UI. Every interactive element should feel alive.

### Animation Requirements

**ALWAYS add transitions to:**

- Hover states (buttons, cards, links)
- Focus states (inputs, interactive elements)
- Page transitions
- Component mount/unmount
- Loading states
- Scroll-triggered reveals
- Navigation changes

### Animation Implementation

**Use Framer Motion for ALL animations.** Do NOT create custom Tailwind keyframes or CSS animations.

```tsx
// Use Framer Motion for animations
import { motion } from "motion/react";

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>;
```

### Component Library Usage

| Use Case                        | Library       | Notes                     |
| ------------------------------- | ------------- | ------------------------- |
| Buttons, Inputs, Cards, Dialogs | shadcn/ui     | Base components           |
| Fancy animated components       | Aceternity UI | **Add on demand only**    |
| All animations                  | Framer Motion | Primary animation library |

**Important:**

- **Aceternity UI components**: Do NOT pre-install. Add specific components only when explicitly requested.
- **Custom animated components**: Only create when explicitly requested by the user.

### Animation Principles

1. **Subtle but noticeable** - Animations should enhance, not distract
2. **Consistent timing** - Use consistent easing and duration across similar elements
3. **Purpose-driven** - Every animation should serve a purpose (feedback, guidance, delight)
4. **Performance-first** - Use `transform` and `opacity` for GPU-accelerated animations
5. **Respect preferences** - Honor `prefers-reduced-motion` for accessibility

## Project Structure

```
/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Landing page (3 buttons)
│   ├── blog/
│   │   ├── page.tsx             # Blog list with search
│   │   └── [slug]/
│   │       └── page.tsx         # Individual blog post
│   ├── about/
│   │   └── page.tsx             # Recruiter portfolio page
│   └── game/
│       └── page.tsx             # Typing roguelike game
├── components/
│   ├── ui/                      # shadcn/ui components (auto-generated)
│   ├── aceternity/              # Aceternity UI components (copied from docs)
│   ├── blog/                    # Blog-specific components
│   ├── game/                    # Game components
│   └── portfolio/               # Portfolio components
├── content/
│   └── posts/                   # MDX blog posts
│       └── *.mdx
├── lib/
│   ├── mdx.ts                   # MDX utilities
│   ├── posts.ts                 # Blog post helpers
│   └── utils.ts                 # General utilities
├── public/
│   ├── images/
│   │   ├── blog/                # Blog post images
│   │   ├── portfolio/           # Portfolio images
│   │   └── game/                # Game assets
│   └── fonts/                   # Custom fonts if needed
├── styles/
│   └── globals.css              # Global styles + Tailwind
├── types/
│   └── index.ts                 # TypeScript type definitions
└── .claude/
    └── skills/                  # Claude Code skills
```

## Implementation Phases

### Phase 1: Foundation + Landing Page

- [x] Create landing page with 3 journey buttons
- [x] Set up basic layout and navigation
- [x] Configure SEO metadata

### Phase 2: Blog System

- [x] Set up MDX processing with next-mdx-remote
- [x] Create blog post template and frontmatter schema
- [x] Implement blog list page with expandable cards
- [x] Implement individual post page with:
  - Reading time estimate
  - Image optimization
- [ ] Add syntax highlighting with Shiki
- [ ] Add table of contents
- [ ] Add Giscus comments
- [ ] Implement RSS feed
- [ ] Add sitemap generation
- [ ] Add search/filtering

### Phase 3: Portfolio/About Page

- [x] Design recruiter-focused layout
- [x] Sections: About, Technologies, Experience (Timeline), Education
- [x] Timeline/experience visualization with animations
- [ ] Downloadable resume option
- [ ] Social links

### Phase 4: Typing Roguelike Game

- [x] Game engine setup (DOM-based with requestAnimationFrame)
- [x] Monster spawning system with words
- [x] Typing input handling
- [x] Adaptive difficulty progression based on player performance
- [x] Score system with local storage (high score persistence)
- [x] Power-up system with rarity tiers (common, rare, epic, legendary)
- [x] Multi-layer monsters with skull-based HP display
- [x] Gibberish monsters (random words) after 30k score
- [x] Stackable shield system
- [x] Combo system with combo saver power-up
- [ ] Sound effects (optional)
- [ ] Leaderboard (optional, would need backend)

### Phase 5: Polish & Optimization

- [ ] Performance optimization (Core Web Vitals)
- [ ] Accessibility audit (a11y)
- [ ] Mobile responsiveness
- [ ] Analytics setup (Vercel Analytics or Plausible)
- [ ] Final SEO audit

## Blog Post Conventions

### File Naming

- Use kebab-case: `my-awesome-post.mdx`
- Placed in `content/posts/`

### Frontmatter Schema

```yaml
---
title: "Post Title"
short_description: "1-2 sentences for card preview"
long_description: "Introductory paragraph shown when card expands"
date: "2024-01-15"
updated: "2024-01-20" # Optional
tags: ["react", "typescript", "tutorial"]
published: true
image: "/images/blog/post-cover.png" # Optional cover image
---
```

### Writing Guidelines

- Use proper heading hierarchy (start with ## in content, # is the title)
- Include alt text for all images
- Use code blocks with language identifiers
- Keep paragraphs concise
- Add images to `public/images/blog/[post-slug]/`

## Code Conventions

### TypeScript

- Strict mode enabled
- Use interfaces for object shapes
- Prefer `type` for unions and primitives
- Export types from `types/index.ts`

### Components

- Use functional components with arrow functions
- Props interface named `[ComponentName]Props`
- One component per file
- Colocate component-specific styles

### File Naming

- Components: PascalCase (`BlogCard.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Content: kebab-case (`my-post.mdx`)

## SEO Checklist

- [ ] Unique title and description for each page
- [ ] Open Graph and Twitter Card meta tags
- [ ] Structured data (JSON-LD) for blog posts
- [ ] Canonical URLs
- [ ] Sitemap.xml
- [ ] robots.txt
- [ ] Alt text on all images
- [ ] Semantic HTML structure
- [ ] Fast page load times (< 3s)

## Commands Reference

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # TypeScript check

# Content
pnpm new-post         # Create new blog post (custom script)
```

## Environment Variables

```bash
# .env.local (not committed)
NEXT_PUBLIC_SITE_URL=https://giovane.dev
NEXT_PUBLIC_GISCUS_REPO=username/repo
NEXT_PUBLIC_GISCUS_REPO_ID=xxx
NEXT_PUBLIC_GISCUS_CATEGORY=xxx
NEXT_PUBLIC_GISCUS_CATEGORY_ID=xxx
```

## Deployment

Deployed automatically via Vercel on push to `main` branch.

### Pre-deployment Checklist

1. Run `pnpm build` locally to catch errors
2. Check all images are optimized
3. Verify meta tags with social media debuggers
4. Test on mobile devices

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Aceternity UI](https://ui.aceternity.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [MDX Docs](https://mdxjs.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Giscus Setup](https://giscus.app/)
- [Vercel Deployment](https://vercel.com/docs)
