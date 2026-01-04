# Events Page - Component Structure

## Overview

The events page has been refactored into smaller, reusable components for easier maintenance and debugging.

## Directory Structure

```
app/events/
├── events-page.tsx              # Original file (keep as backup)
├── events-page-refactored.tsx   # New refactored main page (170 lines vs 1000+)
└── components/
    ├── index.ts                 # Central export file
    ├── types.ts                 # TypeScript interfaces
    ├── graphql.ts               # GraphQL queries
    ├── utils.ts                 # Utility functions
    ├── EventHeader.tsx          # Top navigation & filters
    ├── MiniCalendar.tsx         # Sidebar mini calendar
    ├── NextEventCard.tsx        # Next event preview card
    ├── EventCategories.tsx      # Category legend
    ├── EventStats.tsx           # Event statistics panel
    ├── EventsList.tsx           # Upcoming events list
    ├── EventCard.tsx            # Individual event card
    ├── WeekView.tsx             # Week calendar view
    ├── DayView.tsx              # Day calendar view (placeholder)
    ├── MonthView.tsx            # Month calendar view (placeholder)
    └── CreateEventModal.tsx     # Event creation modal
```

## Components

### Core Files

#### `types.ts`

- `EmbassyEvent` - GraphQL event data interface
- `CalendarEvent` - Calendar display format interface
- `ViewType` - "month" | "week" | "day"
- `FilterType` - "all" | "my-embassy"

#### `graphql.ts`

- `GET_EMBASSY_EVENTS` - GraphQL query for fetching events

#### `utils.ts`

Utility functions:

- `categoryColors` - Color mapping for event categories
- `convertToCalendarEvents()` - Transform EmbassyEvent to CalendarEvent
- `getWeekDates()` - Calculate week dates array
- `monthNames` - Month names array
- `getTopPosition()` - Calculate event vertical position by time
- `getEventHeight()` - Calculate event height by duration
- `isToday()` - Check if date is today

### UI Components

#### `EventHeader.tsx`

Top navigation bar with:

- Month/Year display
- Event filter buttons (All Events / My Embassy Events)
- Refresh button
- View toggle (Month/Week/Day)
- Date navigation (Prev/Today/Next)

**Props:**

```typescript
{
  currentDate: Date;
  view: ViewType;
  setView: (view: ViewType) => void;
  eventFilter: FilterType;
  setEventFilter: (filter: FilterType) => void;
  loading: boolean;
  onRefresh: () => void;
  onNavigate: (direction: "prev" | "next") => void;
  onToday: () => void;
}
```

#### `MiniCalendar.tsx`

Small month calendar in left sidebar

**Props:**

```typescript
{
  currentDate: Date;
}
```

#### `NextEventCard.tsx`

Displays the next upcoming event

**Props:**

```typescript
{
  event: EmbassyEvent;
}
```

#### `EventCategories.tsx`

Shows color-coded event categories (no props)

#### `EventStats.tsx`

Display event statistics

**Props:**

```typescript
{
  events: EmbassyEvent[];
}
```

#### `EventsList.tsx`

Scrollable list of upcoming events

**Props:**

```typescript
{
  events: EmbassyEvent[];
}
```

#### `EventCard.tsx`

Individual event card displayed on calendar

**Props:**

```typescript
{
  event: CalendarEvent;
  style: React.CSSProperties;
}
```

#### `WeekView.tsx`

7-day week calendar with time grid

**Props:**

```typescript
{
  events: CalendarEvent[];
  weekDates: Date[];
}
```

Features:

- Dynamic event filtering by date
- Automatic positioning based on start/end time
- Staggered layout for multiple events
- Empty state for days without events

#### `DayView.tsx` & `MonthView.tsx`

Placeholders for future implementation

**Props:**

```typescript
{
  events: CalendarEvent[];
  date: Date;
}
```

#### `CreateEventModal.tsx`

DaisyUI modal for creating new events

**Props:**

```typescript
{
  onEventCreated: () => void;
}
```

Features:

- Form validation
- File upload for cover image
- API integration
- Success/error states
- Auto-refresh on success

## Main Page (`events-page-refactored.tsx`)

### State Management

```typescript
const [currentDate, setCurrentDate] = useState(new Date());
const [view, setView] = useState<ViewType>("day");
const [eventFilter, setEventFilter] = useState<FilterType>("all");
const [embassyEvents, setEmbassyEvents] = useState<EmbassyEvent[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### Key Functions

- `fetchEvents()` - Fetch events from GraphQL
- `navigateMonth()` - Navigate months
- `navigateWeek()` - Navigate weeks
- `handleNavigate()` - Unified navigation handler
- `goToToday()` - Jump to today

### Layout

```
┌─────────────────────────────────────────────────────────┐
│ EventHeader (filters, view toggle, navigation)         │
├──────────┬────────────────────────────────┬──────────── ┤
│ Sidebar  │ Main Calendar View             │ Right Panel │
│          │                                │             │
│ Mini Cal │ Week/Day/Month View            │ Create Btn  │
│ Next Evt │                                │ Stats       │
│ Category │                                │ Event List  │
└──────────┴────────────────────────────────┴─────────────┘
```

## Migration Guide

### To use the refactored version:

1. **Rename files:**

   ```bash
   mv events-page.tsx events-page-old.tsx
   mv events-page-refactored.tsx events-page.tsx
   ```

2. **Or update imports in your routing:**

   ```typescript
   // Instead of:
   import EventsPage from "~/events/events-page";

   // Use:
   import EventsPage from "~/events/events-page-refactored";
   ```

## Benefits

### Before (1044 lines)

- Single massive file
- Hard to debug
- Difficult to test individual pieces
- Mixed concerns

### After (170 lines main + 15 components)

- Modular & maintainable
- Easy to debug individual components
- Testable units
- Separated concerns
- Reusable components

## Next Steps

1. Implement `DayView` component
2. Implement `MonthView` component
3. Add event detail modal
4. Add event editing capability
5. Add event deletion
6. Add drag-and-drop rescheduling
7. Add filtering by category
8. Add search functionality

## Testing

Each component can be tested independently:

```typescript
import { WeekView } from "~/events/components";

// Test WeekView with mock data
const mockEvents = [...];
const mockWeekDates = [...];

<WeekView events={mockEvents} weekDates={mockWeekDates} />
```

## Notes

- All components use TypeScript for type safety
- Components follow React functional component pattern
- Proper type imports using `import type`
- Centralized exports via `index.ts`
- Maintains all original functionality
