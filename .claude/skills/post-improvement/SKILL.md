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
