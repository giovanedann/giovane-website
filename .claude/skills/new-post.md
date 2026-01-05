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
   - Brief description (for SEO)
   - Tags (comma-separated)

4. **Create the MDX file** at `content/posts/[slug].mdx` with:

```mdx
---
title: "[Title]"
description: "[Description]"
date: "[Current date in YYYY-MM-DD format]"
tags: ["tag1", "tag2"]
published: false
---

## Introduction

Start writing your post here...

## Section 1

Content...

## Conclusion

Wrap up your thoughts...
```

5. **Create an images directory** for the post at `public/images/blog/[slug]/`

6. On the example of the item 4, add also image examples so i can replace them.

7. **Inform the user**:
   - File created at: `content/posts/[slug].mdx`
   - Images folder: `public/images/blog/[slug]/`
   - Remind them to set `published: true` when ready
   - Open the file for editing

## Example

User: `/new-post How I Built a Typing Game`

Creates:

- `content/posts/how-i-built-a-typing-game.mdx`
- `public/images/blog/how-i-built-a-typing-game/`
