-- Migration: gallery_management
-- Adds the MANAGE_GALLERY permission and the GalleryImage table (admin-managed
-- landing gallery; url points at existing /images/* files or Vercel Blob).

ALTER TYPE "Permission" ADD VALUE 'MANAGE_GALLERY';

CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "labelFr" TEXT,
    "caption" TEXT NOT NULL,
    "captionFr" TEXT,
    "span" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "GalleryImage_published_sortOrder_idx" ON "GalleryImage"("published", "sortOrder");
