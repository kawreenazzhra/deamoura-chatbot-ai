import { NextRequest, NextResponse } from 'next/server'
import { prisma, createProduct, getProductById, updateProduct, deleteProduct } from '@/lib/db'
import { verifyAdminToken, getAdminTokenFromCookie } from '@/lib/auth'

// Helper: Verify admin from request
async function verifyAdmin(request: NextRequest) {
  const token = getAdminTokenFromCookie(request.headers.get('cookie'))
  if (!token) {
    return { auth: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  const admin = verifyAdminToken(token)
  if (!admin) {
    return { auth: null, error: NextResponse.json({ error: 'Invalid token' }, { status: 401 }) }
  }
  return { auth: admin, error: null }
}

// GET: Fetch all products
export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(products)
  } catch (err) {
    console.error('Error fetching products:', err)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST: Create product (admin only)
export async function POST(request: NextRequest) {
  const { auth, error } = await verifyAdmin(request)
  if (error) return error

  try {
    const data = await request.json()
    const {
      name,
      slug,
      description,
      price,
      stock,
      categoryId,
      materials,
      colors,
      imageUrl,
      marketplaceUrl,
      isActive = true,
      isFeatured = false
    } = data

    if (!name || !slug || !price) {
      return NextResponse.json({ error: 'name, slug, price required' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseInt(price),
        stock: parseInt(stock) || 0,
        categoryId: categoryId ? parseInt(categoryId) : null,
        materials: materials ? JSON.stringify(materials) : null,
        colors: colors ? JSON.stringify(colors) : null,
        imageUrl,
        marketplaceUrl,
        isActive,
        isFeatured
      }
    })
    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    console.error('Error creating product:', err)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

// PUT: Update product (admin only)
export async function PUT(request: NextRequest) {
  const { auth, error } = await verifyAdmin(request)
  if (error) return error

  try {
    const data = await request.json()
    const {
      id,
      name,
      slug,
      description,
      price,
      stock,
      categoryId,
      materials,
      colors,
      imageUrl,
      marketplaceUrl,
      isActive,
      isFeatured
    } = data

    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(price !== undefined && { price: parseInt(price) }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(categoryId !== undefined && { categoryId: categoryId ? parseInt(categoryId) : null }),
        ...(materials && { materials: JSON.stringify(materials) }),
        ...(colors && { colors: JSON.stringify(colors) }),
        ...(imageUrl && { imageUrl }),
        ...(marketplaceUrl && { marketplaceUrl }),
        ...(isActive !== undefined && { isActive }),
        ...(isFeatured !== undefined && { isFeatured })
      }
    })
    return NextResponse.json(product)
  } catch (err) {
    console.error('Error updating product:', err)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// DELETE: Delete product (admin only)
export async function DELETE(request: NextRequest) {
  const { auth, error } = await verifyAdmin(request)
  if (error) return error

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    await prisma.product.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Error deleting product:', err)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
