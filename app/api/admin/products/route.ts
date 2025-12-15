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
      include: { category: true, variants: true },
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
      variants, // Expecting array of { name: string, image: string }
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
        materials: materials || [],
        colors: colors || [],
        imageUrl,
        marketplaceUrl,
        isActive,
        isFeatured,
        variants: {
          create: variants && Array.isArray(variants) ? variants.map((v: any) => ({
            name: v.name,
            imageUrl: v.image // Map frontend 'image' to schema 'imageUrl'
          })) : []
        }
      },
      include: { variants: true }
    })
    return NextResponse.json(product, { status: 201 })
  } catch (err: any) {
    console.error('Error creating product:', JSON.stringify(err, null, 2));

    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Slug product already exists (must be unique)' }, { status: 400 })
    }

    return NextResponse.json({ error: `Failed to create product: ${err.message}` }, { status: 500 })
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
      variants,
      imageUrl,
      marketplaceUrl,
      isActive,
      isFeatured
    } = data

    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    // Wrap update in transaction to safely replace variants if needed
    const product = await prisma.$transaction(async (tx) => {
      // 1. Update basic fields
      await tx.product.update({
        where: { id: parseInt(id) },
        data: {
          ...(name && { name }),
          ...(slug && { slug }),
          ...(description && { description }),
          ...(price !== undefined && { price: parseInt(price) }),
          ...(stock !== undefined && { stock: parseInt(stock) }),
          ...(categoryId !== undefined && { categoryId: categoryId ? parseInt(categoryId) : null }),
          ...(materials && { materials }),
          ...(colors && { colors }),
          ...(imageUrl && { imageUrl }),
          ...(marketplaceUrl && { marketplaceUrl }),
          ...(isActive !== undefined && { isActive }),
          ...(isFeatured !== undefined && { isFeatured })
        }
      })

      // 2. Handle Variants Logic if 'variants' is provided
      if (variants && Array.isArray(variants)) {
        // Option: Delete all existing and re-create (simplest for full sync)
        await tx.productVariant.deleteMany({ where: { productId: parseInt(id) } })

        if (variants.length > 0) {
          await tx.productVariant.createMany({
            data: variants.map((v: any) => ({
              productId: parseInt(id),
              name: v.name,
              imageUrl: v.image || v.imageUrl // Handle both keys
            }))
          })
        }
      }

      // 3. Return updated product with relations
      return await tx.product.findUnique({
        where: { id: parseInt(id) },
        include: { variants: true, category: true }
      })
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
