# QR Menu - Implementation Plan

## Overview
Digital restaurant menu system with QR code scanning, supporting Arabic/English with RTL.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Prisma + SQLite
- next-intl (i18n)
- qrcode (QR generation)
- Vitest + Playwright (testing)
- Docker

---

## Phase 1: Initial Setup (Commits 1-4)

### Commit 1: `chore: initial setup`
- [x] Initialize Next.js 14 with TypeScript
- [x] Configure Tailwind CSS
- [x] Add shadcn/ui
- [x] Setup project structure
- [x] Add basic dependencies

### Commit 2: `chore: add LICENSE`
- [x] Add MIT License

### Commit 3: `chore: Docker config`
- [x] Create Dockerfile
- [x] Create docker-compose.yml
- [x] Create .dockerignore

### Commit 4: `chore: CI/CD pipeline`
- [x] Create GitHub Actions workflow
- [x] Setup Docker Hub push
- [x] Setup test automation

---

## Phase 2: Core Features (Commits 5-8)

### Commit 5: `feat: i18n (EN/AR)`
- [x] Setup next-intl
- [x] Create en.json and ar.json
- [x] Add locale middleware
- [x] RTL support

### Commit 6: `feat: Prisma schema`
- [x] Create Prisma schema (Restaurant, Category, Item)
- [x] Setup SQLite
- [x] Create seed data
- [x] Add db utility

### Commit 7: `feat: API endpoints`
- [x] GET /api/restaurants/[slug]
- [x] CRUD /api/categories
- [x] CRUD /api/items
- [x] GET /api/health

### Commit 8: `feat: image upload`
- [x] POST /api/upload
- [x] Local file storage
- [x] Image optimization with sharp

---

## Phase 3: UI (Commits 9-12)

### Commit 9: `feat: public menu view`
- [x] Menu page /menu/[slug]
- [x] MenuView component
- [x] CategoryTabs component
- [x] ItemCard component
- [x] Search functionality
- [x] Real-time price display

### Commit 10: `feat: admin dashboard`
- [x] Admin layout
- [x] Dashboard overview page
- [x] Stats cards

### Commit 11: `feat: item management`
- [x] Item list page
- [x] ItemForm (add/edit)
- [x] Category management
- [x] Image upload UI

### Commit 12: `feat: QR generator`
- [x] QR code page
- [x] Generate QR for menu URL
- [x] Download as PNG
- [x] Preview

---

## Phase 4: Polish (Commits 13-15)

### Commit 13: `feat: responsive + RTL`
- [x] Mobile-first responsive design
- [x] RTL layout for Arabic
- [x] Dark/Light mode toggle
- [x] Accessibility improvements

### Commit 14: `test: E2E tests`
- [x] Unit tests (Vitest)
- [x] E2E tests (Playwright)
- [x] API tests
- [x] Component tests

### Commit 15: `docs: README`
- [x] Complete README.md
- [x] Usage instructions
- [x] Screenshots
- [x] Contact info

---

## How Each Feature Works

### Public Menu Flow
1. Customer scans QR code
2. Redirects to `/menu/[restaurant-slug]`
3. Menu loads with categories and items
4. Customer can search, filter by category
5. Prices displayed in real-time

### Admin Flow
1. Admin visits `/admin`
2. Can add/edit/delete categories
3. Can add/edit/delete items with images
4. Can update prices (reflected instantly)
5. Can generate/download QR code

### QR Code Generation
1. Admin goes to `/admin/qr`
2. Selects restaurant
3. Generates QR pointing to `/menu/[slug]`
4. Downloads PNG for printing

---

## Database Schema

```
Restaurant (1) --> (N) Category (1) --> (N) Item
```

Each restaurant has unique slug for URL.
Categories and items are ordered by `order` field.
Soft delete via `isActive` / `isAvailable` flags.

---

## API Design

All APIs return JSON with consistent structure:
```json
{ "success": true, "data": {...} }
{ "success": false, "error": "message" }
```

---

## File Structure
```
src/
├── app/
│   ├── [locale]/           # i18n routes
│   │   ├── page.tsx        # Landing
│   │   ├── menu/[slug]/    # Public menu
│   │   └── admin/          # Admin pages
│   └── api/                # API routes
├── components/
│   ├── menu/               # Public menu components
│   ├── admin/              # Admin components
│   └── ui/                 # shadcn components
├── lib/                    # Utilities
├── prisma/                 # Database
└── messages/               # i18n translations
```

---

## Testing Strategy
- Unit: Test utilities and hooks
- Integration: Test API endpoints
- E2E: Test full user flows (view menu, admin CRUD)

---

## Commands
```bash
npm run dev      # Development
npm run build    # Production build
npm run test     # Run tests
npm run test:e2e # E2E tests
npm run lint     # Linting
```
