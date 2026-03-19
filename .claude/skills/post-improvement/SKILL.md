---
name: post-improvement
description: Improve a blog post by fixing grammar errors, improving structure, and suggesting enhancements. Use after running post-reviewer to apply fixes while preserving your voice.
---

# Improve Blog Post

Apply fixes to a blog post based on review feedback while preserving the author's voice and style.

## Important Guidelines

### Preserve the Author's Voice

- **Keep humor intact**: Don't tone down jokes, sarcasm, or playful exaggeration
- **Maintain casual style**: Don't make the writing more formal
- **Keep strong opinions**: Statements like "X is a scam" should stay as-is
- **Don't add fluff**: No unnecessary filler words or corporate speak
- **Minimal text changes**: The improved text should feel like the author wrote it, not a rewrite

### Structure Improvements

- Improve paragraph organization if sections feel disjointed
- Add better transitions between sections when needed
- Reorganize bullet points for clarity
- Break up long paragraphs if they cover multiple ideas

### Bullet Point & List Formatting (Auto-apply)

Upgrade plain bullet lists to use **bold labels** when items have distinct concepts:

- **Plain lists** (simple enumerations) → Keep as-is with `-`
- **Concept lists** (items with explanations) → Use `- **Label** — Explanation`
- **Sequential steps** → Use numbered lists with `1. **Step name** — Description`
- **Framework/acronym lists** → Use `- **ACRONYM** — Expansion or description`

**When to upgrade:**
- 3+ items where each has a distinct name/label and an explanation
- Process steps that happen in order
- Technical terms being defined or compared

**When NOT to upgrade:**
- Short lists of simple items (e.g., a list of tags or names)
- Lists where items are single words or short phrases with no explanation
- Lists that are already well-formatted

### Post Structure Enhancements (Auto-apply)

Add these structural elements to improve readability:

**1. TL;DR + What to Expect (immediately after frontmatter, before ## Introduction):**

The TL;DR block goes right after the `---` closing the frontmatter, before the first heading. This is consistent across all posts.

```markdown
> **TL;DR:** One sentence summary of the post's main message.
>
> **What to expect:**
> - Topic 1
> - Topic 2
> - Topic 3
```

**2. Horizontal rules for visual chapters:**
- Add `---` after the Introduction section
- Add `---` before the Conclusion section

**3. Pull quotes for impactful sentences:**
- Find 1-2 powerful sentences and convert to blockquotes
- Example: `> How the hell would I replicate that? It's impossible.`

**4. Question/Answer formatting:**
- Use italics for rhetorical questions: `*"Oh, so I can't do X, right?"*`
- Follow with a punchy answer on the next line

**5. Punchier conclusions:**
- Use line breaks between short, impactful sentences:
```markdown
Your path is yours.

Not better. Not worse. Just different.

And that's okay.
```

**6. Call to action before farewell:**
```markdown
If this post was helpful, consider leaving a like. It helps me know what resonates with you.

Farewell.
```

### Visual Elements (When Reasonable)

Add visual variety to break up walls of text, but only where it makes sense:

- **Bullet points with bold labels** → For lists of items with explanations (`- **Label** — Explanation`)
- **Numbered lists** → For sequential steps or ordered items
- **Code blocks** → For commands, file paths, or technical references
- **Blockquotes** → For key insights or memorable quotes from the post
- **Horizontal rules** → For visual chapter breaks (after intro, before conclusion)
- **Side-by-side comparisons** → Use bold labels with bullet lists (NOT tables)
- **Italics for rhetorical questions** → Makes Q&A sections stand out

**IMPORTANT: Do NOT use markdown tables in MDX files.** They don't render correctly. For comparisons, use:
```markdown
**Option A:**
- Point 1
- Point 2

**Option B:**
- Point 1
- Point 2
```
Or inline: `**Week 1:** Study only. **Week 2:** Games only.`

**When to add visual elements:**

- Lists of 3+ related items → convert to bullet points with bold labels
- Step-by-step processes or timelines → convert to numbered lists
- Technical terms, commands, or paths → use inline code or code blocks
- Key takeaways or memorable phrases → consider blockquotes
- Comparisons or before/after scenarios → use side-by-side bullet lists with bold labels
- Sequential events with dates/times → consider timeline format with bold timestamps

**When NOT to add:**

- Don't force visual elements where text flows naturally
- Don't add code blocks for non-technical content
- Don't over-use blockquotes (max 1-2 per post)
- Don't use markdown tables (they break in MDX)
- If the post doesn't have content that fits, don't add any

### Text Enhancement

Beyond grammar, improve readability while preserving voice:

- **Tighten wordy sentences** → Remove unnecessary words without changing meaning
- **Improve flow** → Add transition words between paragraphs when needed
- **Clarify confusing sentences** → Reword for clarity while keeping the author's style
- **Split run-on sentences** → Break into shorter sentences if too long
- **Combine choppy sentences** → Merge if too fragmented

### Redundancy Removal (Auto-apply)

Actively identify and fix redundant content:

- **Repeated phrases** → If the same phrase appears multiple times (e.g., "I will give you an example" used twice), vary the phrasing
- **Redundant words** → Remove words that don't add meaning (e.g., "in fact" when it's obvious, "actually" when unnecessary)
- **Saying the same thing twice** → If two sentences express the same idea, merge or remove one
- **Filler phrases** → Remove phrases like "to be honest", "basically", "kind of" unless they add personality
- **Circular explanations** → If the author explains something, then re-explains it immediately, keep only the clearer version

