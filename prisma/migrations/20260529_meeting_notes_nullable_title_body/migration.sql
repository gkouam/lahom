-- Migration: meeting_notes_nullable_title_body
-- Makes title and body nullable on MeetingNote to support FR-only notes.
-- No data exists in MeetingNote yet, so this is a safe constraint relaxation.

ALTER TABLE "MeetingNote" ALTER COLUMN "title" DROP NOT NULL;
ALTER TABLE "MeetingNote" ALTER COLUMN "body" DROP NOT NULL;
