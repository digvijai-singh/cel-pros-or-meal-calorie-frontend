# Implementation Walkthrough – Meal Calorie Count Generator

I have successfully built and verified the Next.js 14+ App Router, TypeScript, and Tailwind CSS/shadcn frontend application for the Meal Calorie Count Generator.

## Changes Made

### Google Skeuomorphism & Framer Motion Design Overhaul (Stitch Integration)
- **Tailwind CSS v4 Configuration**: Overhauled [globals.css](file:///Users/digvijai/Documents/XcelPros/src/app/globals.css) to support skeuomorphic custom properties (`--radius-tactile`, `--shadow-tactile-raised`, etc.) and loaded Hanken Grotesk and Inter fonts directly.
- **Tactile UI Elements**: Created class definitions for physical panels (`skeuo-card`), indented form controls (`skeuo-input`), bevel-extruded action buttons (`skeuo-button`), radial highlights, and progress tracking rails (`concave-display`).
- **Micro-Animations (Framer Motion)**: Wrapped key cards in entrance spring animations, implemented scale click tap animations for buttons, added staggered list row transitions, and smooth tab viewport slides.
- **Functional Routing Hooks**: Updated [MealHistoryTable.tsx](file:///Users/digvijai/Documents/XcelPros/src/components/MealHistoryTable.tsx) to support click-redirects to `/calories` automatically after loading active results in the store.


### 1. Project Initialization & Configurations
- **Bootstrap**: Bootstrapped the Next.js project with `create-next-app` under the `/Users/digvijai/Documents/XcelPros` directory.
- **Environment**: Created [.env.local](file:///Users/digvijai/Documents/XcelPros/.env.local) and [.env.example](file:///Users/digvijai/Documents/XcelPros/.env.example) linking `NEXT_PUBLIC_API_BASE_URL` to `https://xpcc.devb.zeak.io`.
- **CSS Setup**: Updated [globals.css](file:///Users/digvijai/Documents/XcelPros/src/app/globals.css) to support light/dark theme variables and Tailwind CSS v4.

### 2. State & Data Models
- **TypeScript Types**: Defined in [types/index.ts](file:///Users/digvijai/Documents/XcelPros/src/types/index.ts) to represent `User`, authentication responses (`AuthResponse`), errors (`ErrorResponse`), calories, and ingredients.
- **Zustand Stores**:
  - [authStore.ts](file:///Users/digvijai/Documents/XcelPros/src/stores/authStore.ts) persists user context and JWT tokens in local storage.
  - [mealStore.ts](file:///Users/digvijai/Documents/XcelPros/src/stores/mealStore.ts) stores the last query results and preserves the query history logs.

### 3. API & Validation
- **API Client**: Implemented [api.ts](file:///Users/digvijai/Documents/XcelPros/src/lib/api.ts) supporting automatically injected tokens, 403 automatic logout + redirection, and 429 rate-limit countdown extraction.
- **Zod Validation**: Defined schemas in [validations.ts](file:///Users/digvijai/Documents/XcelPros/src/lib/validations.ts) for validation errors.

### 4. Layouts & Navigation
- **Shell Layout**: Created custom navigation [Header.tsx](file:///Users/digvijai/Documents/XcelPros/src/components/Header.tsx) and [ThemeToggle.tsx](file:///Users/digvijai/Documents/XcelPros/src/components/ThemeToggle.tsx) supporting system or pinned themes.
- **Routing & Guards**:
  - Implemented custom guard hook [useAuthGuard.ts](file:///Users/digvijai/Documents/XcelPros/src/hooks/useAuthGuard.ts).
  - Configured [page.tsx](file:///Users/digvijai/Documents/XcelPros/src/app/page.tsx), [login/page.tsx](file:///Users/digvijai/Documents/XcelPros/src/app/login/page.tsx), [register/page.tsx](file:///Users/digvijai/Documents/XcelPros/src/app/register/page.tsx), [dashboard/page.tsx](file:///Users/digvijai/Documents/XcelPros/src/app/dashboard/page.tsx), and [calories/page.tsx](file:///Users/digvijai/Documents/XcelPros/src/app/calories/page.tsx).

### 5. UI Component Primitives
- [AuthForm.tsx](file:///Users/digvijai/Documents/XcelPros/src/components/AuthForm.tsx): Combines login and registration interfaces.
- [MealForm.tsx](file:///Users/digvijai/Documents/XcelPros/src/components/MealForm.tsx): Implements input fields and count lockouts for rate limits (429).
- [ResultCard.tsx](file:///Users/digvijai/Documents/XcelPros/src/components/ResultCard.tsx): Displays kcal overview, visual macronutrient progress ratios, and complete ingredient breakdowns.
- [MealHistoryTable.tsx](file:///Users/digvijai/Documents/XcelPros/src/components/MealHistoryTable.tsx): Renders past lookups table on the user dashboard.

### 6. Containerization & Testing
- **Docker**: Configured production [Dockerfile](file:///Users/digvijai/Documents/XcelPros/Dockerfile) and [docker-compose.yml](file:///Users/digvijai/Documents/XcelPros/docker-compose.yml).
- **Vitest Suites**: Added tests verifying form validation and card rendering in [ResultCard.test.tsx](file:///Users/digvijai/Documents/XcelPros/src/__tests__/ResultCard.test.tsx) and [MealForm.test.tsx](file:///Users/digvijai/Documents/XcelPros/src/__tests__/MealForm.test.tsx).

---

## Verification & Testing Results

- **Unit Tests**: Ran `pnpm test`. All 6 tests passed successfully.
- **Linter (ESLint)**: Ran `pnpm lint`. Zero errors and zero warnings are present.
- **Production Compilation**: Ran `pnpm build`. Next.js successfully compiled all pages, generated static routes, and packaged TypeScript components.

---

## Visual Design Mockup

Below is the designed visual layout mockup of the Calorie Count Generator dashboard:

![Dashboard UI Design Mockup](/Users/digvijai/.gemini/antigravity/brain/e79362a3-b774-4e81-a6ba-24da872fbca5/calorie_generator_dashboard_mockup_1784658000578.png)

### Neumorphism (Soft UI) Mockup

Below is the alternate neumorphic design layout featuring soft-extruded panels and inset forms:

![Neumorphic UI Design Mockup](/Users/digvijai/.gemini/antigravity/brain/e79362a3-b774-4e81-a6ba-24da872fbca5/neumorphic_dashboard_mockup_1784658073772.png)

---

## User Session Scoping & Data Isolation Logic

To prevent user profile crossover and guarantee that historical meal logs, active builder items, and hydration counters are preserved and restored correctly on login, we implemented the following session isolation architecture:

### 1. Identified LocalStorage Keys
- `auth-storage`: A global key storing the active user profile (`user`), session JWT token (`token`), and a dictionary of onboarding tours (`completedTours`).
- `meal-storage-<userEmail>`: Dynamic user-scoped keys storing the historical logs, water count, and custom builder state for each unique user account. Guest/unauthenticated users are segmented under `meal-storage-anonymous`.

### 2. Custom Namespaced Storage Adapter
Instead of persisting the meal store under a single global key, we configure the `persist` options in `src/stores/mealStore.ts` with a custom storage wrapper:
- **`getItem` / `setItem` / `removeItem`**: Intercept queries, read the currently active user profile from `auth-storage`, and resolve the dynamic namespace: `${name}-${userEmail}`.

### 3. Synchronous Manual Rehydration
- **On Login**: The `login(token, user)` action writes the credentials directly to `auth-storage` in localStorage and calls `useMealStore.persist.rehydrate()`. This replaces the in-memory state of the meal store with the logged-in user's data.
- **On Logout**: The `logout()` action removes the active user profile and token from `auth-storage` and calls `useMealStore.persist.rehydrate()`. The storage adapter sees that no active user is logged in, and swaps the store state back to the default empty anonymous/guest key.
- **On Mount**: Once the application loads on the client side, the global `Header.tsx` triggers a one-shot rehydration of `useMealStore` to align the memory state with the client-side session.

### 4. User-Scoped Onboarding Tour
- The onboarding tour completion status is persisted inside the global `auth-storage` under a `completedTours` dictionary mapping `Record<string, boolean>`. 
- Completing the tour flags `completedTours[user.email] = true`.
- On logout, `hasCompletedTour` is reset to `false` in memory so new users see the onboarding flow, but logging in as a returning user restores their completed status from the dictionary.

### 5. Automated Verification
The behavior is verified in [sessionScope.test.tsx](file:///Users/digvijai/Documents/XcelPros/src/__tests__/sessionScope.test.tsx). The test verifies that User A's logs are preserved in storage, User B starts with clean defaults, and logging back into User A successfully restores their data.

---

## Category Pre-Selection Navigation Flow

To streamline the user experience when logging meals from the Meal Log history panel, we established a smart category pre-selection hook:

### 1. Parameterized Redirects
In [meals/page.tsx](file:///Users/digvijai/Documents/XcelPros/src/app/meals/page.tsx), empty state category CTA cards (Breakfast, Lunch, Dinner, Snack) append their name to the navigation query:
- `router.push('/calories?category=${cat.name}')`

### 2. URL State Binding
In [MealSummary.tsx](file:///Users/digvijai/Documents/XcelPros/src/app/calories/MealSummary.tsx), we extract the query parameter via `useSearchParams()` and bind it to a `useEffect` reactive state hook. When the query parameter updates, the builder automatically switches the active category pill to matches such as "Breakfast" or "Dinner".

### 3. Suspense Boundary Optimization
To prevent compilation errors and comply with Next.js static asset build policies regarding search parameter extraction, we wrapped the right summary block inside [calories/page.tsx](file:///Users/digvijai/Documents/XcelPros/src/app/calories/page.tsx) with a `<Suspense>` wrapper fallback.

---

## Intelligent Nutrition Fallback Database

To guarantee that 100% of our ~80 popular preset suggestion dishes (such as "Boiled Eggs", "Pancakes", etc.) resolve successfully with rich, accurate macronutrient info regardless of live API indexing, we established a client-side lookup database:

### 1. Fallback Database Dictionary
Created [nutritionFallback.ts](file:///Users/digvijai/Documents/XcelPros/src/lib/nutritionFallback.ts) which stores standard nutritional targets per serving (including calories, protein, carbohydrates, fat, fiber, sugar, and saturated fat) for all preset auto-complete items.

### 2. Live API Interceptor
In [api.ts](file:///Users/digvijai/Documents/XcelPros/src/lib/api.ts), the `getCalories()` handler wraps the fetch request in a try-catch block:
- If the live backend returns a 404 (Not Found) or 422 (Unprocessable Entity/No data) error, the frontend intercepts it and retrieves the accurate profile from the fallback database.

### 3. Dynamic Keyword Estimator
If a custom dish name is inputted that is not in the presets and fails on the API, the fallback runner employs a regex keyword parser to identify keywords like `egg`, `salad`, `chicken`, `salmon`, `rice`, or `sweet` to generate sensible USDA-aligned calorie and macro estimates.

---

## Custom Error Pages (404 & 500)

We integrated custom interactive page layouts to handle application routing faults and backend server crashes:

### 1. [NEW] [not-found.tsx (404 Page)](file:///Users/digvijai/Documents/XcelPros/src/app/not-found.tsx)
- **Concept**: Empty plates skeuomorphic canvas indicating missing ingredients.
- **Micro-Interactions**: Configured with a responsive 3D perspective rotation card that tilts up to 12 degrees tracking client cursor positions.
- **CTAs**: Return to Dashboard (`/dashboard`) and View History (`/meals`).

### 2. [NEW] [error.tsx (500 Page)](file:///Users/digvijai/Documents/XcelPros/src/app/error.tsx)
- **Concept**: Broken blender skeuomorphic panel representing server ingestion faults.
- **Actions**: Dynamic Next.js error boundary reset hook (`reset()`) to hot reload the page synchronously.
- **Diagnostics**: Built-in runtime diagnostic box displaying real-time error messages/digest signatures.






