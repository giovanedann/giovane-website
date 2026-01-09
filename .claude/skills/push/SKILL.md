---
name: push
description: Commit and push changes to the repository. Use when you want to commit, push, or save your work to git.
---

# Push Changes

Commit and push changes to the repository with conventional commits.

## Instructions

When this skill is triggered:

### 1. Analyze changes

```bash
git status
git diff --stat
```

### 2. Group changes by task/feature

Review all modified files and identify distinct tasks. Examples of separate tasks:

- Adding a new component
- Fixing a bug
- Updating styles
- Adding documentation
- Refactoring code

### 3. Create atomic commits

For each distinct task, create a separate commit using conventional commits format:

**Commit types:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Formatting, missing semicolons, etc.
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

**Commit message format:**

```
<type>: <short description>

<optional body with more details>

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

### 4. Update your CLAUDE.md plan file

Whenever commiting something, update your CLAUDE.md plan file to keep track of what's missing and what's already done.

### 5. Commit workflow

For each group of related files:

```bash
git add <related-files>
git commit -m "$(cat <<'EOF'
<type>: <description>

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

### 6. Push to remote

```bash
git push
```

### 7. Report summary

After pushing, provide a summary:

- Number of commits created
- Brief description of each commit
- Confirmation that push was successful

## Examples

**Single task (all files related):**

```
feat: add social links with toast notifications
```

**Multiple tasks (split commits):**

```
feat: add floating social links component
feat: add sonner toast for copy feedback
fix: add cursor-pointer to floating button
```

## Important

- Never force push
- Never commit sensitive files (.env, credentials, etc.)
- Always use conventional commits format
- Group related changes together
- Keep commits atomic and focused
- If it's a new feature, always update CLAUDE.md file