**Examples of redundancy fixes:**
- "I will give you an example" (first) + "I will give you an example" (second) → Keep first, change second to "Here's another example" or "For instance"
- "That's life: X. That's just how life is." → Keep only one
- "I think, in my opinion" → Just "I think" or "In my opinion"

### Image Suggestions (Non-demanding)

- Suggest where images could enhance the post (optional)
- List suggestions separately, don't insert placeholders
- Only affects the score if the post explicitly needs visuals (tutorials, step-by-step guides)
- Personal/opinion posts don't need images

### What NOT to Do

- Don't add sections the author didn't plan for
- Don't add disclaimers or soften strong statements
- Don't expand bullet points into paragraphs unless asked
- Don't add conclusions to incomplete sections (flag them instead)
- Don't rewrite sentences beyond fixing grammar - preserve the original wording

## Instructions

### Workflow

1. Read the post content
2. Fix grammar errors (capitalization, typos, spelling)
3. Improve structure and organization where needed
4. Flag incomplete sections (don't fill them in)
5. Suggest images (optional, non-demanding)
6. Show a summary of changes

### Grammar Fixes (Auto-apply)

- Capitalize "I" consistently
- Fix typos (machanical → mechanical, would by → would be)
- Fix verb tense (haven't like → didn't like, have build → have built)
- Fix word choice (specially → especially, best than → better than)
- Fix subject-verb agreement (company that have → company that has)

### Structure Improvements (Auto-apply)

- Add line breaks between dense paragraphs
- Reorder sentences within a paragraph for better flow
- Group related bullet points together

### Incomplete Sections (Flag Only)

If a section contains placeholder text like "Lorem ipsum" or "TODO":

- Highlight the section
- Don't fill it in
- Remind the author to complete it

### Image Suggestions (Separate Section)

- List where images could help (if any)
- Mark as optional suggestions
- Example: "Consider adding a screenshot of the game here (optional)"

### Output Format

After making changes:

1. Show a summary of grammar fixes
2. Show structure improvements made
3. List any incomplete sections found
4. List optional image suggestions (if any)
5. Confirm the file has been updated

Example output:

```
## Grammar Fixes Applied
- Fixed 23 instances of lowercase "i" → "I"
- Fixed typo: "machanical" → "mechanical"
- Fixed grammar: "have build" → "have built"

## Structure Improvements
- Added line break between paragraphs in "The Motivation" section
- Reorganized bullet points in "Lessons Learned" for clarity

## Incomplete Sections Found
- Line 77: "Working With AI as a Development Partner" contains placeholder text

## Image Suggestions (Optional)
- Game section: Consider adding a screenshot of the typing game
- These are suggestions only - the post works fine without them

Post updated at: content/posts/[slug].mdx
```
