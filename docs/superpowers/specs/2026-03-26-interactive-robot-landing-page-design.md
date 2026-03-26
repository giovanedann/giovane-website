# Interactive Robot Landing Page - Design Spec

## Context

The current landing page uses animated text with staggered Framer Motion entrance animations and an interactive BackgroundBoxes grid. While functional, it lacks a strong visual hook. The goal is to replace it with an interactive 3D robot that follows the user's mouse, presses buttons with its left arm, and holds floating tech particles in its right hand. This creates a memorable, high-impact first impression that communicates "Product & AI Engineer" without words.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Rendering | Three.js 3D | Maximum visual impact; worth the dependency for a landing page |
| 3D Model | Built from primitives | Full joint control needed for arm IK and head tracking |
| Layout | Centered content, robot right | Balanced composition; arm naturally reaches toward buttons |
| Left fill | Particle network (in 3D scene) | Fills empty space, ties into robot's tech particle theme |
| Arm interaction | Point and press | Hand pushes into button on click with spring animation |
| Mobile | Robot head only + stacked buttons | Head fits small viewport; eyes track touch/gyroscope |
| WebGL fallback | Current BackgroundBoxes page | Proven interactive experience; no degraded static page |

## Desktop Layout

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   ○──○                                                  │
│  ○    ╲         Giovane Saes              ┌─────┐       │
│   ╲    ○      Product & AI Engineer       │(○ ○)│       │
│    ○──○                                   │ head│       │
│  ○        ○     Who are you?              └──┬──┘       │
│   ╲      /                                   │          │
│    ○────○    ┌──────────────────┐        ┌───┴───┐      │
│   particle   │ I am an engineer │◄──arm──│ torso │      │
│   network    └──────────────────┘        │  (●)  │      │
│              ┌──────────────────┐        └┬─────┬┘      │
│              │ I am a recruiter │         │     │ ✦✦    │
│              └──────────────────┘        legs   particles│
│              ┌──────────────────┐               ✦✦      │
│              │ I am a wanderer  │                       │
│              └──────────────────┘                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

- Content (title, subtitle, buttons) is positioned at roughly 40% from the left edge of the viewport (CSS `left: 40%; transform: translateX(-50%)`) so it reads as centered but leaves room for the robot on the right
- Robot is positioned right of center with 3D perspective depth
- Particle network fills the left portion of the 3D scene, fading toward center
- The Three.js canvas is full-viewport, behind the HTML content (pointer-events: none on canvas, buttons are HTML elements on top)

## Robot Construction (Three.js Primitives)

### Body Parts (each is a separate mesh for animation)

| Part | Geometry | Notes |
|------|----------|-------|
| Head | SphereGeometry (slightly squished) | Rotates toward mouse via lerp |
| Eyes | Two small SphereGeometry with emissive | Glow effect, subtle pulse animation |
| Neck | CylinderGeometry | Connects head to torso, slight rotation |
| Torso | Tapered CylinderGeometry or custom | Main body, dark metallic material |
| Chest core | SphereGeometry + PointLight | Emissive glow, pulsing animation |
| Upper arms (L/R) | CylinderGeometry | Connected to shoulder joints |
| Forearms (L/R) | CylinderGeometry | Connected to elbow joints |
| Hands (L/R) | SphereGeometry | Left hand has finger details for pressing |
| Upper legs | CylinderGeometry | Static pose |
| Lower legs | CylinderGeometry | Static pose |
| Feet | BoxGeometry (rounded) | Static, grounding the robot |

### Materials

