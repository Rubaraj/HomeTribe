# HomeTribe Design System & Instructions

This document outlines the design system, guidelines, and instructions for maintaining consistent visual design across the HomeTribe application.

## 🎨 Color Palette

### Primary Colors
- **Primary**: `#113F67` - Deep blue, used for main backgrounds and primary elements
- **Secondary**: `#34699A` - Medium blue, used for borders and secondary elements
- **Accent**: `#58A0C8` - Light blue, used for interactive elements and highlights
- **Light**: `#ffffff` - Pure white, used for card backgrounds and light elements

### CSS Variables
```css
:root {
  --color-primary: #113F67;
  --color-secondary: #34699A;
  --color-accent: #58A0C8;
  --color-light: #FDF5AA;
}
```

## 🌓 Theme System

### Light Mode
- **Background**: `var(--color-primary)` (#113F67)
- **Text**: `#ffffff` (White)
- **Cards**: `var(--color-light)` (#ffffff)
- **Card Text**: `var(--color-primary)` (#113F67)
- **Headers/Footers**: `var(--color-primary)` (#113F67)

### Dark Mode
- **Background**: `#0a0a0a` (Deep black)
- **Text**: `#ffffff` (White)
- **Cards**: `#2a2a2a` (Dark gray)
- **Card Text**: `#ffffff` (White)
- **Headers/Footers**: `#1a1a1a` (Dark gray)

## 📝 Typography

### Font Stack
- **Primary Font**: Geist Sans (via next/font/google)
- **Monospace Font**: Geist Mono (for code elements)
- **Fallback**: Arial, Helvetica, sans-serif

### Font Sizes & Hierarchy
- **H1 (Main Title)**: `text-4xl` (36px) - Bold
- **H2 (Section Title)**: `text-3xl` (30px) - Bold
- **H3 (Subsection)**: `text-2xl` (24px) - Bold
- **H4 (Card Title)**: `text-xl` (20px) - Semibold
- **Body Text**: `text-lg` (18px) - Regular
- **Small Text**: `text-sm` (14px) - Regular
- **Tiny Text**: `text-xs` (12px) - Regular

## 🔲 Layout Guidelines

### Container Specifications
- **Max Width**: `max-w-md` (448px) for forms and cards
- **Max Width**: `max-w-2xl` (672px) for content sections
- **Padding**: `p-4` (16px) minimum, `p-8` (32px) for cards
- **Margins**: `mb-4` to `mb-8` (16px to 32px) for vertical spacing

### Grid & Spacing
- **Gap Spacing**: `gap-4` (16px) to `gap-6` (24px) for elements
- **Border Radius**: `rounded-lg` (8px) for cards, `rounded-xl` (12px) for prominent elements
- **Border Width**: `border` (1px) standard, `border-2` for emphasis

## 🎯 Component Design Patterns

### Header Component
```css
- Background: var(--header-bg)
- Text Color: var(--header-text)
- Position: Fixed top
- Padding: py-4 px-6
- Border: Bottom border with --color-secondary
- z-index: 40
```

### Footer Component
```css
- Background: var(--header-bg)
- Text Color: var(--header-text)
- Position: Fixed bottom
- Padding: py-4 px-6
- Border: Top border with --color-secondary
- z-index: 40
```

### Card Components
```css
- Background: var(--card-bg)
- Text Color: var(--card-text)
- Border: 1px solid var(--color-accent)
- Border Radius: rounded-xl
- Shadow: shadow-lg
- Padding: p-8
```

### Button Styles

#### Primary Button
```css
- Background: var(--color-accent)
- Text: white
- Padding: py-3 px-6
- Border Radius: rounded-lg
- Font Weight: font-semibold
- Transition: transition-all duration-200
- Hover: hover:shadow-lg
```

#### Secondary Button
```css
- Background: transparent
- Border: 1px solid var(--foreground)
- Text: var(--foreground)
- Padding: py-3 px-6
- Border Radius: rounded-lg
- Font Weight: font-semibold
- Transition: transition-all duration-200
```

#### Social Login Buttons
```css
- Background: var(--card-bg)
- Border: 1px solid (brand color)
- Text: var(--card-text)
- Padding: py-3 px-4
- Border Radius: rounded-lg
- Font Weight: font-medium
- Gap: gap-3 for icon and text
- Transition: transition-all duration-200
- Hover: Custom brand color overlay
```

## 🎨 Interactive States

### Hover Effects
- **Duration**: `duration-200` (200ms)
- **Shadow**: Add `hover:shadow-md` or `hover:shadow-lg`
- **Background Overlays**: 
  - Google: `rgba(66, 133, 244, 0.05)` light / `rgba(66, 133, 244, 0.1)` dark
  - Apple: `rgba(0, 0, 0, 0.05)` light / `rgba(255, 255, 255, 0.05)` dark

### Focus States
- **Ring**: `focus:ring-2` with `var(--color-accent)`
- **Outline**: `focus:outline-none` to remove default
- **Border**: Enhanced border color on focus

## 📱 Responsive Design & Mobile Guidelines

### Mobile-First Approach
HomeTribe follows a mobile-first design philosophy, ensuring optimal experience across all devices.

### Breakpoints (Tailwind CSS)
- **Mobile**: Default (up to 640px) - Primary design target
- **Tablet**: `sm:` (640px and up) - Enhanced spacing and typography
- **Desktop**: `md:` (768px and up) - Full desktop experience
- **Large Desktop**: `lg:` (1024px and up) - Expanded layouts

### Mobile Design Specifications

#### Typography Scale (Mobile)
- **H1 (Main Title)**: `text-2xl sm:text-4xl` (24px → 36px)
- **H2 (Section Title)**: `text-xl sm:text-3xl` (20px → 30px)
- **H3 (Subsection)**: `text-lg sm:text-2xl` (18px → 24px)
- **H4 (Card Title)**: `text-base sm:text-xl` (16px → 20px)
- **Body Text**: `text-sm sm:text-lg` (14px → 18px)
- **Small Text**: `text-xs sm:text-sm` (12px → 14px)

#### Container Specifications (Responsive)
- **Mobile Padding**: `p-4` (16px) minimum
- **Tablet/Desktop Padding**: `sm:p-6` to `sm:p-8` (24px to 32px)
- **Mobile Card Width**: `max-w-sm` (384px)
- **Tablet/Desktop Card Width**: `sm:max-w-md` (448px)
- **Content Width**: `max-w-full sm:max-w-2xl`

#### Header & Navigation (Mobile)
```css
/* Mobile Header */
- Height: Reduced padding `py-3 sm:py-4`
- Logo: `text-lg sm:text-xl` (18px → 20px)
- Navigation: `text-sm sm:text-base` (14px → 16px)
- Gaps: `gap-3 sm:gap-6` (12px → 24px)
- Touch Targets: Minimum 44px height
```

#### Footer (Mobile)
```css
/* Mobile Footer */
- Padding: `py-3 px-4 sm:py-4 sm:px-6`
- Text Size: `text-xs sm:text-sm` (12px → 14px)
- Reduced height for more content space
```

#### Layout Adjustments (Mobile)
```css
/* Main Content Area */
- Top Padding: `pt-16 sm:pt-20` (64px → 80px)
- Bottom Padding: `pb-12 sm:pb-16` (48px → 64px)
- Side Margins: `mx-4 sm:mx-auto` (auto-center on larger screens)
```

### Mobile Component Patterns

#### Button Layout (Mobile)
```css
/* Mobile Button Stack */
- Layout: `flex-col sm:flex-row` (vertical → horizontal)
- Gap: `gap-3 sm:gap-4` (12px → 16px)
- Padding: `px-4 sm:px-6` (16px → 24px)
- Min Height: `min-h-[44px]` (touch target)
```

#### Form Elements (Mobile)
```css
/* Mobile Form Inputs */
- Font Size: `text-base` (16px) - Prevents iOS zoom
- Padding: `py-3 px-4` (12px 16px)
- Border Radius: `rounded-lg` (8px)
- Full Width: `w-full` on mobile
- Stack: Vertical layout by default
```

#### Social Login Buttons (Mobile)
```css
/* Mobile Social Buttons */
- Icon Size: `18px` on mobile, `20px` on desktop
- Button Height: Minimum `44px` for touch
- Text Size: `text-sm sm:text-base`
- Padding: `py-3 px-4` (consistent touch target)
```

#### Card Components (Mobile)
```css
/* Mobile Cards */
- Padding: `p-6 sm:p-8` (24px → 32px)
- Margin: `m-4 sm:mx-auto` (side margins on mobile)
- Border Radius: `rounded-xl` (12px)
- Shadow: Reduced on mobile for performance
```

### Mobile-Specific CSS Classes

#### Touch Target Optimization
```css
/* Ensure proper touch targets */
.mobile-touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Mobile icon sizing */
@media (max-width: 640px) {
  .social-login-icon {
    width: 18px;
    height: 18px;
  }
}
```

#### Mobile Form Improvements
```css
/* Prevent iOS zoom on inputs */
input[type="email"], 
input[type="password"] {
  font-size: 16px;
}

/* Mobile-friendly navigation */
nav a {
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
}
```

### Performance Considerations (Mobile)

#### Optimizations
- **Reduced Shadows**: Lighter shadow effects on mobile
- **Efficient Animations**: Use `transform` and `opacity` for smooth performance
- **Image Optimization**: Responsive images with appropriate sizing
- **CSS**: Minimize complex selectors and effects

#### Loading States
- **Skeleton Screens**: Show content structure while loading
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Fast Loading**: Optimize critical rendering path

### Mobile User Experience Guidelines

#### Navigation
- **Thumb-Friendly**: Elements within easy reach
- **Clear Hierarchy**: Obvious information architecture
- **Consistent**: Same patterns across all pages
- **Accessible**: Works with assistive technologies

#### Content Strategy
- **Prioritize**: Most important content first
- **Scannable**: Easy to quickly understand
- **Actionable**: Clear calls-to-action
- **Concise**: Shorter text for mobile screens

#### Interaction Patterns
- **Tap Targets**: Minimum 44px × 44px
- **Swipe Gestures**: Consider for applicable interactions
- **Feedback**: Immediate response to user actions
- **Error Handling**: Clear, helpful error messages

### Mobile Testing Checklist

#### Device Testing
- [ ] iPhone SE (375px) - Smallest common screen
- [ ] iPhone 12/13/14 (390px) - Standard iPhone
- [ ] Samsung Galaxy (360px) - Standard Android
- [ ] iPad (768px) - Tablet breakpoint
- [ ] Landscape orientation testing

#### Functionality Testing
- [ ] All buttons are easily tappable (44px minimum)
- [ ] Text is readable without zoom
- [ ] Forms work properly with mobile keyboards
- [ ] Navigation is intuitive and accessible
- [ ] Page loading is fast (< 3 seconds)
- [ ] Images and icons display correctly
- [ ] Theme toggle works on mobile
- [ ] No horizontal scrolling issues

#### Performance Testing
- [ ] Lighthouse mobile score > 90
- [ ] Core Web Vitals pass
- [ ] Works on slow 3G connection
- [ ] Battery usage is reasonable
- [ ] Memory usage is optimized

### Mobile Implementation Examples

#### Responsive Header
```jsx
<header className="w-full py-3 px-4 sm:py-4 sm:px-6 border-b flex items-center justify-between fixed top-0 left-0 z-40">
  <div className="text-lg sm:text-xl font-bold">HomeTribe</div>
  <nav className="flex items-center gap-3 sm:gap-6">
    <a className="text-sm sm:text-base hover:underline">Home</a>
    <a className="text-sm sm:text-base hover:underline">Sign Up</a>
  </nav>
</header>
```

#### Responsive Button Group
```jsx
<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
  <a className="px-4 sm:px-6 py-3 rounded-lg font-semibold text-center">
    Get Started
  </a>
  <button className="px-4 sm:px-6 py-3 rounded-lg font-semibold border">
    Learn More
  </button>
</div>
```

#### Responsive Card
```jsx
<div className="w-full max-w-sm sm:max-w-md p-6 sm:p-8 rounded-xl shadow-lg border">
  <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center">
    Get Started
  </h2>
  {/* Card content */}
</div>
```

## ♿ Accessibility Guidelines

### Color Contrast
- Ensure minimum 4.5:1 contrast ratio for normal text
- Ensure minimum 3:1 contrast ratio for large text
- Test both light and dark modes

### Interactive Elements
- All buttons must have `aria-label` for screen readers
- Focus states must be visible and clear
- Use semantic HTML elements
- Ensure keyboard navigation works

### Form Elements
- Proper labels for all inputs
- Clear error states and messages
- Placeholder text should not be the only label
- Required fields should be clearly marked

## 🔧 Implementation Guidelines

### CSS Custom Properties Usage
Always use CSS custom properties for colors to ensure theme consistency:
```css
/* ✅ Correct */
style={{ color: 'var(--foreground)' }}

/* ❌ Avoid */
style={{ color: 'white' }}
```

### Component Structure
1. **Client Components**: Use `"use client"` for interactive components
2. **Server Components**: Default for static content
3. **CSS Classes**: Prefer Tailwind classes over inline styles when possible
4. **Custom Styles**: Use CSS custom properties for theme-aware styling

### File Organization
```
src/app/
├── components/          # Reusable components
├── [page]/             # Page-specific components
├── globals.css         # Global styles and CSS variables
└── layout.js          # Root layout with theme system
```

## 🎯 Brand Guidelines

### Logo Usage
- **Brand Name**: "HomeTribe"
- **Typography**: Bold, clear, readable
- **Color**: Use `--header-text` to ensure visibility on backgrounds

### Voice & Tone
- **Friendly**: Welcoming and approachable
- **Professional**: Clean and organized
- **Inclusive**: Accessible to all users
- **Modern**: Contemporary design patterns

## 🔄 Theme Toggle Implementation

### Toggle Button
- **Position**: Header, right side
- **Style**: Transparent background, border matching header text
- **Icons**: Sun/moon icons that change based on current theme
- **Size**: `w-5 h-5` (20px) for icons, `p-2` (8px) padding

### Theme Persistence
- Save user preference in `localStorage`
- Respect system preference as default
- Apply theme class to `document.documentElement`

## 📋 Development Checklist

Before implementing new components:

- [ ] Does it follow the color palette?
- [ ] Is it responsive on all screen sizes?
- [ ] Does it work in both light and dark modes?
- [ ] Are hover and focus states implemented?
- [ ] Is it accessible (ARIA labels, keyboard navigation)?
- [ ] Does it use CSS custom properties for theming?
- [ ] Is the code clean and well-commented?
- [ ] Has it been tested in different browsers?

---

## 📞 Support

For questions about the design system or implementation:
- Check this document first
- Review existing components for patterns
- Test changes in both light and dark modes
- Ensure accessibility compliance

**Last Updated**: August 2025
**Version**: 1.0
