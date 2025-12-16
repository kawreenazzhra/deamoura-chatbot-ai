import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  const globalForPrisma = global as unknown as { prisma: PrismaClient }
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient()
  }
  prisma = globalForPrisma.prisma
}

export { prisma }

export async function getProducts() {
  return prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
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
  return prisma.product.findFirst({
    where: { slug, isActive: true },
    include: { category: true }
  })
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
        { name: { contains: query } },
        { description: { contains: query } }
      ]
    },
    include: { category: true },
    take: 3
  })
}

export async function searchCategories(query: string) {
  if (!query) return []
  return prisma.category.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { description: { contains: query } }
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
        { question: { contains: query } },
        { answer: { contains: query } }
      ]
    },
    take: 2
  })
}

// Product CRUD helpers (for admin)
export async function createProduct(data: any) {
  return prisma.product.create({ data })
}

export async function getProductById(id: number) {
  return prisma.product.findUnique({ where: { id } })
}

export async function updateProduct(id: number, data: any) {
  return prisma.product.update({ where: { id }, data })
}

export async function deleteProduct(id: number) {
  return prisma.product.delete({ where: { id } })
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
