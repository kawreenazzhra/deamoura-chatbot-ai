import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAdmin } from '@/lib/auth'
import { uploadToCloudinary } from '@/lib/cloudinary'
import * as fs from 'fs'
import * as path from 'path'

// GET: Fetch all products (admin only)
export async function GET(request: NextRequest) {
  const { error, auth } = await verifyAdmin(request)
  if (error) {
    return NextResponse.json({ error }, { status: 401 })
  }

  try {
    const products = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(products)
  } catch (err) {
    console.error('Error fetching products:', err)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST: Create product (admin only)
export async function POST(request: NextRequest) {
  const { error, auth } = await verifyAdmin(request)
  if (error) {
    return NextResponse.json({ error }, { status: 401 })
  }

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
      imageBase64,
      variants,
      marketplaceUrl,
      isActive = true,
      isFeatured = false
    } = data

    if (!name || !slug || !price || !imageBase64) {
      return NextResponse.json(
        { error: 'name, slug, price, image required' },
        { status: 400 }
      )
    }

    // Save base64 image to file instead of storing in database
    let imageUrl = ''
    if (imageBase64 && imageBase64.startsWith('data:')) {
      try {
        // Extract base64 data
        const base64Data = imageBase64.split(',')[1]
        if (!base64Data) throw new Error('Invalid base64 format')
        
        // Create filename
        const filename = `${slug}-${Date.now()}.jpg`
        const filepath = path.join(process.cwd(), 'public', 'uploads', filename)
        
        // Create directory if not exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }
        
        // Save file
        fs.writeFileSync(filepath, Buffer.from(base64Data, 'base64'))
        imageUrl = `/uploads/${filename}`
      } catch (error) {
        console.error('Error saving image:', error)
        return NextResponse.json(
          { error: 'Failed to save image' },
          { status: 500 }
        )
      }
    } else {
      imageUrl = imageBase64
    }

    // Process variant images - save to file system and replace base64 with paths
    let variantsData: any[] = []
    if (variants && Array.isArray(variants)) {
      variantsData = variants.map((variant: any) => {
        if (variant.image && variant.image.startsWith('data:')) {
          try {
            const base64Data = variant.image.split(',')[1]
            if (!base64Data) return variant
            
            const filename = `${slug}-variant-${variant.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.jpg`
            const filepath = path.join(process.cwd(), 'public', 'uploads', filename)
            
            const uploadDir = path.join(process.cwd(), 'public', 'uploads')
            if (!fs.existsSync(uploadDir)) {
              fs.mkdirSync(uploadDir, { recursive: true })
            }
            
            fs.writeFileSync(filepath, Buffer.from(base64Data, 'base64'))
            return { ...variant, image: `/uploads/${filename}` }
          } catch (e) {
            console.warn('Error saving variant image:', e)
            return variant
          }
        }
        return variant
      })
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: parseInt(price),
        stock: parseInt(stock) || 0,
        categoryId: categoryId ? parseInt(categoryId) : null,
        materials: materials ? JSON.stringify(materials) : undefined,
        colors: colors ? JSON.stringify(colors) : undefined,
        imageUrl: imageUrl,
        ...(variantsData.length > 0 && { variants: JSON.stringify(variantsData) }),
        marketplaceUrl,
        isActive,
        isFeatured
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    console.error('Error creating product:', err)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

// PUT: Update product (Admin only)
export async function PUT(request: NextRequest) {
  const { error, auth } = await verifyAdmin(request)
  if (error) {
    return NextResponse.json({ error }, { status: 401 })
  }

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
      imageBase64,
      marketplaceUrl,
      isActive,
      isFeatured
    } = data

    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    let uploadedImageUrl

    // Jika frontend kirim imageBase64 berarti user ganti gambar
    if (imageBase64) {
      if (imageBase64.startsWith('data:')) {
        // Try Cloudinary, jika gagal gunakan base64 langsung
        const result = await uploadToCloudinary(imageBase64)
        uploadedImageUrl = result || imageBase64
      } else {
        uploadedImageUrl = imageBase64
      }
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(price !== undefined && { price: parseInt(price) }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(categoryId !== undefined && {
          categoryId: categoryId ? parseInt(categoryId) : null
        }),
        ...(materials && { materials: JSON.stringify(materials) }),
        ...(colors && { colors: JSON.stringify(colors) }),
        ...(uploadedImageUrl && { imageUrl: uploadedImageUrl }),
        ...(marketplaceUrl && { marketplaceUrl }),
        ...(isActive !== undefined && { isActive }),
        ...(isFeatured !== undefined && { isFeatured })
      }
    })

    return NextResponse.json(product)
  } catch (err) {
    console.error('Error updating product:', err)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE
export async function DELETE(request: NextRequest) {
  const { error, auth } = await verifyAdmin(request)
  if (error) {
    return NextResponse.json({ error }, { status: 401 })
  }

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
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