- **Body:** MeshStandardMaterial — metallic: 0.8, roughness: 0.3, dark color (#1a1a2e or similar)
- **Eyes/Core:** MeshStandardMaterial with emissive (#4a9eff), emissiveIntensity animated
- **Joints:** Slightly different roughness to show segmentation

### Scene Setup

- **Camera:** PerspectiveCamera, positioned front-facing, slight downward angle
- **Lighting:** Ambient light (low) + directional light (main) + point light at chest core + subtle rim light
- **Background:** Transparent (HTML page background shows through)

## Interactions

### Head Tracking
- Convert mouse screen position to a 3D target point (raycaster onto an invisible plane)
- Head `lookAt` the target, clamped to reasonable rotation range (±30° horizontal, ±20° vertical)
- Smoothed with lerp factor ~0.05–0.08 for natural weight

### Left Arm - Inverse Kinematics
- **Two-bone IK:** Upper arm + forearm solve toward mouse-projected 3D position
- Target point: mouse position projected onto a plane in front of the robot
- Clamped so the arm can't reach behind the robot or into unnatural poses
- Smoothed with lerp factor ~0.08–0.1

### Left Arm - Button Press
- Detect button hover via HTML events (not Three.js raycasting)
- On hover: arm target snaps to button's screen-to-world position
- On click:
  1. Hand translates forward (toward camera) ~0.1 units over 100ms
  2. Spring back over 200ms (damping: 0.6, stiffness: 300)
  3. Button HTML element gets a `scale(0.97)` + slight shadow change for 200ms
  4. Navigation proceeds after animation completes (~300ms delay)

### Right Arm - Static + Particles
- Right arm in a relaxed pose, hand at bottom-right
- 8-12 small SphereGeometry particles orbit the right hand
- Particles use emissive materials (blue, purple, cyan mix)
- Orbit paths: slightly randomized elliptical, different speeds
- Subtle size pulsing on each particle

### Particle Network (Left Side)
- Part of the Three.js scene (same 3D space, same lighting)
- 30-50 small spheres scattered in the left portion of the scene at various Z-depths
- Connected by thin lines (BufferGeometry lines) when within a distance threshold
- Slow drift animation (each particle has a small velocity vector)
- Colors: blue (#4a9eff), purple (#7c3aed), cyan (#06b6d4) at low opacity
- Particles fade out (opacity → 0) as they approach the center of the scene

## Mobile Design

### Breakpoint
- Below 768px width: switch to mobile layout

### Mobile Layout
```
┌─────────────────────┐
│                     │
│      ┌─────┐        │
│      │(○ ○)│        │
│      │ head│        │
│      └─────┘        │
│                     │
│    Giovane Saes     │
│  Product & AI Eng   │
│                     │
│   Who are you?      │
│                     │
│ ┌─────────────────┐ │
│ │ I am an engineer│ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ I am a recruiter│ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ I am a wanderer │ │
│ └─────────────────┘ │
│                     │
└─────────────────────┘
```

- Only the robot head renders (no body, arms, or particles)
- Head eyes follow touch position or device gyroscope (if available via DeviceOrientationEvent)
- Simplified Three.js scene (just the head) for performance
- Buttons are standard HTML, no arm press interaction
- A few ambient particles behind the head for subtle depth

## WebGL Fallback

If WebGL is not available (`!window.WebGLRenderingContext` or context creation fails):
- Render the **current landing page** (BackgroundBoxes + animated text + buttons)
- This is the existing `app/page.tsx` content, preserved as a fallback component
- No degraded static experience — the fallback is already a proven interactive page

## Tech Dependencies

### New Dependencies
- `three` — Three.js core
- `@react-three/fiber` — React renderer for Three.js
- `@react-three/drei` — Helpers (OrbitControls, etc. — we'll use selectively)

### Existing Dependencies (no changes)
- `motion` (Framer Motion) — button animations, page transitions
- `tailwindcss` — styling

## Files to Create/Modify

### New Files
- `components/robot/RobotScene.tsx` — Main R3F Canvas + scene setup
- `components/robot/RobotModel.tsx` — Robot body construction + materials
- `components/robot/RobotHead.tsx` — Head mesh + eye tracking logic
- `components/robot/RobotArm.tsx` — Arm mesh + IK solver
- `components/robot/RobotHand.tsx` — Hand mesh + press animation
- `components/robot/ParticleNetwork.tsx` — 3D particle network
- `components/robot/TechParticles.tsx` — Right-hand orbiting particles
- `components/robot/useMouseTracking.ts` — Hook: mouse position → 3D coordinates
- `components/robot/useArmIK.ts` — Hook: two-bone IK solver
- `components/robot/useWebGLSupport.ts` — Hook: detect WebGL availability

### Modified Files
- `app/page.tsx` — Replace current content with robot scene + HTML overlay (keep old content as fallback)

## Verification Plan

1. `pnpm dev` — check the landing page loads with the 3D robot
2. Move mouse around — head and left arm follow smoothly
3. Hover over each button — arm reaches toward button
4. Click each button — arm press animation plays, navigation works after delay
5. Resize to mobile (<768px) — only head renders, buttons stack, eyes track touch
6. Disable WebGL (browser devtools) — current BackgroundBoxes page renders
7. `pnpm build` — no TypeScript or build errors
8. Test on Chrome, Firefox, Safari
9. Check performance: maintain 60fps on mid-range hardware
