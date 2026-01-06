# Skill: Create New Blog Post

Create a new blog post with the proper structure and frontmatter.

## Usage

```
/new-post [title]
```

## Instructions

When the user runs this skill:

1. **Get the post title** from the argument, or ask if not provided

2. **Generate the slug** from the title:
   - Convert to lowercase
   - Replace spaces with hyphens
   - Remove special characters
   - Example: "My Awesome Post!" → "my-awesome-post"

3. **Get additional info** (ask the user):
   - Short description (1-2 sentences for card preview)
   - Long description (a paragraph introduction for expanded view)
   - Tags (comma-separated)

4. **Create the MDX file** at `content/posts/[slug].mdx` with:

```mdx
---
title: "[Title]"
short_description: "[Short description - 1-2 sentences]"
long_description: "[Long description - introductory paragraph]"
date: "[Current date in YYYY-MM-DD format]"
tags: ["tag1", "tag2"]
published: false
image: "/images/blog/[slug]/cover.png"
---

## Introduction

Start writing your post here...

![Example image alt text](/images/blog/[slug]/example.png)

## Section 1

Content...

```tsx
// Example code block
const example = "code";
```

## Conclusion

Wrap up your thoughts...
```

5. **Create an images directory** for the post at `public/images/blog/[slug]/`

6. **Inform the user**:
   - File created at: `content/posts/[slug].mdx`
   - Images folder: `public/images/blog/[slug]/`
   - Remind them to set `published: true` when ready
   - Open the file for editing

## Example

User: `/new-post How I Built a Typing Game`

Creates:

- `content/posts/how-i-built-a-typing-game.mdx`
- `public/images/blog/how-i-built-a-typing-game/`

## Frontmatter Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Post title |
| short_description | string | Yes | 1-2 sentences for card preview |
| long_description | string | Yes | Introductory paragraph for expanded card |
| date | string | Yes | Publication date (YYYY-MM-DD) |
| updated | string | No | Last update date |
| tags | string[] | Yes | Array of tags |
| published | boolean | Yes | Whether post is visible |
| image | string | No | Cover image path |
