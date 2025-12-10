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
    where: { 
      slug, 
      isActive: true 
    } 
  })
}

export async function getCategories() {
  return prisma.category.findMany({ 
    orderBy: { name: 'asc' } 
  })
}

// SOLUSI 3: Gunakan LOWER() function untuk case-insensitive (RAW QUERY)
export async function searchProducts(query: string) {
  if (!query) return []
  
  const lowerQuery = query.toLowerCase()
  
  const results = await prisma.$queryRaw`
    SELECT * FROM Product 
    WHERE isActive = 1 
    AND (
      LOWER(name) LIKE ${'%' + lowerQuery + '%'}
      OR LOWER(description) LIKE ${'%' + lowerQuery + '%'}
    )
    ORDER BY createdAt DESC
    LIMIT 3
  `
  
  return results as any[]
}

export async function searchCategories(query: string) {
  if (!query) return []
  
  const lowerQuery = query.toLowerCase()
  
  const results = await prisma.$queryRaw`
    SELECT * FROM Category 
    WHERE (
      LOWER(name) LIKE ${'%' + lowerQuery + '%'}
      OR LOWER(description) LIKE ${'%' + lowerQuery + '%'}
    )
    ORDER BY name ASC
    LIMIT 2
  `
  
  return results as any[]
}

export async function getFAQ(query: string) {
  if (!query) return []
  
  const lowerQuery = query.toLowerCase()
  
  const results = await prisma.$queryRaw`
    SELECT * FROM Faq 
    WHERE isActive = 1 
    AND (
      LOWER(question) LIKE ${'%' + lowerQuery + '%'}
      OR LOWER(answer) LIKE ${'%' + lowerQuery + '%'}
    )
    LIMIT 2
  `
  
  return results as any[]
}

// Fungsi khusus untuk Chatbot (juga menggunakan RAW QUERY)
export async function searchProductsForChatbot(query: string) {
  return searchProducts(query) // Gunakan fungsi yang sama
}

export async function searchCategoriesForChatbot(query: string) {
  return searchCategories(query) // Gunakan fungsi yang sama
}

// Product CRUD helpers (for admin)
export async function createProduct(data: any) {
  return prisma.product.create({ data })
}

export async function getProductById(id: number) {
  return prisma.product.findUnique({ 
    where: { id } 
  })
}

export async function updateProduct(id: number, data: any) {
  return prisma.product.update({ 
    where: { id }, 
    data 
  })
}

export async function deleteProduct(id: number) {
  return prisma.product.delete({ 
    where: { id } 
  })
}

// Category CRUD helpers
export async function createCategory(data: any) {
  return prisma.category.create({ data })
}

export async function updateCategory(id: number, data: any) {
  return prisma.category.update({ 
    where: { id }, 
    data 
  })
}

export async function deleteCategory(id: number) {
  return prisma.category.delete({ 
    where: { id } 
  })
}

// FAQ CRUD helpers
export async function createFAQ(data: any) {
  return prisma.faq.create({ data })
}

export async function updateFAQ(id: number, data: any) {
  return prisma.faq.update({ 
    where: { id }, 
    data 
  })
}

export async function deleteFAQ(id: number) {
  return prisma.faq.delete({ 
    where: { id } 
  })
}

// Admin helpers
export async function createAdmin(email: string, password: string, name?: string) {
  const passwordHash = await bcrypt.hash(password, 10)
  return prisma.admin.create({ 
    data: { 
      email, 
      passwordHash, 
      name 
    } 
  })
}

export async function findAdminByEmail(email: string) {
  return prisma.admin.findUnique({ 
    where: { email } 
  })
}

export async function verifyAdminPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export default prisma