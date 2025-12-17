import { NextRequest, NextResponse } from 'next/server'
import { getProductById, updateProduct, deleteProduct } from '@/lib/db'
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

    const product = await getProductById(productId)

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
      isActive,
      isFeatured,
      materials,
      colors
    } = data

    // Validate required fields (only if critical update)
    if (name === '' || price === '') { // Simple check, undefined is allowed
      // Actually updates can be partial
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

    // Helper for safe integer parsing
    const safeInt = (val: any) => {
      if (val === null || val === undefined || val === '') return 0;
      const parsed = parseInt(val);
      return isNaN(parsed) ? 0 : parsed;
    };

    // Process variant images - upload to Cloudinary if needed
    let variantsData = variants;
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

    const updateData: any = {
      name,
      description,
      price: safeInt(price),
      stock: safeInt(stock),
      categoryId: categoryId ? safeInt(categoryId) : null,
      imageUrl,
      variants: variantsData,
      marketplaceUrl,
      isActive,
      isFeatured,
      materials,
      colors
    };

    // Clean undefined
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    const product = await updateProduct(productId, updateData);

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

    await deleteProduct(productId)

    return NextResponse.json({ success: true, message: 'Product deleted' })
  } catch (err) {
    console.error('Error deleting product:', err)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
