# Design System Guide

## Overview
This document outlines the comprehensive design system for the AI Response Validation Dashboard, providing consistent spacing, typography, and design patterns across all components.

## 🎨 Design Tokens

### Spacing Scale
Our spacing system is based on a **4px grid** for consistency and scalability.

| Token | Value | Use Case |
|-------|-------|----------|
| `1` | 4px | Minimal spacing, tight layouts |
| `2` | 8px | Small spacing, form elements |
| `3` | 12px | Medium spacing, component padding |
| `4` | 16px | Base spacing, section margins |
| `5` | 20px | Large spacing, card padding |
| `6` | 24px | Extra large spacing, section padding |
| `8` | 32px | Section margins, major spacing |
| `10` | 40px | Page margins, large sections |
| `12` | 48px | Major page sections |
| `16` | 64px | Hero sections, page breaks |
| `20` | 80px | Large page sections |
| `24` | 96px | Major page divisions |

### Typography Scale
Consistent typography hierarchy with proper line heights and letter spacing.

#### Display Text
- **`.text-display-1`** - `text-6xl font-black` - Hero headlines
- **`.text-display-2`** - `text-5xl font-extrabold` - Page titles
- **`.text-display-3`** - `text-4xl font-bold` - Section headlines

#### Headings
- **`.text-heading-1`** - `text-3xl font-bold` - Main headings
- **`.text-heading-2`** - `text-2xl font-semibold` - Sub headings
- **`.text-heading-3`** - `text-xl font-semibold` - Component titles
- **`.text-heading-4`** - `text-lg font-medium` - Small headings

#### Body Text
- **`.text-body-large`** - `text-lg leading-relaxed` - Large body text
- **`.text-body`** - `text-base leading-relaxed` - Standard body text
- **`.text-body-small`** - `text-sm leading-relaxed` - Small body text
- **`.text-caption`** - `text-xs leading-tight` - Captions, labels

### Color System
Consistent color palette with semantic meaning.

#### Primary Colors
- **Primary**: `#000000` (Black) - Main actions, text
- **Primary Foreground**: `#FFFFFF` (White) - Text on primary
- **Accent**: `#F59E0B` (Amber) - Highlights, interactions

#### Semantic Colors
- **Success**: `#10B981` (Green) - Positive states
- **Warning**: `#F59E0B` (Amber) - Caution states
- **Error**: `#EF4444` (Red) - Error states
- **Info**: `#3B82F6` (Blue) - Information states

## 🧩 Component Patterns

### Layout Utilities
Consistent layout patterns for common use cases.

#### Stack Layouts
```css
.layout-stack-xs  /* space-y-1 */
.layout-stack-sm  /* space-y-2 */
.layout-stack-md  /* space-y-4 */
.layout-stack-lg  /* space-y-6 */
.layout-stack-xl  /* space-y-8 */
```

#### Row Layouts
```css
.layout-row-xs   /* space-x-1 */
.layout-row-sm   /* space-x-2 */
.layout-row-md   /* space-x-4 */
.layout-row-lg   /* space-x-6 */
.layout-row-xl   /* space-x-8 */
```

### Container Patterns
Responsive container utilities for consistent page layouts.

```css
.container-narrow  /* max-w-4xl - Content focused */
.container-wide    /* max-w-7xl - Dashboard layouts */
.container-fluid   /* w-full - Full width content */
```

### Spacing Utilities
Consistent spacing for components and layouts.

#### Component Spacing
```css
.component-xs  /* p-2 */
.component-sm  /* p-3 */
.component-md  /* p-4 */
.component-lg  /* p-6 */
.component-xl  /* p-8 */
```

#### Section Spacing
```css
.section-xs   /* py-4 */
.section-sm   /* py-6 */
.section-md   /* py-8 */
.section-lg   /* py-12 */
.section-xl   /* py-16 */
.section-2xl  /* py-20 */
.section-3xl  /* py-24 */
```

### Form Patterns
Consistent form layouts and spacing.

```css
.form-xs  /* space-y-2 */
.form-sm  /* space-y-3 */
.form-md  /* space-y-4 */
.form-lg  /* space-y-6 */
.form-xl  /* space-y-8 */
```

### Button Patterns
Standardized button sizing and spacing.

```css
.btn-xs  /* px-2 py-1 text-xs */
.btn-sm  /* px-3 py-2 text-sm */
.btn-md  /* px-4 py-2 text-base */
.btn-lg  /* px-6 py-3 text-lg */
.btn-xl  /* px-8 py-4 text-xl */
```

### Card Patterns
Consistent card layouts with proper spacing.

```css
.card-xs  /* p-3 rounded-lg */
.card-sm  /* p-4 rounded-lg */
.card-md  /* p-6 rounded-xl */
.card-lg  /* p-8 rounded-2xl */
.card-xl  /* p-10 rounded-3xl */
```

## 📱 Responsive Design

### Responsive Typography
Text that scales appropriately across screen sizes.

