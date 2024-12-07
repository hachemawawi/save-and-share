import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const searchTerm = searchParams.get('searchTerm') || ''
    const categoryId = searchParams.get('categoryId')

    const where = {
      AND: [
        searchTerm ? {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        } : {},
        categoryId && categoryId !== 'all' ? { categoryId } : {},
      ],
    }

    const donations = await prisma.donation.findMany({
      where,
      include: {
        category: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(donations)
  } catch (error) {
    console.error('Error fetching donations:', error)
    return NextResponse.json({ error: 'Error fetching donations' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}