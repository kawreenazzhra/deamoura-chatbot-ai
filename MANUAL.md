# 📘 DEAMOURA CHATBOT & E-COMMERCE - TEXTBOOK MANUAL

**Project Name:** DeAmoura Chatbot & E-Commerce
**Tech Stack:** Next.js 15, Azure MySQL (mysql2), Cloudinary, Google Gemini AI
**Version:** 1.0.0 (Prisma-Free Edition)

---

## 📑 TABLE OF CONTENTS

1.  [System Requirements](#1-system-requirements)
2.  [Installation (Step-by-Step)](#2-installation-step-by-step)
3.  [Configuration (.env)](#3-configuration-env)
4.  [Database Setup (Azure MySQL)](#4-database-setup-azure-mysql)
5.  [Running the Application](#5-running-the-application)
6.  [Admin Panel Guide](#6-admin-panel-guide)
7.  [Deployment Guide (Vercel)](#7-deployment-guide-vercel)
8.  [Troubleshooting](#8-troubleshooting)

---

## 1. SYSTEM REQUIREMENTS

Before you begin, verify you have the following installed/ready:

*   **Node.js**: Version v18.17.0 or higher.
    *   Check version: `node -v`
*   **Git**: For cloning the repository.
*   **Azure Account**: Active Azure subscription for MySQL Flexible Server.
*   **Google AI Studio**: Account for Gemini API Key.
*   **Cloudinary**: Account for image hosting.

---

## 2. INSTALLATION (STEP-BY-STEP)

Follow these exact commands to set up the project locally.

### Step 2.1: Clone the Repository
Open your terminal (Command Prompt/PowerShell) and navigate to your desired folder.

```bash
git clone https://github.com/your-username/deamoura-chatbot-ai.git
cd deamoura-chatbot-ai
```

### Step 2.2: Install Dependencies
This project uses `npm` (Node Package Manager).

```bash
npm install
```
*Wait for the installation to complete. It will download Next.js, React, mysql2, and other libraries.*

---

## 3. CONFIGURATION (.env)

The application relies on a `.env` file to store secret keys. Accessing the database or AI will fail without this.

**Action:** Create a new file named `.env` in the root folder (same level as `package.json`).
**Action:** Copy specific keys below into the file.

```ini
# =========================================
# 🗄️ DATABASE (Azure MySQL)
# =========================================
# Connection details for your Azure Flexible Server.
# IMPORTANT: Ensure your Azure Firewall allows your IP address.
DB_HOST="your-server-name.mysql.database.azure.com"
DB_USER="your_admin_username"
DB_PASSWORD="your_database_password"
DB_NAME="deamoura"
DB_PORT="3306"
DB_SSL="true"

# =========================================
# 🔒 AUTHENTICATION
# =========================================
# Random secret key for Admin Login sessions.
# You can generate a random string or just type a long sentence.
ADMIN_JWT_SECRET="secure_random_string_xyz_123_abc_456"

# =========================================
# 🤖 GOOGLE GEMINI AI
# =========================================
# Get API Key: https://aistudio.google.com/app/apikey
# Required for the Chatbot ("Amoura") to reply.
NEXT_PUBLIC_GEMINI_API_KEY="AIzaSy..."

# =========================================
# ☁️ CLOUDINARY (IMAGE UPLOAD)
# =========================================
# Get Keys: https://cloudinary.com/console
# Required for uploading product images.
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# =========================================
# 🌐 APP CONFIG
# =========================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 4. DATABASE SETUP (AZURE MYSQL)

We have a specialized script to initialize the database for you. This script assumes the **Database** `deamoura` might not exist yet, and it will confirm the connection, create tables, and seed initial data.

**Requirements:**
1.  Ensure `.env` handles are correct.
2.  **CRITICAL:** Go to Azure Portal -> Your MySQL Server -> Networking. Add your **Client IP Address** to the firewall rules.

**Run the Setup Script:**
```bash
npm run db:setup
```

**Expected Output:**
> ✅ Connected to server!
> 🔨 Creating database 'deamoura'...
> 🏗️ Creating tables...
> 🌱 Seeding data...
> ✨ Database setup complete!

---

## 5. RUNNING THE APPLICATION

Now you are ready to start the server.

```bash
npm run dev
```

*   **Status**: `✓ Ready in ... ms`
*   **URL**: `http://localhost:3000`

Open your browser and navigate to `http://localhost:3000`. You should see the E-Commerce homepage.

---

## 6. ADMIN PANEL GUIDE

To manage products (Add, Edit, Delete), you must log in as an Admin.

1.  **URL**: Go to `http://localhost:3000/admin-login`
2.  **Credentials**:
    *   **Email**: `admin@deamoura.com`
    *   **Password**: `password` (Default from seeding)

### Features:
*   **Dashboard**: Overview of products.
*   **Add Product**: Upload images, set prices, variants, and stock.
*   **Edit Product**: Change details or replace images. (Update Logic Verified)
*   **Delete Product**: Remove items permanently.

---

## 7. DEPLOYMENT GUIDE (VERCEL)

This project is optimized for deployment on Vercel.

1.  **Push to GitHub**:
    ```bash
    git add .
    git commit -m "Ready for deploy"
    git push origin main
    ```

2.  **Vercel Dashboard**:
    *   Click **"Add New..."** -> **Project**.
    *   Import your `deamoura-chatbot-ai` repository.

3.  **Configure Environment**:
    *   In the "Environment Variables" section, you **MUST** copy-paste every key-value pair from your local `.env` file (`DB_HOST`, `DB_USER`, `CLOUDINARY...`, etc.).

4.  **Deploy**:
    *   Click **"Deploy"**. Vercel will install dependencies and build the app.

**Note:** You do NOT need to run `npm run db:setup` on Vercel if you are connecting to the *same* Azure database you verified locally. The data is already there!

---

## 8. TROUBLESHOOTING

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **Connection ETIMEDOUT** | Azure Firewall blocking connection. | Add your IP (or `0.0.0.0` for public access) in Azure Portal Networking settings. |
| **Error: 1366 (Incorrect integer)** | Empty text sent to number field. | **Fixed**. Update your code to latest version (contains `safeInt` patch). |
| **Failed to save image** | Wrong Cloudinary Name/Key. | Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` matches your Cloudinary Dashboard EXACTLY. |
| **Chatbot not replying** | Gemini Key invalid or quota API. | Check Google AI Studio key status. Check terminal logs for specific API error. |

---
**Maintained by:** DeAmoura Team
**Last Updated:** Dec 2025
