import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAdmin } from '@/lib/auth'
import { uploadToCloudinary } from '@/lib/cloudinary'

// GET: Fetch single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { error, auth } = await verifyAdmin(request)
  if (error) {
    return NextResponse.json({ error }, { status: 401 })
  }

  try {
    const productId = parseInt(id)
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...product,
      image: product.imageUrl, // Map imageUrl to image for frontend
      categoryId: product.categoryId,
    })
  } catch (err) {
    console.error('Error fetching product:', err)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT: Update product by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { error, auth } = await verifyAdmin(request)
  if (error) {
    return NextResponse.json({ error }, { status: 401 })
  }

  try {
    const productId = parseInt(id)
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    const data = await request.json()
    const {
      name,
      description,
      price,
      stock,
      categoryId,
      image,
      variants,
      marketplaceUrl,
      isActive = true,
      isFeatured = false,
    } = data

    // Validate required fields
    if (!name || price === undefined) {
      return NextResponse.json(
        { error: 'name and price are required' },
        { status: 400 }
      )
    }

    let imageUrl: string | undefined

    // Handle image upload if new image is provided
    if (image && image.startsWith('data:')) {
      try {
        const result = await uploadToCloudinary(image)
        if (result) {
          imageUrl = result
        } else {
          throw new Error('Cloudinary upload failed')
        }
      } catch (error) {
        console.error('Error saving image:', error)
        return NextResponse.json(
          { error: 'Failed to save image' },
          { status: 500 }
        )
      }
    } else if (image && !image.startsWith('data:')) {
      // Image is already a path or URL, keep it as is
      imageUrl = image
    }

    // Process variant images - save to Cloudinary
    let variantsData: any[] = []
    if (variants && Array.isArray(variants)) {
      variantsData = await Promise.all(variants.map(async (variant: any) => {
        if (variant.image && variant.image.startsWith('data:')) {
          try {
            const result = await uploadToCloudinary(variant.image)
            if (result) {
              return { ...variant, image: result }
            }
          } catch (e) {
            console.warn('Error saving variant image:', e)
          }
        }
        return variant
      }))
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        ...(description && { description }),
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        ...(categoryId && { categoryId: parseInt(categoryId) }),
        ...(imageUrl && { imageUrl }),
        ...(variantsData.length > 0 && { variants: JSON.stringify(variantsData) }),
        ...(marketplaceUrl && { marketplaceUrl }),
        isActive,
        isFeatured,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({
      ...product,
      image: product.imageUrl,
    })
  } catch (err) {
    console.error('Error updating product:', err)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE: Delete product by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { error, auth } = await verifyAdmin(request)
  if (error) {
    return NextResponse.json({ error }, { status: 401 })
  }

  try {
    const productId = parseInt(id)
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    // Get product to find image file
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Delete product from database
    await prisma.product.delete({
      where: { id: productId },
    })

    return NextResponse.json({ success: true, message: 'Product deleted' })
  } catch (err) {
    console.error('Error deleting product:', err)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
