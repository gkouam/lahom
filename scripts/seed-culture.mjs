// Seeds the CultureItem table with the original hardcoded culture showcase
// cards (pointing at repo /images/* files), with French translations.
// Idempotent: exits if the table already has rows.
// Run: node scripts/seed-culture.mjs (DATABASE_URL set).
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const items = [
  {
    url: '/images/dallas-museum-elephant-mask.jpg',
    tag: 'Sacred Dance', tagFr: 'Danse Sacrée',
    title: 'Elephant Mask Society', titleFr: 'Société du Masque Éléphant',
    description: 'The Kuosi elephant masks represent royal power, performed at funerals and enthronement ceremonies. This mask resides at the Dallas Museum of Art.',
    descriptionFr: 'Les masques éléphants Kuosi représentent le pouvoir royal, portés lors des funérailles et des cérémonies d\'intronisation. Ce masque se trouve au Dallas Museum of Art.',
    sortOrder: 1,
  },
  {
    url: '/images/bamileke-zing-dance.jpg',
    tag: 'Ceremonial Dance', tagFr: 'Danse Cérémonielle',
    title: 'Zing Dance Ceremony', titleFr: 'Cérémonie de Danse Zing',
    description: 'Traditional dancers in Ndop cloth and beaded hats perform the Zing — a sacred rhythm honoring ancestors and community bonds.',
    descriptionFr: 'Des danseurs traditionnels en tissu Ndop et chapeaux perlés exécutent le Zing — un rythme sacré honorant les ancêtres et les liens communautaires.',
    sortOrder: 2,
  },
  {
    url: '/images/bamileke-dressing.jpg',
    tag: 'Royal Garment', tagFr: 'Vêtement Royal',
    title: 'Toghu & Ceremonial Attire', titleFr: 'Toghu & Tenue de Cérémonie',
    description: 'The iconic hand-embroidered garments — pride of the Grasslands people, worn at weddings, royal events, and cultural celebrations.',
    descriptionFr: 'Les vêtements emblématiques brodés à la main — fierté du peuple des Grasslands, portés aux mariages, événements royaux et célébrations culturelles.',
    sortOrder: 3,
  },
]

const existing = await prisma.cultureItem.count()
if (existing > 0) {
  console.log(`CultureItem already has ${existing} rows — skipping seed.`)
} else {
  await prisma.cultureItem.createMany({ data: items })
  console.log(`Seeded ${items.length} culture items.`)
}
await prisma.$disconnect()
