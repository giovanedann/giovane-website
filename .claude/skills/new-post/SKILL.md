---
name: new-post
description: Create a new blog post with proper MDX structure, frontmatter, and image directories. Use when you want to create a new blog post or start writing a blog article.
---

# Create New Blog Post

Create a new blog post with the proper structure and frontmatter.

## Instructions

When this skill is triggered:

1. **Get the post title** from the argument, or ask if not provided

2. **Generate the slug** from the title:
   - Convert to lowercase
   - Replace spaces with hyphens
   - Remove special characters
   - Example: "My Awesome Post!" -> "my-awesome-post"

3. **Get additional info** (ask the user):
   - Short description (1-2 sentences for card preview)
   - Long description (a paragraph introduction for expanded view)
   - Tags (comma-separated)
   - Topics (comma-separated list)
   - Cover image? (yes/no) - only add image field if they say yes

4. Based on the topics, create a base structure with mocked text. The user will always want to write the posts from scratch, so the mocked text is just to help the user get started about the struture.

5. **Create the MDX file** at `content/posts/[slug].mdx` with:

```mdx
---
title: "[Title]"
short_description: "[Short description - 1-2 sentences]"
long_description: "[Long description - introductory paragraph]"
date: "[Current date in YYYY-MM-DD format]"
tags: ["tag1", "tag2"]
topics: ["topic1", "topic2"]
published: false
---

## Introduction

Start writing your post here...

## Section 1

Content...

## Conclusion

Wrap up your thoughts...
```

**If user wants a cover image**, add to frontmatter:
```yaml
image: "/images/blog/[slug]/cover.png"
```

6. **Create an images directory** for the post at `public/images/blog/[slug]/` - only if the user wants images

7. **Inform the user**:
   - File created at: `content/posts/[slug].mdx`
   - Images folder (if created): `public/images/blog/[slug]/`
   - Remind them to set `published: true` when ready
   - Open the file for editing

## Example

User: "I want to create a blog post about How I Built a Typing Game"

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
