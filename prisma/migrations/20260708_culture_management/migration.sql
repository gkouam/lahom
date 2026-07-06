-- Migration: culture_management
-- Adds the CultureItem table (admin-managed landing culture showcase;
-- url points at existing /images/* files or Vercel Blob). Gated by the
-- existing MANAGE_GALLERY permission — no enum change.

CREATE TABLE "CultureItem" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "tagFr" TEXT,
    "title" TEXT NOT NULL,
    "titleFr" TEXT,
    "description" TEXT NOT NULL,
    "descriptionFr" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CultureItem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CultureItem_published_sortOrder_idx" ON "CultureItem"("published", "sortOrder");
