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

  if (error) throw error
  return data || []
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) throw error
  return data
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) throw error
  return data || []
}

export async function searchProducts(query: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,materials.cs.{${query}}`)
    .eq('is_active', true)
    .limit(5)

  if (error) throw error
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

export async function getFeaturedProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
    .limit(8)

  if (error) throw error
  return data || []
}