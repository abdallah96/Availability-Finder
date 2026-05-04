import cors from "cors";
import express from "express";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { calendarEvents, people } from "./data/calendarSeed";
import { findAvailability } from "./services/availability";
import type { AvailabilityRequest, PersonId } from "../shared/types";

const app = express();
const port = Number(process.env.PORT ?? 5174);
const isProduction = process.env.NODE_ENV === "production";

app.use(cors({ origin: isProduction ? false : "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.get("/api/people", (_request, response) => {
  response.json(people);
});

app.get("/api/events", (_request, response) => {
  response.json(calendarEvents);
});

app.post("/api/availability", (request, response) => {
  const parsed = parseAvailabilityRequest(request.body);
  if (!parsed.ok) {
    response.status(400).json({ message: parsed.message });
    return;
  }

  response.json(findAvailability(parsed.value));
});

if (isProduction) {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const clientDist = resolve(currentDir, "../../dist/client");
  app.use(express.static(clientDist));
  app.get(/.*/, (_request, response) => {
    response.sendFile(resolve(clientDist, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Availability API listening on http://localhost:${port}`);
});

function parseAvailabilityRequest(body: unknown): { ok: true; value: AvailabilityRequest } | { ok: false; message: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Request body must be an object." };
  }

  const { personIds, durationMinutes } = body as Partial<AvailabilityRequest>;
  const validPersonIds = new Set(people.map((person) => person.id));

  if (!Array.isArray(personIds) || personIds.length === 0) {
    return { ok: false, message: "Choose at least one person." };
  }

  if (!personIds.every((id): id is PersonId => typeof id === "string" && validPersonIds.has(id as PersonId))) {
    return { ok: false, message: "Person list contains an unknown person." };
  }

  if (typeof durationMinutes !== "number" || !Number.isInteger(durationMinutes) || durationMinutes < 15 || durationMinutes > 240) {
    return { ok: false, message: "Duration must be between 15 and 240 minutes." };
  }

  return { ok: true, value: { personIds, durationMinutes } };
}
