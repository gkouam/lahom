-- Migration: events_rsvp_response_capacity
-- Adds three-state RSVP responses, RSVP updatedAt tracking, and optional event capacity.
-- Verified pre-migration: Rsvp has 0 rows, so the response/updatedAt backfill is structural.
-- The DEFAULT CURRENT_TIMESTAMP on updatedAt backfills any existing rows only; ongoing
-- updates are written by Prisma's @updatedAt at the application layer (no DB trigger).

CREATE TYPE "RsvpResponse" AS ENUM ('GOING', 'MAYBE', 'NOT_GOING');

ALTER TABLE "Rsvp" ADD COLUMN "response" "RsvpResponse" NOT NULL DEFAULT 'GOING';
ALTER TABLE "Rsvp" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "Event" ADD COLUMN "capacity" INTEGER;

-- Allow FR-only events (matches the meeting-notes nullable-title model). Existing
-- events all have non-null titles, so this is a safe constraint relaxation.
ALTER TABLE "Event" ALTER COLUMN "title" DROP NOT NULL;
