-- Keep payments and meeting notes when an account is deleted.
-- Before: deleting a user also deleted every contribution they had RECORDED for
-- other members, every meeting note and announcement they wrote, and their own
-- contributions. After: recorder/author links become empty instead, and a
-- member who has payments on record can't be deleted at all.
-- Additive and reversible: no rows are changed, only constraints and nullability.

BEGIN;

ALTER TABLE "Announcement" DROP CONSTRAINT "Announcement_authorId_fkey";
ALTER TABLE "Contribution" DROP CONSTRAINT "Contribution_recordedById_fkey";
ALTER TABLE "Contribution" DROP CONSTRAINT "Contribution_userId_fkey";
ALTER TABLE "MeetingNote" DROP CONSTRAINT "MeetingNote_authorId_fkey";

ALTER TABLE "Announcement" ALTER COLUMN "authorId" DROP NOT NULL;
ALTER TABLE "Contribution" ALTER COLUMN "recordedById" DROP NOT NULL;
ALTER TABLE "MeetingNote" ALTER COLUMN "authorId" DROP NOT NULL;

ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MeetingNote" ADD CONSTRAINT "MeetingNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT;
