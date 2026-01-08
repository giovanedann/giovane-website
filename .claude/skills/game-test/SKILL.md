---
name: game-test
description: Test the typing roguelike game in development. Use when you want to test the game, check game functionality, or verify gameplay mechanics.
---

# Test Game Locally

Test the typing roguelike game in development.

## Instructions

When this skill is triggered:

### 1. Ensure Dev Server is Running

Check if dev server is running on port 3000. If not, start it.

### 2. Navigate to Game

Direct user to: http://localhost:3000/game

### 3. Game Testing Checklist

Help verify:

**Core Mechanics**
- [ ] Monsters spawn with visible words
- [ ] Typing correct word destroys monster
- [ ] Partial typing shows progress
- [ ] Wrong key gives feedback (without penalty or with penalty based on design)
- [ ] Multiple monsters can exist simultaneously

**Progression**
- [ ] Waves increase in difficulty
- [ ] Words get longer/harder over time
- [ ] Monster speed increases appropriately
- [ ] Score increments correctly

**UX/Polish**
- [ ] Game starts on click/keypress
- [ ] Pause functionality works
- [ ] Game over screen shows final score
- [ ] Restart option available
- [ ] Sound effects play (if implemented)

**Performance**
- [ ] No lag when many monsters on screen
- [ ] Animations are smooth (60fps)
- [ ] No memory leaks over time

### 4. Report Issues

If issues found:
- Document the bug
- Check console for errors
- Offer to fix identified issues

### 5. Playtest Feedback

After testing, gather feedback:
- Is the difficulty curve good?
- Are the words appropriate?
- Is the game fun?
- What features to add/remove?
