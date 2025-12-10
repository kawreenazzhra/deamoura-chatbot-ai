import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = globalThis.__prisma || new PrismaClient()
if (!globalThis.__prisma) globalThis.__prisma = prisma

export async function getProducts() {
  return prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    take: 8,
    orderBy: { createdAt: 'desc' }
  })
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({ where: { slug, isActive: true } })
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } })
}

export async function searchProducts(query: string) {
  if (!query) return []
  return prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    },
    take: 3
  })
}

export async function searchCategories(query: string) {
  if (!query) return []
  return prisma.category.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    },
    take: 2
  })
}

export async function getFAQ(query: string) {
  if (!query) return []
  return prisma.faq.findMany({
    where: {
      isActive: true,
      OR: [
        { question: { contains: query, mode: 'insensitive' } },
        { answer: { contains: query, mode: 'insensitive' } }
      ]
    },
    take: 2
  })
}

// Admin helpers
export async function createAdmin(email: string, password: string, name?: string) {
  const passwordHash = await bcrypt.hash(password, 10)
  return prisma.admin.create({ data: { email, passwordHash, name } })
}

export async function findAdminByEmail(email: string) {
  return prisma.admin.findUnique({ where: { email } })
}

export async function verifyAdminPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export default prisma
