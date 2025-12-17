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

### 1. Database (Azure MySQL)
You need credentials for your Azure MySQL Flexible Server.
- **Host**: `your-server.mysql.database.azure.com`
- **User**: `your_username`
- **Password**: `your_password`
- **Database**: `deamoura` (Will be created automatically if missing)
- **SSL**: `true`

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
# --- DATABASE (Azure MySQL) ---
DB_HOST="your-server.mysql.database.azure.com"
DB_USER="your_username"
DB_PASSWORD="your_password"
DB_NAME="deamoura"
DB_PORT="3306"
DB_SSL="true"

# Kept for reference (optional)
# DATABASE_URL="..."

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

### 4. Setup Database & Admin Account
Run the setup script to:
1.  Connect to your Azure MySQL server.
2.  Create the database `deamoura` (if it doesn't exist).
3.  Create tables (`Product`, `Category`, `Faq`, `Admin`).
4.  **Seed Data**: Creates a default Admin user and sample products.

```bash
npm run db:setup
```

**Default Admin Credentials:**
- **Email**: `admin@deamoura.com`
- **Password**: `password`

---

## 🚀 Running the Project

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Storefront**: `http://localhost:3000`
- **Admin Login**: `http://localhost:3000/admin-login` (Use login above)

---

## 🧠 How the AI Works

The Chatbot ("Amoura") is located in `lib/gemini-service.ts`.

1.  **Context Retrieval**: When a user asks a question, the system searches the database for relevant **Products** and **FAQs** using SQL `LIKE` queries.
2.  **Prompt Injection**: The found product details are formatted and injected into the System Prompt.
3.  **Generation**: Google Gemini generates a response based on the strict persona of "Amoura" using the provided data.

---

## 📂 Project Structure

- `app/(admin)`: Protected Admin routes.
- `app/(shop)`: Public storefront routes.
- `app/api`: Backend API endpoints (Next.js App Router).
- `lib/db.ts`: MySQL connection pool and database helper functions (replaces Prisma).
- `lib/gemini-service.ts`: AI Chatbot logic.
- `lib/auth.ts`: Authentication and JWT logic.
- `scripts/setup-db.js`: Database initialization and seeding script.

---

## 🆘 Troubleshooting

- **Database Connection Error**: Double check your `DB_HOST`, `DB_USER`, and `DB_PASSWORD` in `.env`. Ensure your Azure firewall allows calling IP.
- **Image Upload Error**: Check if your Cloudinary credentials in `.env` are correct.
- **AI Not Replying**: Check `NEXT_PUBLIC_GEMINI_API_KEY`. Also check console logs for "Quota Exceeded".

