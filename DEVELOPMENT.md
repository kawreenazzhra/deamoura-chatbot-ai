Prisma + PlanetScale setup and local development

1) Install dependencies

```powershell
npm install
```

2) Environment variables (create a `.env` in project root)

- `DATABASE_URL` - your MySQL/PlanetScale connection string
- `ADMIN_JWT_SECRET` - random secret used to sign admin JWTs
- `NEXT_PUBLIC_GEMINI_API_KEY` - Gemini API key
- `NEXT_PUBLIC_APP_URL` - base URL for the app (e.g. http://localhost:3000)

Example `.env` (local development):

```
DATABASE_URL="mysql://user:password@127.0.0.1:3306/dbname"
ADMIN_JWT_SECRET="change-me-to-a-secure-random-string"
NEXT_PUBLIC_GEMINI_API_KEY="your-gemini-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

3) Prisma setup

- Generate the Prisma client:

```powershell
npx prisma generate
```

- For local MySQL (development), you can run migrations:

```powershell
npx prisma migrate dev --name init
```

- For PlanetScale (recommended for production with Vercel), use `prisma db push` or follow PlanetScale + Prisma docs to deploy migrations safely.

4) Start the dev server

```powershell
npm run dev
```

5) Create initial admin (one-time)

If no admin exists, you can create one by POSTing to `/api/admin/register` with JSON body:

```json
{ "email": "admin@example.com", "password": "strong-password", "name": "Admin" }
```

6) Login

POST to `/api/admin/login` with `{ "email": "...", "password": "..." }` — you'll receive a JWT token to call protected admin APIs.

7) Notes on images and marketplace links

- `Product.imageUrl` stores a public URL or path under `public/images/`. For production, consider Cloudinary or S3.
- `Product.marketplaceUrl` should point to the Tokopedia product page (link users to Tokopedia for purchases).

8) Deployment (Vercel + PlanetScale)

- Create a PlanetScale database and get the connection string.
- Set `DATABASE_URL` in Vercel environment variables (use the recommended Prisma/PlanetScale connection string).
- Set `ADMIN_JWT_SECRET` and `NEXT_PUBLIC_GEMINI_API_KEY` in Vercel env.
- Deploy the app to Vercel.

If you want, I can run through each step with you and produce the exact commands and env values to use for PlanetScale and Vercel.