```css
.responsive-text-xs   /* xs → sm → base */
.responsive-text-sm   /* sm → base → lg */
.responsive-text-base /* base → lg → xl */
.responsive-text-lg   /* lg → xl → 2xl */
.responsive-text-xl   /* xl → 2xl → 3xl */
```

### Responsive Spacing
Spacing that adapts to different screen sizes.

```css
.responsive-spacing-xs  /* p-2 → p-3 → p-4 */
.responsive-spacing-sm  /* p-3 → p-4 → p-6 */
.responsive-spacing-md  /* p-4 → p-6 → p-8 */
.responsive-spacing-lg  /* p-6 → p-8 → p-12 */
.responsive-spacing-xl  /* p-8 → p-12 → p-16 */
```

## 🎭 Interactive States

### Hover Effects
Consistent hover interactions across components.

```css
.hover-lift    /* -translate-y-1 + shadow-lg */
.hover-scale   /* scale-105 */
.hover-glow    /* shadow-lg + amber glow */
```

### Focus States
Accessible focus indicators for keyboard navigation.

```css
.focus-ring        /* amber ring */
.focus-ring-white  /* white ring */
```

### Transitions
Smooth animations for better user experience.

```css
.interactive      /* 200ms transition */
.interactive-fast /* 150ms transition */
.interactive-slow /* 300ms transition */
```

## 🎬 Animation Utilities

### Entrance Animations
Smooth component entrance effects.

```css
.animate-fade-in    /* fade in */
.animate-slide-up   /* slide from bottom */
.animate-slide-down /* slide from top */
.animate-slide-left /* slide from right */
.animate-slide-right /* slide from left */
```

## 📐 Usage Examples

### Dashboard Layout
```jsx
<div className="container-wide">
  <header className="section-md">
    <h1 className="text-display-2">Dashboard</h1>
  </header>
  
  <main className="layout-stack-lg">
    <section className="card-lg">
      <h2 className="text-heading-2 margin-b-md">Recent Activity</h2>
      <div className="layout-stack-md">
        {/* Content */}
      </div>
    </section>
  </main>
</div>
```

### Form Component
```jsx
<form className="form-md">
  <div className="layout-stack-md">
    <div>
      <label className="text-body font-medium">Email</label>
      <input className="input-md w-full" />
    </div>
    
    <div className="layout-row-md">
      <button className="btn-md btn-primary">Submit</button>
      <button className="btn-md btn-secondary">Cancel</button>
    </div>
  </div>
</form>
```

### Card Component
```jsx
<div className="card-md hover-lift interactive">
  <h3 className="text-heading-3 margin-b-sm">Card Title</h3>
  <p className="text-body margin-b-md">Card content...</p>
  <button className="btn-sm">Action</button>
</div>
```

## 🔧 Implementation Guidelines

### 1. Use Design Tokens
Always use the predefined spacing and typography classes instead of arbitrary values.

✅ **Good:**
```jsx
<div className="p-6 space-y-4">
  <h2 className="text-2xl font-semibold">Title</h2>
</div>
```

❌ **Avoid:**
```jsx
<div className="p-[24px] space-y-[16px]">
  <h2 className="text-[20px] font-semibold">Title</h2>
</div>
```

### 2. Follow Spacing Hierarchy
Use consistent spacing relationships between elements.

```jsx
// Component level
<div className="p-6"> {/* component-lg */}
  <h3 className="mb-4"> {/* margin-b-md */}
    <span className="text-sm"> {/* text-body-small */}
      Content
    </span>
  </h3>
</div>
```

### 3. Maintain Typography Scale
Use the predefined typography classes for consistent hierarchy.

```jsx
// Page structure
<h1 className="text-display-2">Page Title</h1>
<h2 className="text-heading-1">Section Title</h2>
<h3 className="text-heading-2">Subsection Title</h3>
<p className="text-body">Body text content</p>
```

### 4. Responsive Design
Use responsive utilities for adaptive layouts.

```jsx
<div className="responsive-spacing-md">
  <h2 className="responsive-text-lg">Adaptive Title</h2>
</div>
```

## 🧪 Testing & Validation

### Visual Testing
- Ensure consistent spacing between similar components
- Verify typography hierarchy is maintained
- Check responsive behavior across breakpoints

### Accessibility Testing
- Verify focus indicators are visible
- Test hover states work with keyboard navigation
- Ensure sufficient color contrast ratios

### Performance Testing
- Monitor CSS bundle size
- Verify animations are smooth (60fps)
- Test on various devices and browsers

## 📚 Resources

### Design Tools
- [Figma Design System Template](https://www.figma.com/community/file/design-system)
- [Storybook for Component Documentation](https://storybook.js.org/)
- [Chromatic for Visual Testing](https://www.chromatic.com/)

### CSS Frameworks
- [Tailwind CSS](https://tailwindcss.com/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)

---

*This design system ensures consistency, maintainability, and scalability across the entire application. Follow these guidelines to create cohesive, professional user interfaces.*
