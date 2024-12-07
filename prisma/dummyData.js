const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // First, create a dummy user
  const user = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Doe',
      password: 'password123' // In a real app, this should be hashed
    },
  })

  // Create categories
  const categories = [
    { name: 'Fruits' },
    { name: 'Légumes' },
    { name: 'Produits laitiers' },
    { name: 'Viandes' },
    { name: 'Autres' }
  ]

  const createdCategories = []
  for (const category of categories) {
    const createdCategory = await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name },
    })
    createdCategories.push(createdCategory)
  }

  // Create dummy donations for each category
  const donations = [
    {
      title: 'Pommes fraîches',
      description: 'Un panier de pommes du jardin',
      location: 'Paris',
      latitude: 48.8566,
      longitude: 2.3522,
      categoryId: createdCategories[0].id, // Fruits
    },
    {
      title: 'Carottes bio',
      description: 'Carottes fraîchement récoltées',
      location: 'Lyon',
      latitude: 45.7578,
      longitude: 4.8320,
      categoryId: createdCategories[1].id, // Légumes
    },
    {
      title: 'Yaourts maison',
      description: 'Lot de yaourts fait maison',
      location: 'Marseille',
      latitude: 43.2965,
      longitude: 5.3698,
      categoryId: createdCategories[2].id, // Produits laitiers
    },
    {
      title: 'Poulet fermier',
      description: 'Poulet élevé en plein air',
      location: 'Toulouse',
      latitude: 43.6047,
      longitude: 1.4442,
      categoryId: createdCategories[3].id, // Viandes
    },
    {
      title: 'Pain artisanal',
      description: 'Pain fait maison de la veille',
      location: 'Bordeaux',
      latitude: 44.8378,
      longitude: -0.5792,
      categoryId: createdCategories[4].id, // Autres
    }
  ]

  // Create donations
  for (const donation of donations) {
    await prisma.donation.create({
      data: {
        ...donation,
        userId: user.id
      }
    })
  }

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })