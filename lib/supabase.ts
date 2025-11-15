import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }
  return data || []
}

export async function getProductsByCategory(categorySlug: string) {
  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()

  if (categoryError || !category) {
    console.error('Category not found:', categorySlug)
    return []
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products by category:', error)
    return []
  }
  return data || []
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }
  return data
}

// Get all categories
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }
  return data || []
}

// Get featured products
export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
    .limit(8)

  if (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
  return data || []
}

// Search products for chatbot
export async function searchProducts(query: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,materials.cs.{${query}}`)
    .eq('is_active', true)
    .limit(3)

  if (error) {
    console.error('Error searching products:', error)
    return []
  }
  return data || []
}

export async function searchCategories(query: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(2)

  if (error) {
    console.error('Error searching categories:', error)
    return []
  }
  return data || []
}

// Get FAQ for chatbot
export async function getFAQ(query: string) {
  const { data, error } = await supabase
    .from('faq')
    .select('*')
    .or(`question.ilike.%${query}%,answer.ilike.%${query}%`)
    .eq('is_active', true)
    .limit(2)

  if (error) {
    console.error('Error fetching FAQ:', error)
    return []
  }
  return data || []
}