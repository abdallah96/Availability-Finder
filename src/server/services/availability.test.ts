import { describe, expect, it } from "vitest";
import { findAvailability } from "./availability";

describe("findAvailability", () => {
  it("returns shared slots for all selected people", () => {
    const result = findAvailability({
      personIds: ["greta", "abdallah", "habib", "leon", "timmo"],
      durationMinutes: 45
    });

    expect(result.slots.map((slot) => slot.label)).toContain("12:45 - 13:30");
    expect(result.slots.every((slot) => slot.start >= "11:00" && slot.end <= "15:30")).toBe(true);
  });

  it("reports invalid events instead of failing the search", () => {
    const result = findAvailability({
      personIds: ["greta", "habib", "leon"],
      durationMinutes: 30
    });

    expect(result.ignoredEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ eventId: "evt-9" }),
        expect.objectContaining({ eventId: "evt-12" }),
        expect.objectContaining({ eventId: "evt-16" })
      ])
    );
  });

  it("returns no slots for invalid durations", () => {
    const result = findAvailability({
      personIds: ["greta"],
      durationMinutes: 0
    });

    expect(result.slots).toEqual([]);
  });
});
