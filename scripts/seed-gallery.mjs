// Seeds the GalleryImage table with the original hardcoded landing-page
// photos (pointing at the repo's /images/* files). Idempotent: exits if the
// table already has rows. Run: node scripts/seed-gallery.mjs (DATABASE_URL set).
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const items = [
  { url: '/images/bamileke-zing-dance.jpg', label: 'Zing Dance Ceremony', labelFr: 'Cérémonie de Danse Zing', caption: 'Traditional Bamiléké Zing Dance Ceremony', captionFr: 'Cérémonie traditionnelle de danse Zing Bamiléké', span: 'tall', sortOrder: 1 },
  { url: '/images/baham-museum-architecture.jpg', label: 'Royal Museum', labelFr: 'Musée Royal', caption: 'Royal Museum of Baham — Grassfields Architecture', captionFr: 'Musée Royal de Baham — Architecture des Grassfields', span: null, sortOrder: 2 },
  { url: '/images/dallas-skyline.jpg', label: 'Dallas, Texas', labelFr: 'Dallas, Texas', caption: 'Dallas, Texas — Our American Home', captionFr: 'Dallas, Texas — Notre Foyer Américain', span: null, sortOrder: 3 },
  { url: '/images/bamileke-dressing.jpg', label: 'Traditional Attire', labelFr: 'Tenue Traditionnelle', caption: 'Young men in traditional Bamiléké attire', captionFr: 'Jeunes hommes en tenue traditionnelle Bamiléké', span: null, sortOrder: 4 },
  { url: '/images/baham-museum-interior.jpg', label: 'Sacred Artifacts', labelFr: 'Objets Sacrés', caption: 'Inside the Royal Museum of Baham — Sacred Sculptures', captionFr: 'À l\'intérieur du Musée Royal de Baham — Sculptures Sacrées', span: 'wide', sortOrder: 5 },
]

const existing = await prisma.galleryImage.count()
if (existing > 0) {
  console.log(`GalleryImage already has ${existing} rows — skipping seed.`)
} else {
  await prisma.galleryImage.createMany({ data: items })
  console.log(`Seeded ${items.length} gallery images.`)
}
await prisma.$disconnect()
