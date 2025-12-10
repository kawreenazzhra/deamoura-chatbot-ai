# De.Amoura Chatbot & Katalog Hijab - Panduan Lengkap

Aplikasi katalog e-commerce hijab dengan chatbot AI (Gemini) dan admin panel CRUD produk. Backend menggunakan MySQL (PlanetScale) + Prisma ORM.

## 📋 Fitur Utama

- **Katalog Produk**: Daftar hijab dengan filter kategori, warna, material
- **Chatbot AI**: Menjawab pertanyaan customer (pakai Google Gemini), rekomendasi warna hijab
- **Admin Panel**: Login, tambah/edit/hapus produk dengan upload gambar bulk
- **Marketplace Integration**: Link langsung ke Tokopedia untuk pembelian
- **Responsive Design**: Mobile-friendly dengan Tailwind CSS + Radix UI

## 🚀 Quickstart (Lokal Development)

### 1. Clone & Install Dependencies

```powershell
git clone https://github.com/kawreenazzhra/deamoura-chatbot-ai.git
cd deamoura-chatbot
npm install
```

### 2. Setup Environment Variables

Buat file `.env` di root project:

```env
# Database (PlanetScale atau MySQL lokal)
DATABASE_URL="mysql://username:password@localhost:3306/deamoura"

# JWT Secret untuk Admin Login
ADMIN_JWT_SECRET="your-super-secret-key-change-me-in-production"

# Google Gemini API
NEXT_PUBLIC_GEMINI_API_KEY="your-gemini-api-key"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Prisma Setup

```powershell
# Generate Prisma Client
npx prisma generate

# (Lokal only) Jalankan migrasi pertama kali
npx prisma migrate dev --name init

# (Optional) Seed data dummy
npx prisma db seed
```

### 4. Run Dev Server

```powershell
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 🔑 Admin Access

### Buat Admin User (One-time)

```powershell
# Gunakan curl atau Postman untuk POST ke:
# POST http://localhost:3000/api/admin/register

curl -X POST http://localhost:3000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@deamoura.com",
    "password": "your-secure-password",
    "name": "Admin"
  }'
```

### Login Admin

1. Buka `http://localhost:3000/admin/login`
2. Masuk dengan email & password yang sudah dibuat
3. Token JWT akan disimpan di cookie, otomatis redirect ke dashboard

### Kelola Produk

- `/admin/products` - Daftar produk, search, delete
- `/admin/products/add` - Form tambah produk (upload foto bulk, set warna, harga, Tokopedia link)
- `/admin` - Dashboard overview

## 📱 Endpoint Public

- `GET /api/products` - Daftar semua produk
- `GET /api/products?featured=true` - Produk featured
- `POST /api/chat` - Chat dengan Gemini (body: `{ "message": "..." }`)

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | Next.js 16 + React 19 + TypeScript |
| **UI** | Tailwind CSS 4 + Radix UI |
| **Backend** | Next.js API Routes |
| **Database** | MySQL (PlanetScale recommended) + Prisma ORM |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **AI** | Google Generative AI (Gemini) |
| **Icons** | Lucide React |

## 🔐 Database Schema

```
Product
├── id (PK)
├── name, slug, description
├── price, stock
├── materials (JSON), colors (JSON)
├── imageUrl (base64 atau path/URL)
├── marketplaceUrl (link Tokopedia)
├── isActive, isFeatured
├── categoryId (FK)
└── timestamps

Category
├── id (PK)
├── name, slug, description
└── products (relations)

Faq
├── id (PK)
├── question, answer
├── isActive

Admin
├── id (PK)
├── email (unique), passwordHash
├── name
└── timestamps
```

## 📦 Deployment (Vercel + PlanetScale)

### Setup PlanetScale Database

