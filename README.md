# De.Amoura Chatbot & E-Commerce 🌸

A modern e-commerce platform for Hijab products featuring an **AI Chatbot ("Amoura")** that can answer customer questions, check stock, and recommend products based on real-time database content. Built with Next.js 15, Prisma, and Google Gemini AI.

## 📋 Prerequisites

Before you begin, ensure you have the following:

1.  **Node.js** (v18 or higher)
2.  **MySQL Database** (Local or Cloud like PlanetScale/Railway)
3.  **Cloudinary Account** (for image storage)
4.  **Google AI Studio Account** (for Chatbot)

---

## 🔑 Required API Keys & Secrets

To make this project work, you need 3 main external services. Get these keys ready before running the project.

### 1. Database (MySQL)
You need a connection string.
- **Format**: `mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME`
- **Example**: `mysql://root:password@localhost:3306/deamoura_db`

### 2. Google Gemini AI (Chatbot)
Required for "Amoura" to answer questions.
- Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
- Create a new API Key.
- Variable Name: `NEXT_PUBLIC_GEMINI_API_KEY`

### 3. Cloudinary (Image Storage)
Required for uploading product images in the Admin Panel.
- Register at [Cloudinary](https://cloudinary.com/).
- Go to Dashboard to find: `Cloud Name`, `API Key`, `API Secret`.

---

## 🛠️ Installation & Setup

Follow these steps to clone and run the project.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/deamoura-chatbot-ai.git
cd deamoura-chatbot-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a file named `.env` in the root directory. Copy the content below and fill in your keys:

```ini
# --- DATABASE ---
# Replace with your actual MySQL URL
DATABASE_URL="mysql://root:password@localhost:3306/deamoura"

# --- AUTHENTICATION ---
# Generate a random string (e.g., using `openssl rand -hex 32`)
ADMIN_JWT_SECRET="changeme_to_a_secure_random_string_at_least_32_chars"

# --- GOOGLE GEMINI AI ---
# Get from: https://aistudio.google.com/app/apikey
NEXT_PUBLIC_GEMINI_API_KEY="AIzaSy..."

# --- CLOUDINARY (IMAGES) ---
# Get from: https://cloudinary.com/console
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# --- APP URL ---
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Setup Database
Run the following commands to create tables and generate the Prisma client:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to your database (creates tables)
npx prisma db push
```

### 5. Create Admin Account
To access the Admin Panel, you need an admin account. Run this script to create a default admin:

```bash
# Creates user: admin@deamoura.com / password
npx tsx scripts/reset-admin.ts
```

---

## 🚀 Running the Project

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Storefront**: `http://localhost:3000`
- **Admin Login**: `http://localhost:3000/admin-login` (Use `admin@deamoura.com` / `password`)

---

## 🧠 How the AI Works

The Chatbot ("Amoura") is located in `src/lib/gemini-service.ts`.

1.  **Context Retrieval**: When a user asks a question, the system searches the database for relevant **Products** and **FAQs** using fuzzy keyword matching.
2.  **Prompt Injection**: The found product details (Price, Stock, Material) are formatted and injected into the System Prompt.
3.  **Generation**: Google Gemini generates a response based on the strict persona of "Amoura" (Friendly, helpful) and the provided data.

To modify the AI behavior, edit `src/lib/gemini-service.ts`.

---

## 📂 Project Structure

- `app/(admin)`: Protected Admin routes.
- `app/(shop)`: Public storefront routes.
- `app/api`: Backend API endpoints (Next.js App Router).
- `lib/prisma.ts`: Database connection instance.
- `lib/gemini-service.ts`: AI Chatbot logic.
- `lib/cloudinary.ts`: Image upload logic.
- `prisma/schema.prisma`: Database schema definition.

---

## 🆘 Troubleshooting

- **Image Upload Error**: Check if your Cloudinary credentials in `.env` are correct.
- **AI Not Replying**: Check `NEXT_PUBLIC_GEMINI_API_KEY`. Also check console logs for "Quota Exceeded".
- **Database Error**: Ensure your MySQL server is running and `DATABASE_URL` is correct.

