# Portfolio Website Design Guidelines

## Design Approach

**Reference-Based Strategy**: Drawing inspiration from modern portfolio platforms (Behance, Dribbble, Read.cv) and developer portfolios (Linear team pages, Vercel developer showcases). The design will emphasize visual storytelling, project showcase excellence, and professional credibility.

**Key Design Principles**:
- Visual hierarchy that guides users from hero → work → contact
- Generous whitespace for sophisticated, gallery-like presentation
- Bold typography for personality and readability
- Card-based layouts for scannable project/skill displays

---

## Typography System

**Font Families** (via Google Fonts CDN):
- Primary: 'Inter' (body text, UI elements, admin panel)
- Display: 'Space Grotesk' or 'Sora' (headings, hero, project titles)

**Type Scale**:
- Hero headline: text-6xl md:text-7xl lg:text-8xl, font-bold
- Section headings: text-4xl md:text-5xl, font-bold
- Subsection titles: text-2xl md:text-3xl, font-semibold
- Project/card titles: text-xl md:text-2xl, font-semibold
- Body text: text-base md:text-lg, leading-relaxed
- Captions/meta: text-sm, font-medium
- Admin interface: text-sm to text-base (utilitarian sizing)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16, 20, 24, 32** for consistent rhythm.
- Component padding: p-6 to p-8
- Section spacing: py-20 md:py-32
- Card gaps: gap-6 md:gap-8
- Element margins: mb-4, mb-8, mb-12 for vertical flow

**Container Strategy**:
- Public pages: max-w-7xl mx-auto px-6 md:px-8
- Content sections: max-w-6xl mx-auto
- Admin panel: max-w-screen-xl mx-auto px-4

---

## Public Website Components

### Hero Section (Home)
- Full viewport height (min-h-screen) with large background image
- Large hero image showcasing workspace, creative setup, or professional portrait (blurred slightly, overlay applied)
- Centered content overlay with name (display font, massive scale), title/tagline, primary CTA buttons
- Buttons on image: backdrop-blur-md bg-white/10 border border-white/20 for glassmorphism effect
- Scroll indicator at bottom

### About Me Section
- Two-column layout (md:grid-cols-2) with profile image on left, bio on right
- Profile image: Large circular or rounded-lg frame
- Bio: Multi-paragraph with generous line-height
- Contact details grid: email, phone, location with icons (Heroicons)
- Social links row: Icon buttons leading to profiles

### Skills Section
- Category-grouped skill cards
- Grid layout: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6
- Each skill card: Icon/logo at top, skill name, proficiency bar (horizontal progress indicator)
- Skill categories: Separate sections or tabbed interface

### Projects Section
- Masonry or grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
- Project cards: Large thumbnail image, title, description excerpt, tech badges (pill-shaped), CTA buttons (View Project, GitHub)
- Filter bar at top: Technology tags as clickable pills
- Featured projects: Larger card size or highlighted border

### Gallery Section
- Grid layout: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4
- Images: Aspect-ratio-square or aspect-video, object-cover, rounded-lg
- Lightbox overlay on click: Full-screen modal with backdrop-blur, navigation arrows

### Contact Form
- Single-column centered form (max-w-2xl)
- Form fields: Full-width inputs with clear labels above, border focus states
- Textarea for message: min-h-[200px]
- Submit button: Large, prominent, full-width on mobile

### Footer
- Multi-column layout: grid-cols-1 md:grid-cols-3
- Columns: Quick links, Contact info, Social media icons
- Newsletter signup (optional enhancement): Email input + button
- Copyright notice at bottom center

---

## Admin Panel Components

### Login Page
- Centered card (max-w-md) on neutral background
- Logo/title at top
- Username and password inputs with labels
- Login button (full-width)
- Minimal, functional design

### Admin Dashboard
- Sidebar navigation (fixed, left side, w-64): Logo at top, nav links with icons, logout at bottom
- Main content area: ml-64 padding p-8
- Dashboard cards grid: Stats cards showing counts (projects, skills, messages)
- Recent activity list or quick actions

### CRUD Interfaces (Projects, Skills, Profile)
- Data table layout: Striped rows, hover states, action buttons (Edit, Delete) per row
- Add/Edit forms: Modal overlays or dedicated pages
- Form structure: Stacked labels + inputs, grouped sections for related fields
- Image upload: Drag-and-drop zone or file input with preview thumbnail

### Contact Messages Inbox
- Table with columns: Name, Email, Subject, Date, Read Status
- Read/unread indicators: Badge or icon
- Click to expand message details
- Mark as read button

---

## Component Library

**Navigation**:
- Public nav: Horizontal bar, fixed top, backdrop-blur, links spaced with gap-8
- Admin nav: Vertical sidebar with icon + text links

**Buttons**:
- Primary: Solid background, medium padding (px-6 py-3), rounded-lg
- Secondary: Border style, transparent background
- Icon buttons: Square aspect, padding-2 or padding-3

**Cards**:
- Base card: rounded-xl, border or shadow-lg, padding-6
- Hover effect: Transform scale-105 or shadow intensity increase

**Forms**:
- Input fields: border, rounded-md, px-4 py-2.5, focus:ring states
- Labels: text-sm font-medium, mb-2
- Error states: Border change + error text below

**Badges/Pills**:
- Technology tags: Rounded-full, px-3 py-1, text-xs font-medium

**Icons**:
- Use Heroicons (outline for nav, solid for buttons)
- Consistent sizing: w-5 h-5 for inline, w-6 h-6 for standalone

---

## Images Strategy

**Hero Image**: Yes - large, high-quality image of workspace, creative tools, or professional environment. Should evoke creativity and professionalism.

**Profile Image**: Professional headshot or creative portrait in About section.

**Project Thumbnails**: Screenshots or mockups of each project (16:9 or 4:3 aspect ratio).

**Gallery Images**: Personal or project-related images showcasing work, process, or inspirations.

**Skill Logos**: Technology/tool logos for each skill (SVG preferred, use CDN sources like cdnjs or unpkg).

---

## Animations

Use sparingly for polish:
- Fade-in on scroll for sections (intersection observer)
- Smooth transitions on card hovers (transition-all duration-300)
- Page transitions: None or subtle fade
- Form submit: Loading spinner on button

**Avoid**: Excessive parallax, complex scroll animations, auto-playing carousels