-- Migration: member_space_permissions
-- Adds capability-based permission system, financial tracking, meeting notes
-- IMPORTANT: This migration changes the Role enum (ADMIN → SUPER_ADMIN)

-- ============================================================
-- 1) ROLE ENUM CHANGE: ADMIN → SUPER_ADMIN
--    Postgres cannot drop an in-use enum value, so we rebuild it.
-- ============================================================

-- Step 1: Move all ADMIN users to MEMBER (so no rows reference ADMIN)
UPDATE "User" SET "role" = 'MEMBER' WHERE "role" = 'ADMIN';

-- Step 2: Create new enum without ADMIN, with SUPER_ADMIN
CREATE TYPE "Role_new" AS ENUM ('MEMBER', 'SUPER_ADMIN');

-- Step 3: Swap the column to the new enum
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'MEMBER';

-- Step 4: Drop old enum, rename new one
DROP TYPE "Role";
ALTER TYPE "Role_new" RENAME TO "Role";

-- Step 5: Promote the real admin to SUPER_ADMIN
UPDATE "User" SET "role" = 'SUPER_ADMIN' WHERE "email" = 'admin@baham-dallas.org';

-- ============================================================
-- 2) NEW ENUMS
-- ============================================================

CREATE TYPE "Permission" AS ENUM (
  'MANAGE_MEMBERS',
  'VIEW_MEMBERS',
  'MANAGE_FINANCES',
  'MANAGE_MEETINGS',
  'MANAGE_EVENTS',
  'MANAGE_PERMISSIONS'
);

CREATE TYPE "FinancialStanding" AS ENUM (
  'NEW',
  'GOOD_STANDING',
  'BEHIND',
  'EXEMPT'
);

-- ============================================================
-- 3) USER TABLE — add officerTitle column
-- ============================================================

ALTER TABLE "User" ADD COLUMN "officerTitle" TEXT;

-- ============================================================
-- 4) USER PERMISSION JOIN TABLE
-- ============================================================

CREATE TABLE "UserPermission" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "permission" "Permission" NOT NULL,
  "grantedById" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserPermission_userId_permission_key" ON "UserPermission"("userId", "permission");
CREATE INDEX "UserPermission_userId_idx" ON "UserPermission"("userId");

ALTER TABLE "UserPermission"
  ADD CONSTRAINT "UserPermission_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserPermission"
  ADD CONSTRAINT "UserPermission_grantedById_fkey"
  FOREIGN KEY ("grantedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================================
-- 5) MEMBER FINANCIAL STATUS (one per user)
-- ============================================================

CREATE TABLE "MemberFinancialStatus" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "standing" "FinancialStanding" NOT NULL DEFAULT 'NEW',
  "totalContributed" DECIMAL(10,2) NOT NULL DEFAULT 0,
  "notes" TEXT,
  "lastUpdatedById" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "MemberFinancialStatus_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MemberFinancialStatus_userId_key" ON "MemberFinancialStatus"("userId");
CREATE INDEX "MemberFinancialStatus_standing_idx" ON "MemberFinancialStatus"("standing");

ALTER TABLE "MemberFinancialStatus"
  ADD CONSTRAINT "MemberFinancialStatus_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MemberFinancialStatus"
  ADD CONSTRAINT "MemberFinancialStatus_lastUpdatedById_fkey"
  FOREIGN KEY ("lastUpdatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================================
-- 6) CONTRIBUTION LEDGER (many per user)
-- ============================================================

CREATE TABLE "Contribution" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "amount" DECIMAL(10,2) NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "method" TEXT,
  "description" TEXT,
  "recordedById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Contribution_userId_date_idx" ON "Contribution"("userId", "date");

ALTER TABLE "Contribution"
  ADD CONSTRAINT "Contribution_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Contribution"
  ADD CONSTRAINT "Contribution_recordedById_fkey"
  FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================
-- 7) MEETING NOTES
-- ============================================================

CREATE TABLE "MeetingNote" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "titleFr" TEXT,
  "body" TEXT NOT NULL,
  "bodyFr" TEXT,
  "date" TIMESTAMP(3) NOT NULL,
  "authorId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "MeetingNote_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "MeetingNote_date_idx" ON "MeetingNote"("date");

ALTER TABLE "MeetingNote"
  ADD CONSTRAINT "MeetingNote_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

