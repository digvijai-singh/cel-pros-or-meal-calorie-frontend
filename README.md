# XcelPros – Meal Calorie Count Generator

A production-ready frontend application built using **Next.js 16+ App Router**, **TypeScript**, and **Tailwind CSS**. It connects to a live backend at `https://xpcc.devb.zeak.io` to manage authentication and retrieve real-time calorie lookup reports and nutrient ratios powered by USDA database records.

## Features

- **User Authentication**: Secure user registration and login with local-storage-persisted JWT tokens.
- **Route Guarding**: Protected routes (`/dashboard` and `/calories`) that verify session token existence and refresh automatically.
- **Calorie Lookup & Analysis**: A serving-aware query form for looking up dish nutrition profiles.
- **Visual Nutrient Ratios**: Colored energy distribution ratios (protein, carbohydrates, fats) and detailed breakdown tables for ingredients.
- **Persistent Search Logs**: Dashboard search log table containing the history of past queries with timestamps.
- **Rate Limit Resilience**: Full integration with `429 Too Many Requests` headers, showing real-time countdown lockouts on forms.
- **Visual Themes**: Beautiful responsive shell layouts adapting to system-preferred or user-pinned light and dark modes.

---

## Tech Decisions & Trade-Offs

- **Next.js 16 App Router**: Leveraged for fast, modern routing and layouts. To manage authentication status (which is browser-dependent via localStorage) cleanly and avoid hydration mismatches, we implemented client-side mounting checks and hydration-aware route redirections.
- **State Management (Zustand)**: Used Zustand with `persist` middleware. It has a tiny footprint and allows reactive component updates without complex providers or boilerplate.
- **Forms (React Hook Form + Zod)**: Implemented Zod schemas for forms validation to guarantee runtime correctness and immediate client-side error indicators before fetching.
- **Tailwind CSS v4 & Theme Switcher**: Tailwind CSS v4 defines configurations directly inside the `@theme` css context, which we utilized to build custom-themed shadcn/ui properties for light and dark classes.

---

## Getting Started

### 1. Environment Setup

Create a `.env.local` file at the root of the project:

```env
NEXT_PUBLIC_API_BASE_URL=https://xpcc.devb.zeak.io
```

A template is also available in `.env.example`.

### 2. Installation

Install project dependencies using `pnpm`:

```bash
pnpm install
```

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build for Production

To check compilation and build the optimized production package:

```bash
pnpm build
pnpm start
```

---

## Running with Docker

You can run the application inside a container using Docker Compose:

```bash
# Build and run container
docker-compose up --build

# Open browser at http://localhost:3000
```

---

## Testing

The test suite is built using **Vitest** and **React Testing Library** to mock API calls and verify DOM rendering.

Run all tests:

```bash
pnpm test
```

---

## Directory Structure

```text
src/
├── app/                  # Next.js pages, layouts, and route definitions
├── components/           # Shared interface elements (AuthForm, ResultCard, etc.)
├── hooks/                # Custom React hooks (useAuthGuard)
├── lib/                  # Helper utilities (api client, zod validation schemas)
├── stores/               # Zustand state stores (authStore, mealStore)
└── types/                # Shared TypeScript definitions
```

---

## Key Page Flow Diagrams

- **Root (/)**: Redirects to `/dashboard` if authenticated; redirects to `/login` if unauthenticated.
- **Login (/login) & Register (/register)**: Authentication views rendering the `AuthForm`. If already logged in, redirects to `/dashboard` immediately.
- **Dashboard (/dashboard)**: Shows greeting, profile details, and recent search logs.
- **Lookup (/calories)**: Main utility form allowing users to look up calorie values and inspect detailed report breakdowns.

---

## Deployment & URLs

- **Hosted URL**: [https://xpcc-calorie-generator.vercel.app](https://xpcc-calorie-generator.vercel.app) *(Placeholder)*
