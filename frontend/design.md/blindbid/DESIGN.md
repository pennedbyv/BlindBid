---
name: BlindBid
colors:
  surface: '#121318'
  surface-dim: '#121318'
  surface-bright: '#38393e'
  surface-container-lowest: '#0d0e12'
  surface-container-low: '#1a1b20'
  surface-container: '#1e1f24'
  surface-container-high: '#282a2f'
  surface-container-highest: '#333539'
  on-surface: '#e3e2e8'
  on-surface-variant: '#c8c5cb'
  inverse-surface: '#e3e2e8'
  inverse-on-surface: '#2f3035'
  outline: '#929095'
  outline-variant: '#47464b'
  surface-tint: '#c8c5cd'
  primary: '#c8c5cd'
  on-primary: '#303035'
  primary-container: '#0e0e13'
  on-primary-container: '#7c7a81'
  inverse-primary: '#5f5e64'
  secondary: '#f5be3e'
  on-secondary: '#402d00'
  secondary-container: '#bf8e00'
  on-secondary-container: '#3d2c00'
  tertiary: '#c8c5d0'
  on-tertiary: '#312f38'
  tertiary-container: '#0f0e15'
  on-tertiary-container: '#7d7a84'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e4e1e9'
  primary-fixed-dim: '#c8c5cd'
  on-primary-fixed: '#1b1b20'
  on-primary-fixed-variant: '#47464c'
  secondary-fixed: '#ffdfa0'
  secondary-fixed-dim: '#f5be3e'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5c4300'
  tertiary-fixed: '#e5e1ec'
  tertiary-fixed-dim: '#c8c5d0'
  on-tertiary-fixed: '#1c1b23'
  on-tertiary-fixed-variant: '#47464f'
  background: '#121318'
  on-background: '#e3e2e8'
  surface-variant: '#333539'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 64px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  mono-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

The design system is engineered for a premium, AI-native Web3 auction environment. The brand personality is authoritative yet understated, evoking the feeling of a sophisticated digital vault or a high-end AI operating system. It targets high-net-worth collectors and sophisticated traders who value discretion, speed, and precision.

The aesthetic leans heavily into **Minimalism** and **Modern Corporate** styles, with a cinematic execution. It avoids the typical "crypto" clutter (neon, grit, or excessive glassmorphism) in favor of deep black surfaces, razor-sharp typography, and gold accents that signify value and prestige. The emotional response should be one of calm confidence—an interface that feels "expensive" through restraint and intentionality.

## Colors

This design system utilizes a "Void and Gold" palette to create a high-luxury, cinematic atmosphere.

- **Primary (Background):** Rich Black (#0E0E13). This is the foundation of the UI, providing a deep, ink-like canvas that makes content appear to float.
- **Surface (Cards/Containers):** Dark Charcoal (#17171F) for primary containers, with Elevated Card (#1F1E26) used for interactive elements or secondary nesting.
- **Accent:** Luxury Gold (#D3A01E). Used sparingly for high-value actions, active states, and signifying rarity or "winning" status.
- **Typography:** Pure Off-White (#F2F2F2) for maximum legibility and Secondary Text (#A0A0A6) to maintain a clear visual hierarchy and reduce cognitive load.

## Typography

The typography strategy combines modern utility with premium editorial flair. 

- **Hanken Grotesk** is used for headlines and displays. Its sharp, contemporary geometry provides the "AI operating system" feel.
- **Inter** handles the bulk of the body text, ensuring cross-platform clarity and a neutral, functional tone.
- **Geist** (Monospaced variant) is utilized for labels, technical data, and Web3 transaction hashes, reinforcing the platform's technical precision.

Negative space is as important as the type itself; generous line heights and tracking adjustments on labels are required to maintain the "Luxury" feel.

## Layout & Spacing

This design system employs a **Fixed Grid** philosophy for desktop to maintain a cinematic, gallery-like experience, transitioning to a fluid model for mobile.

- **Desktop:** 12-column grid with a 1280px max-width. Margins are intentionally wide (64px) to emphasize the premium nature of the content.
- **Section Gaps:** Significant vertical breathing room (120px+) between major sections to prevent the UI from feeling "crowded" or "app-like."
- **Rhythm:** An 8px linear scale is used for all internal component spacing, ensuring mathematical harmony across the platform.
- **Mobile:** Single column with 20px margins. Elements like cards should retain their generous internal padding even when scaled down.

## Elevation & Depth

Depth is conveyed through **Tonal Layering** rather than traditional drop shadows. By stacking shades of charcoal and black, we create a sense of physical architecture.

- **Level 0 (Base):** Rich Black (#0E0E13).
- **Level 1 (Cards):** Dark Charcoal (#17171F). 
- **Level 2 (Active/Hover):** Elevated Card (#1F1E26) with a subtle 1px stroke (#2A2A32) to define edges.
- **Shadows:** Use only "Ambient Shadows"—ultra-diffused, 15% opacity black shadows with a 40px+ blur radius. This creates a soft glow effect rather than a harsh lift, mimicking a screen in a dark room.

## Shapes

The shape language is defined by large, sophisticated radii. A consistent **22px corner radius** (`rounded-lg` in this system) is applied to all primary cards and containers, creating a "squircle" feel reminiscent of premium hardware.

- **Small elements (Buttons/Inputs):** 8px (Soft) to maintain functional precision.
- **Primary Containers (Cards/Modals):** 22px (Rounded-LG) for a cinematic, modern appearance.
- **Interactive States:** Use subtle scale-up transforms (1.02x) instead of dramatic color changes to maintain the understated luxury aesthetic.

## Components

- **Buttons:** Primary buttons use a solid Gold (#D3A01E) background with black text. Secondary buttons use a "Ghost" style: a 1px white or gold stroke with no fill.
- **Cards:** Cards should have no visible border on the base layer. Definition is achieved through the transition from Rich Black to Dark Charcoal. Internal padding should be a minimum of 32px.
- **Input Fields:** Minimalist design with a 1px border (#2A2A32). On focus, the border transitions to Gold. Backgrounds should remain transparent or Level 1 Charcoal.
- **Chips/Status Tags:** Use the Monospaced font (Geist) in small sizes. Backgrounds are low-opacity versions of the status color (e.g., 10% Gold for "Active").
- **Auction Timer:** Should be displayed in Geist Mono, oversized, with a slight tracking increase to emphasize the countdown's importance.
- **Icons:** Use thin-stroke (1.5pt) linear icons. Icons should never be filled; they are functional guides, not focal points.