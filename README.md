# Tenhil Availability Finder

A small full stack TypeScript app that finds possible meeting slots from messy calendar input.

## Stack

- React + Vite frontend
- Express backend
- Shared TypeScript types and time helpers
- Vitest coverage for the availability engine

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Scripts

```bash
npm run dev        # Vite frontend + Express API
npm run test       # availability service tests
npm run typecheck  # TypeScript checks
npm run build      # typecheck + frontend production build
npm start          # serve the production build through Express
```

## Scope And Assumptions

The app keeps the assignment intentionally small:

- One-day schedule only.
- Local `HH:mm` times.
- Seed data is stored in memory.
- Recurring events are ignored.
- Meeting starts are generated every 15 minutes.
- Events outside a person's working hours are clipped to that person's workday.
- Overlapping or touching busy events are merged before free time is calculated.
- Invalid events are ignored and reported in the UI.

## Messy Input Handling

The seed data includes out-of-order events, overlaps, missing optional titles, a missing end time, invalid clock values and an event whose start is after its end. The backend validates those events before searching, returns usable slots, and sends the ignored event list back to the client.

## Project Shape

```text
src/
  client/   React UI, components, API client
  server/   Express API, seed data, availability service
  shared/   Types and time utilities used by both sides
```
# Availability-Finder