1. Buat akun di [PlanetScale](https://planetscale.com)
2. Buat database baru (e.g., `deamoura-chatbot`)
3. Buka "Connect" → pilih "Prisma" dan copy connection string
4. Jalankan:

```powershell
# Untuk production, gunakan PlanetScale safe migrations
npx prisma migrate deploy
```

### Deploy ke Vercel

1. Push code ke GitHub
2. Buka [Vercel](https://vercel.com) dan connect repository
3. Set environment variables:
   - `DATABASE_URL` - PlanetScale connection string
   - `ADMIN_JWT_SECRET` - Random secure string
   - `NEXT_PUBLIC_GEMINI_API_KEY` - Gemini API key
   - `NEXT_PUBLIC_APP_URL` - Production domain

4. Deploy!

```powershell
# Or via Vercel CLI
npm i -g vercel
vercel
```

## 🖼️ Image Handling

Saat ini, gambar produk disimpan sebagai **base64 string** di database (untuk simplicity). Untuk production dengan storage lebih baik:

### Option 1: Cloudinary (Recommended)

1. Daftar di [Cloudinary](https://cloudinary.com)
2. Dapatkan Cloud Name, API Key, API Secret
3. Tambahkan ke `.env`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

4. Update form admin untuk upload ke Cloudinary dan simpan URL ke DB

### Option 2: AWS S3

Setup bucket S3 dan gunakan `aws-sdk` untuk upload files.

### Option 3: Local Public Folder

Upload file ke `public/images/` dan simpan path di database.

## 🧪 Testing Lokal

### Test Admin Register

```bash
curl -X POST http://localhost:3000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123","name":"Test"}'
```

### Test Admin Login

```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'
```

Response akan berisi `token`. Copy dan set di cookie untuk request protected.

### Test Create Product (perlu token)

```bash
curl -X POST http://localhost:3000/api/admin/products \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_token=YOUR_TOKEN_HERE" \
  -d '{
    "name":"Pashmina Test",
    "slug":"pashmina-test",
    "price":89000,
    "stock":10,
    "description":"Test product",
    "imageUrl":"https://example.com/image.jpg",
    "marketplaceUrl":"https://tokopedia.com/...",
    "colors":["Merah","Biru"],
    "materials":["Katun"]
  }'
```

## 📚 File Structure

```
deamoura-chatbot/
├── app/
│   ├── (admin)/                    # Admin routes (protected)
│   │   ├── layout.tsx              # Sidebar + auth check
│   │   ├── admin/
│   │   │   ├── page.tsx            # Dashboard
│   │   │   └── products/
│   │   │       ├── page.tsx        # Product list
│   │   │       └── add/page.tsx    # Add product form
│   │   └── login/page.tsx          # Admin login
│   ├── (katalog)/                  # Public routes
│   │   └── page.tsx                # Homepage / katalog
│   ├── api/
│   │   ├── admin/
│   │   │   ├── register/route.ts
│   │   │   ├── login/route.ts
│   │   │   └── products/route.ts   # CRUD API (protected)
│   │   ├── products/route.ts       # Public product list
│   │   └── chat/route.ts           # Gemini chat endpoint
│   └── globals.css
├── lib/
│   ├── db.ts                       # Prisma client + queries
│   ├── auth.ts                     # JWT helpers
│   ├── gemini-service.ts           # Chatbot logic
│   └── utils.ts
├── components/
│   ├── chat-widget.tsx
│   ├── product-card.tsx
│   └── ui/                         # Radix UI primitives
├── prisma/
│   ├── schema.prisma               # Database schema
│   └── migrations/                 # Auto-generated by Prisma
├── public/
│   └── images/                     # Static images (optional)
├── .env                            # Environment variables
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

## 🐛 Troubleshooting

### Error: "Unauthorized" di admin routes

- Pastikan token JWT ada di cookie `admin_token`
- Check `ADMIN_JWT_SECRET` di `.env` sama dengan yang dipakai di backend
- Token expired? Login kembali

### Error: "Failed to connect to database"

- Check `DATABASE_URL` di `.env` sudah benar
- MySQL/PlanetScale server running?
- Firewall/IP whitelist settings?

### Error: Prisma Client not generated

```powershell
npx prisma generate
npm run dev
```

### Images tidak tampil setelah upload

- Jika pakai base64: check browser console, ukuran gambar terlalu besar?
- Jika pakai Cloudinary: verify API key dan cloud name
- Jika pakai public folder: check path dan file permissions

## 📖 Next Steps

1. **Setup Production Database** → PlanetScale
2. **Configure Image Storage** → Cloudinary atau S3
3. **Create Seed Data** → Add kategori dan FAQ produk dummy
4. **Setup CI/CD** → GitHub Actions untuk auto-deploy
5. **Analytics** → Tambahkan Vercel Analytics / GA4
6. **SEO** → Meta tags untuk katalog

## 📞 Support & Issues

Tanya temanmu atau buka issue di GitHub. Pastikan:
- Environment variables lengkap
- Database connection OK
- Node version `>=18`
- NPM/PNPM terbaru

---

**Happy coding!** 🎉 De.Amoura Hijab Katalog siap go live! 🚀
