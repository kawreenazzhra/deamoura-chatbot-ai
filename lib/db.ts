import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306'),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;

// Helpers to replicate Prisma behavior

// --- Product Queries ---
export async function getAllProductsAdmin() {
  const [rows] = await pool.execute(`
    SELECT p.*, c.name as categoryName, c.slug as categorySlug 
    FROM Product p 
    LEFT JOIN Category c ON p.categoryId = c.id 
    ORDER BY p.createdAt DESC
  `);
  return (rows as any[]).map(row => ({
    ...row,
    category: { id: row.categoryId, name: row.categoryName, slug: row.categorySlug },
    isActive: !!row.isActive,
    isFeatured: !!row.isFeatured
  }));
}

export async function getProducts() {
  const [rows] = await pool.execute(`
    SELECT p.*, c.name as categoryName, c.slug as categorySlug 
    FROM Product p 
    LEFT JOIN Category c ON p.categoryId = c.id 
    WHERE p.isActive = 1 
    ORDER BY p.createdAt DESC
  `);
  // Map to match Prisma structure with nested objects if needed, 
  // but simpler flat structure is often better. 
  // For compatibility with partial existing code, we might need to nest category.
  return (rows as any[]).map(row => ({
    ...row,
    category: { id: row.categoryId, name: row.categoryName, slug: row.categorySlug },
    isActive: !!row.isActive,
    isFeatured: !!row.isFeatured
  }));
}

export async function getFeaturedProducts() {
  const [rows] = await pool.execute(`
    SELECT p.*, c.name as categoryName, c.slug as categorySlug 
    FROM Product p 
    LEFT JOIN Category c ON p.categoryId = c.id 
    WHERE p.isActive = 1 AND p.isFeatured = 1 
    ORDER BY p.createdAt DESC 
    LIMIT 8
  `);
  return (rows as any[]).map(row => ({
    ...row,
    category: { id: row.categoryId, name: row.categoryName, slug: row.categorySlug },
    isActive: !!row.isActive,
    isFeatured: !!row.isFeatured
  }));
}

export async function getProductBySlug(slug: string) {
  const [rows] = await pool.execute(`
    SELECT p.*, c.name as categoryName, c.slug as categorySlug 
    FROM Product p 
    LEFT JOIN Category c ON p.categoryId = c.id 
    WHERE p.slug = ? AND p.isActive = 1
  `, [slug]);

  const product = (rows as any[])[0];
  if (!product) return null;

  return {
    ...product,
    category: { id: product.categoryId, name: product.categoryName, slug: product.categorySlug },
    isActive: !!product.isActive,
    isFeatured: !!product.isFeatured
  };
}

export async function searchProducts(query: string) {
  if (!query) return [];
  const searchTerm = `%${query}%`;
  const [rows] = await pool.execute(`
    SELECT p.*, c.name as categoryName, c.slug as categorySlug 
    FROM Product p 
    LEFT JOIN Category c ON p.categoryId = c.id 
    WHERE p.isActive = 1 AND (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)
    LIMIT 3
  `, [searchTerm, searchTerm, searchTerm]);

  return (rows as any[]).map(row => ({
    ...row,
    category: { id: row.categoryId, name: row.categoryName, slug: row.categorySlug },
    isActive: !!row.isActive,
    isFeatured: !!row.isFeatured
  }));
}

// --- Category Queries ---
export async function getCategories() {
  const [rows] = await pool.execute('SELECT * FROM Category ORDER BY name ASC');
  return rows as any[];
}

export async function searchCategories(query: string) {
  if (!query) return [];
  const searchTerm = `%${query}%`;
  const [rows] = await pool.execute(`
    SELECT * FROM Category 
    WHERE name LIKE ? OR description LIKE ? 
    LIMIT 2
  `, [searchTerm, searchTerm]);
  return rows as any[];
}

// --- FAQ Queries ---
export async function getFAQ(query: string) {
  if (!query) return [];
  const searchTerm = `%${query}%`;
  const [rows] = await pool.execute(`
    SELECT * FROM Faq 
    WHERE isActive = 1 AND (question LIKE ? OR answer LIKE ?) 
    LIMIT 2
  `, [searchTerm, searchTerm]);
  return rows as any[];
}

// --- Admin Helper: Create Product ---
export async function createProduct(data: any) {
  // Data typically contains: name, slug, description, price, stock, categoryId, etc.
  // We need to construct the INSERT query dynamically or manually mapping fields.
  // Since we know the schema, we can mapping manually.

  const { name, slug, description, price, stock, imageUrl, marketplaceUrl, isActive, isFeatured, categoryId, materials, colors, variants } = data;

  const [result] = await pool.execute(`
    INSERT INTO Product 
    (name, slug, description, price, stock, imageUrl, marketplaceUrl, isActive, isFeatured, categoryId, materials, colors, variants)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    name,
    slug,
    description,
    price,
    stock,
    imageUrl,
    marketplaceUrl,
    isActive ?? true,
    isFeatured ?? false,
    categoryId,
    JSON.stringify(materials),
    JSON.stringify(colors),
    JSON.stringify(variants)
  ]);

  return { id: (result as any).insertId, ...data };
}

export async function getProductById(id: number) {
  const [rows] = await pool.execute(`
    SELECT p.*, c.name as categoryName, c.slug as categorySlug 
    FROM Product p 
    LEFT JOIN Category c ON p.categoryId = c.id 
    WHERE p.id = ?
  `, [id]);

  const product = (rows as any[])[0];
  if (!product) return null;

  return {
    ...product,
    category: { id: product.categoryId, name: product.categoryName, slug: product.categorySlug },
    isActive: !!product.isActive,
    isFeatured: !!product.isFeatured
  };
}

export async function updateProduct(id: number, data: any) {
  // Simple dynamic update builder
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(data)) {
    if (key === 'id') continue; // Don't update ID
    if (key === 'category') continue; // Skip nested objects
    if (value === undefined) continue; // Skip undefined values (don't update)

    // JSON fields
    if (['materials', 'colors', 'variants'].includes(key)) {
      fields.push(`${key} = ?`);
      // If value is null, store explicit NULL, otherwise stringify
      values.push(value === null ? null : JSON.stringify(value));
    } else {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) return getProductById(id);

  values.push(id);

  await pool.execute(`UPDATE Product SET ${fields.join(', ')} WHERE id = ?`, values);
  return getProductById(id);
}

export async function deleteProduct(id: number) {
  await pool.execute('DELETE FROM Product WHERE id = ?', [id]);
  return { id };
}

// --- Admin Auth Helpers ---
export async function createAdmin(email: string, password: string, name?: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  const [result] = await pool.execute(
    'INSERT INTO Admin (email, passwordHash, name) VALUES (?, ?, ?)',
    [email, passwordHash, name]
  );
  return { id: (result as any).insertId, email, name };
}

export async function findAdminByEmail(email: string) {
  const [rows] = await pool.execute('SELECT * FROM Admin WHERE email = ?', [email]);
  return (rows as any[])[0] || null;
}

export async function verifyAdminPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
