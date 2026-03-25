# Meeting Calendar

A recurring meeting schedule viewer and editor. Manage clients, categories, people, and meetings — then view them on a weekly calendar grid. All data is stored locally in the browser with no backend required.

![Meeting Calendar Logo](public/logo-32.png)

---

## Features

- **Weekly calendar view** — meetings displayed as color-coded blocks on a Mon–Fri grid with overlap handling
- **Meeting editor** — full CRUD for meetings with title, days, cadence, category, time, attendees, meeting link, and notes
- **Multi-client support** — create, rename, and delete named clients; each has isolated data
- **Categories** — define color-coded categories with a color picker and randomizer
- **People roster** — maintain an attendee list with name and role; used as a multi-select in the meeting form
- **Attendee filter** — filter the calendar and meetings list by a single attendee
- **Import / Export** — export client data as JSON; import with replace or merge options
- **Modals** — all confirmations, prompts, and alerts use Flowbite React modals (no browser dialogs)
- **Print support** — landscape print layout with toolbar hidden
- **Light-only UI** — no dark mode

---

## Stack

| Layer      | Technology                 |
| ---------- | -------------------------- |
| Framework  | Next.js 16 (App Router)    |
| Language   | TypeScript 6               |
| UI Library | React 19                   |
| Styling    | Tailwind CSS v4            |
| Components | Flowbite React             |
| Icons      | react-icons (Heroicons v2) |
| Storage    | Browser localStorage       |

---

## Routes

| Route     | Description                                                       |
| --------- | ----------------------------------------------------------------- |
| `/`       | Calendar view — weekly grid + meetings list                       |
| `/editor` | Meeting editor — manage clients, categories, people, and meetings |

---

## Project Structure

```
src/
  app/
    page.tsx                    # Calendar view (/)
    editor/
      page.tsx                  # Meeting editor (/editor)
    layout.tsx                  # Root layout — fonts, metadata, favicon
    globals.css                 # Tailwind v4 theme tokens, print styles
  components/
    AppHeader.tsx               # Sticky header — logo, client selector, toolbar slot
    ClientDropdown.tsx          # Client switcher dropdown (create/rename/delete in editor)
    AttendeeFilterDropdown.tsx  # Filter calendar by attendee
    CalendarGrid.tsx            # Week-view grid with time gutter and meeting blocks
    MeetingBlock.tsx            # Positioned meeting block with overlap layout
    MeetingsList.tsx            # Detail table below calendar
    Legend.tsx                  # Category color + cadence key
    EmptyState.tsx              # Empty calendar state with link to editor
    MeetingForm.tsx             # Add/edit meeting form
    MeetingsTable.tsx           # Filterable meetings table with edit/delete
    CategoryManager.tsx         # Collapsible category manager with color picker
    PeopleManager.tsx           # Collapsible people roster manager
    AttendeeMultiSelect.tsx     # Custom multi-select with search and ad-hoc entry
    DataModal.tsx               # Export / Import / Clear data modal
    AlertModal.tsx              # Flowbite alert dialog
    ConfirmModal.tsx            # Flowbite confirm dialog with optional danger styling
    PromptModal.tsx             # Flowbite prompt dialog with pre-filled text input
  lib/
    types.ts                    # Shared TypeScript types and constants
    storage.ts                  # localStorage helpers (SSR-guarded)
    utils.ts                    # Formatting, overlap layout algorithm, color helpers
    modalTheme.ts               # Flowbite Modal light-mode theme override
public/
  logo.svg                      # App logo SVG
  logo-32.png                   # 32px PNG export of logo
```

---

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other commands

```bash
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

---

## Data Storage

All data is persisted in `localStorage` with no server or database. Each client gets its own namespaced key:

| Key                        | Contents                                         |
| -------------------------- | ------------------------------------------------ |
| `meeting_calendar:clients` | Ordered list of client names                     |
| `meeting_calendar:active`  | Currently selected client name                   |
| `meeting_calendar:{name}`  | Meetings, categories, and people for that client |

Data can be exported as JSON and re-imported into any client (replace or merge).

---

## Path Aliases

`@/*` maps to the repo root. For example:

```ts
import { Meeting } from "@/src/lib/types";
```

---

## Color Palette

| Token        | Hex       | Usage                           |
| ------------ | --------- | ------------------------------- |
| `app-blue`   | `#17A7DA` | Primary actions, highlights     |
| `app-navy`   | `#11395B` | Header background, hover states |
| `app-dark`   | `#0D253A` | Body text                       |
| `app-gray`   | `#FBF9F6` | Page background                 |
| `app-border` | `#D4E7ED` | Borders, dividers               |
| `app-light`  | `#EAF6FB` | Subtle backgrounds              |
| `app-muted`  | `#7BB3C5` | Secondary text, icons           |
