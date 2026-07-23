---
name: Tactile Health
colors:
  surface: '#f8f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f6'
  surface-container: '#edeef0'
  surface-container-high: '#e7e8ea'
  surface-container-highest: '#e1e2e4'
  on-surface: '#191c1e'
  on-surface-variant: '#414754'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f3'
  outline: '#727785'
  outline-variant: '#c1c6d6'
  surface-tint: '#005bc0'
  primary: '#005bbf'
  on-primary: '#ffffff'
  primary-container: '#1a73e8'
  on-primary-container: '#ffffff'
  inverse-primary: '#adc7ff'
  secondary: '#006e2f'
  on-secondary: '#ffffff'
  secondary-container: '#6bff8f'
  on-secondary-container: '#007432'
  tertiary: '#845300'
  on-tertiary: '#ffffff'
  tertiary-container: '#a66900'
  on-tertiary-container: '#ffffff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc7ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#6bff8f'
  secondary-fixed-dim: '#4ae176'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005321'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e1e2e4'
  background-light: '#F3F4F6'
  background-dark: '#020617'
  surface-light: '#FFFFFF'
  surface-dark: '#0B1120'
  error-red: '#EF4444'
  text-primary: '#111827'
  text-secondary: '#4B5563'
typography:
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  stat-lg:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system balances the clinical precision of a health app with the approachable, tactile warmth of modern skeuomorphism. It targets health-conscious individuals who appreciate the clarity of Google’s Material Design but desire a more high-fidelity, "physical" interface that feels responsive to the touch.

The style is **Google Skeuomorphism**: a hybrid of Material Design's spatial logic (generous whitespace, Product Sans-inspired typography) and "Soft UI" tactile effects. Interfaces should feel like a series of physical, high-quality plastic or glass panels raised from a matte surface. The emotional response is one of reliability, cleanliness, and physical satisfaction during interaction.

## Colors
The palette is rooted in the "Google Core" colors, emphasizing high-saturation actions against low-saturation backgrounds. 

- **Primary Blue** is used for critical paths and brand identification.
- **Success Green** is the primary "health" indicator for positive calorie tracking and macro completion.
- **Tertiary Amber** is reserved for warnings, rate limits, and nutritional "caution" zones.

**Color Mode Adaptation:**
- **Light Mode:** Uses `#F3F4F6` as the base canvas with white surfaces. Shadows are soft, using low-opacity slates (`rgba(15, 23, 42, 0.08)`).
- **Dark Mode:** Transitions to a deep midnight canvas (`#020617`). Shadows become deeper blacks, while surface edges receive a 1px "inner glow" or "rim light" (low opacity white) to maintain the raised appearance.

## Typography
The system utilizes **Hanken Grotesk** as the primary typeface to emulate the clean, geometric, yet friendly nature of Google’s proprietary fonts. **Inter** is used for utility labels and data-heavy tables to ensure maximum legibility at small scales.

Numeric data (calories, macro counts) should always be rendered in `stat-lg` or `headline-md` with semi-bold weights to ensure they are the primary focal point of the health dashboard.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a fixed maximum container width for desktop readability. 

- **Desktop:** 12-column grid. The primary layout is split 60/40. The left column (7 columns) handles interaction and input, while the right column (5 columns) manages output, history, and results.
- **Tablet:** 8-column grid. Modules reflow to a single column if content density exceeds 400px per card.
- **Mobile:** 4-column grid with a vertical stack. Results cards follow input cards immediately.

Spacing relies on an **8px rhythm**. Generous "breathable" padding (typically 24px or 32px) is used inside cards to contrast with the dense data found in nutritional tables.

## Elevation & Depth
Depth is the defining characteristic of this design system. It uses a combination of **Ambient Shadows** and **Tonal Layers** to create a "raised" effect.

1.  **Base Surface:** Neutral light gray (`#F3F4F6`).
2.  **Raised Cards:** Pure white with a 16px - 20px radius. They use a dual-shadow approach:
    *   *Outer Shadow:* `0 18px 40px rgba(15, 23, 42, 0.08)` to create height.
    *   *Top Edge Highlight:* A 1px white inner-border (or `0 -3px 6px rgba(255, 255, 255, 0.8)`) on the top edge to simulate light hitting a physical bevel.
3.  **Active Elements:** Buttons and interactive inputs use a stronger, more condensed shadow (`0 8px 18px rgba(26, 115, 232, 0.3)`) to suggest they sit even higher than the card surface.
4.  **Pressed State:** Elements use a `1px 1px 3px rgba(0,0,0,0.1) inset` shadow and a -2px vertical translation to simulate physical depression.

## Shapes
The system uses a "Rounded" language to maintain a friendly, Google-like aesthetic. 

- **Primary Cards:** 20px radius (rounded-xl) for large surface containers.
- **Inputs & Buttons:** 12px radius (rounded-lg) for a tactile, "pill-ish" feel that isn't fully circular.
- **Status Chips:** Full "pill" (999px) for categorical metadata and macro markers.

## Components

- **Buttons:** Large, 52px height targets. Primary buttons use a subtle vertical gradient (Brand Blue to a slightly darker shade) to enhance the 3D effect. On hover, the shadow intensifies; on click, the button "sinks" into the card.
- **Inputs:** Backgrounds are slightly off-white (`#F9FAFB`) with a subtle 1px border. They use an inner shadow of 2px to look slightly recessed until they receive focus.
- **Macro Chips:** Raised pill shapes. Each macro (Protein, Fat, Carbs) uses its assigned color as a subtle radial highlight in the top-left corner, mimicking the look of translucent physical buttons or caps.
- **Lists & Tables:** Tables are "cards within cards." The header has a soft gray background with top-only rounded corners. Rows use a "lift" animation on hover, increasing their shadow and lightening their background slightly.
- **Checkboxes & Radios:** Modeled after physical toggle switches or dimpled buttons. They should feel "clicky" with high-contrast active states.
- **Progress Bars:** Designed as recessed "channels" (inner shadow) with a raised, glowing bar that moves within it, suggesting a physical liquid or light tube.