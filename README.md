# Availability Finder

Small full-stack TypeScript app for finding common meeting slots from messy calendar data.

Live: https://availability-finder-demo.vercel.app/  
Repo: https://github.com/abdallah96/Availability-Finder

## What it does

- Shows people and their events
- Lets you select attendees
- Lets you choose meeting duration
- Returns time slots where everyone selected is free

## Tech

- Frontend: React + Vite + TypeScript
- Backend: Express + TypeScript
- Shared types/helpers in `src/shared`
- Tests: Vitest (availability logic)

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Scripts

```bash
npm run dev
npm run test
npm run typecheck
npm run build
npm start
```

## Assumptions

- One day only
- Local `HH:mm` times
- 15-minute step for slot generation
- No recurring events
- Seed data is in memory

## How messy input is handled

I intentionally included messy events in seed data (out of order, overlap, missing fields, invalid times).

Current behavior:

- Invalid events are ignored for matching
- Ignored events are returned in the API response and shown in UI
- Overlapping/touching busy ranges are merged
- Each person uses their own working hours

## Notes

I kept scope small on purpose and focused on clean structure and correctness of the matching logic.

Recent UI polish:

- Clearer empty states when nothing is selected
- Centered app title and improved header
- Distinct color per person
- Startup loader text underline animation
