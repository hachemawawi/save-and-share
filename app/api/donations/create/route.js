import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request) {
  try {
    const body = await request.json()

    const { title, description, location, latitude, longitude, categoryId } = body

    if (!title || !description || !location || !categoryId) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants' },
        { status: 400 }
      )
    }

    // Create donation
    const donation = await prisma.donation.create({
      data: {
        title,
        description,
        location,
        latitude: parseFloat(latitude) || 0,
        longitude: parseFloat(longitude) || 0,
        categoryId,
        // TODO: Replace with actual user ID when auth is implemented
        userId: 'cm4clhx2e00007k3cckk81k48',
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({ success: true, data: donation })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création du don' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}