import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!@#', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@baham-dallas.org' },
    update: {},
    create: {
      email: 'admin@baham-dallas.org',
      name: 'Admin',
      passwordHash: adminPassword,
      emailVerified: new Date(),
      role: Role.ADMIN,
      hometown: 'Baham',
    },
  })
  console.log('Admin user created:', admin.email)

  // Create sample events
  const events = [
    {
      title: 'Annual Baham Cultural Festival',
      titleFr: 'Festival Culturel Annuel de Baham',
      description: 'A full day of traditional dance, music, food, and celebration of our Bamiléké heritage with families from across Texas.',
      descriptionFr: 'Une journée entière de danse traditionnelle, musique, cuisine et célébration de notre patrimoine Bamiléké avec des familles de tout le Texas.',
      date: new Date('2026-06-20T10:00:00'),
      time: '10AM – 8PM',
      location: 'Dallas Convention Center',
      color: 'red',
    },
    {
      title: 'Monthly Community Meeting',
      titleFr: 'Réunion Mensuelle Communautaire',
      description: 'Our monthly assembly — discussing community needs, planning events, and connecting with fellow Baham members.',
      descriptionFr: 'Notre assemblée mensuelle — discussion des besoins communautaires, planification d\'événements et connexion avec les membres Baham.',
      date: new Date('2026-04-26T15:00:00'),
      time: '3PM – 6PM',
      location: 'Richardson Civic Center',
      color: 'green',
    },
    {
      title: 'Youth Heritage Workshop',
      titleFr: 'Atelier Patrimoine Jeunesse',
      description: 'Teaching our children the Ghomala\' language, traditional dances, and the history of the Baham chieftaincy.',
      descriptionFr: 'Enseigner à nos enfants la langue Ghomala\', les danses traditionnelles et l\'histoire de la chefferie de Baham.',
      date: new Date('2026-05-17T13:00:00'),
      time: '1PM – 4PM',
      location: 'Plano Community Center',
      color: 'amber',
    },
  ]

  for (const event of events) {
    await prisma.event.create({ data: event })
  }
  console.log('Sample events created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
