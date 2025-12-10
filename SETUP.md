# Setup & Instalasi - De.Amoura Chatbot

Panduan lengkap untuk setup project lokal dengan Node.js, Prisma, dan dependencies.

## ✅ Prerequisites

- **Node.js** `>=18` (download dari [nodejs.org](https://nodejs.org))
- **npm** atau **pnpm** (biasanya bundled dengan Node.js)
- **Git** (sudah ada)
- **Database**: MySQL lokal atau PlanetScale account

## 📦 Step 1: Install Node.js & npm

### Windows

1. Download installer dari [nodejs.org](https://nodejs.org/en/download)
2. Pilih LTS version (recommended)
3. Jalankan installer, ikuti wizard (default settings OK)
4. Restart PowerShell/CMD
5. Verify install:

```powershell
node --version
npm --version
```

Kedua commands harus menampilkan version number, jika tidak, restart komputer.

## 🚀 Step 2: Install Project Dependencies

Buka PowerShell di folder project:

```powershell
cd C:\deamoura\deamoura-chatbot
npm install
```

Ini akan download dan install semua dependencies dari `package.json` termasuk:
- `@prisma/client` - ORM database
- `bcryptjs` - password hashing
- `jsonwebtoken` - JWT auth
- `@google/generative-ai` - Gemini API client
- UI libraries (Radix UI, Tailwind CSS)

**Durasi**: 2-5 menit (tergantung internet speed)

## 🗄️ Step 3: Setup Database

### Option A: Local MySQL (Development)

Jika sudah punya MySQL server running lokal:

```powershell
# Buat database baru
mysql -u root -p -e "CREATE DATABASE deamoura_chatbot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

Kemudian set `.env`:

```env
DATABASE_URL="mysql://root:password@localhost:3306/deamoura_chatbot"
```

### Option B: PlanetScale (Recommended for Production)

1. Buat akun di [PlanetScale](https://planetscale.com)
2. Buat database baru bernama `deamoura-chatbot`
3. Pilih MySQL 8.0
4. Di "Connect" tab, pilih "Prisma" dan copy connection string
5. Set di `.env`:

```env
DATABASE_URL="mysql://xxxxx:pscale_pw_xxxxx@aws.connect.psdb.cloud/deamoura-chatbot?sslaccept=strict"
```

## 🔧 Step 4: Setup Environment Variables

Buat file `.env` di root project (copy dari template):

```powershell
cd C:\deamoura\deamoura-chatbot
cp .env.example .env  # jika ada, atau copy manual
```

Edit `.env` dan isi:

```env
# Database (dari Step 3)
DATABASE_URL="mysql://user:password@host:3306/dbname"

# JWT Secret (random string, minimum 32 chars)
ADMIN_JWT_SECRET="your-super-secret-key-change-me-in-production-min-32-chars"

# Google Gemini API Key (dapatkan dari Google AI Studio)
NEXT_PUBLIC_GEMINI_API_KEY="AIzaSy..."

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Cara dapat Gemini API Key:**
1. Buka [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Login dengan Google account
3. Click "Create API key"
4. Copy key ke `.env`

## 🗂️ Step 5: Generate Prisma Client & Migrasi DB

```powershell
# Generate Prisma client (required setiap kali schema berubah)
npx prisma generate

# Jalankan migrasi pertama kali (buat tabel di DB)
npx prisma migrate dev --name init
```

**Apa yang terjadi:**
- Prisma akan membaca `prisma/schema.prisma`
- Create semua tabel di database (Product, Category, Admin, Faq)
- Generate TypeScript client di `node_modules/@prisma/client`

Jika sukses, Anda akan lihat:
```
✔ Generated Prisma Client...
✔ Created migration...
```

## ✨ Step 6: Jalankan Dev Server

```powershell
npm run dev
```

Aplikasi akan start di `http://localhost:3000`

Buka di browser:
- Homepage: `http://localhost:3000`
- Admin Login: `http://localhost:3000/admin/login`
- Chatbot: sudah ada di homepage

## 👤 Step 7: Buat Admin User (One-time)

Buka Postman atau gunakan curl:

```powershell
$body = @{
    email = "admin@deamoura.com"
    password = "AdminPassword123!"
    name = "Admin"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/admin/register" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"} `
    -Body $body
```

Atau langsung POST dari Postman:
- **URL**: `POST http://localhost:3000/api/admin/register`
- **Body** (JSON):
```json
{
  "email": "admin@deamoura.com",
  "password": "AdminPassword123!",
  "name": "Admin"
}
```

Response akan berisi admin data (jika berhasil).

## 🔐 Step 8: Login Admin

1. Buka `http://localhost:3000/admin/login`
2. Masuk dengan email & password dari Step 7
3. Redirect ke dashboard admin

## 📝 Troubleshooting

### Error: "npm is not recognized"

Node.js tidak terinstall. Ulangi Step 1, kemudian restart PowerShell.

### Error: "Cannot find module '@prisma/client'"

Dependencies belum diinstall. Jalankan:

```powershell
npm install
npx prisma generate
```

### Error: "database connection error"

Check `.env` `DATABASE_URL`:
- MySQL/PlanetScale server running?
- Username/password benar?
- Database exist?
- Network/firewall allow connection?

Coba test manual:

```powershell
mysql -u root -p -h localhost -e "SELECT 1"
```

### Error: "Admin register 409 conflict"

Admin dengan email itu sudah exist. Gunakan email berbeda atau delete dari database:

```powershell
npx prisma studio  # UI untuk manage data
# Delete admin, then try register again
```

### Admin login 401 "Invalid credentials"

Email atau password salah. Cek di Prisma Studio:

```powershell
npx prisma studio
# Buka tab "Admin", lihat data yang ada
```

## 🎯 Next: Develop Admin Features

Setelah berhasil login, Anda bisa:
1. Akses `/admin/products` - list produk
2. Akses `/admin/products/add` - tambah produk baru
3. Upload gambar, set warna, harga, link Tokopedia

Semua perubahan akan tersimpan di database MySQL!

## 📚 Useful Commands

```powershell
# Dev server dengan hot reload
npm run dev

# Build production
npm run build

# Run production build lokal
npm start

# View/manage database GUI
npx prisma studio

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Check database schema
npx prisma db push

# View migration history
npx prisma migrate status
```

## 🚀 Ready to Deploy?

Setelah lokal bekerja sempurna:

1. Commit ke GitHub
2. Push ke repository
3. Connect ke Vercel (set env vars)
4. Auto-deploy!

Lihat `DEPLOYMENT.md` untuk panduan lengkap production setup.

---

**Sukses! Aplikasi siap dikembangkan. 🎉**
