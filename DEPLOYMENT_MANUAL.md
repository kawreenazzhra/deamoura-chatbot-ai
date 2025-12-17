# Deployment Manual (Vercel)

This project uses Next.js and requires specific environment variables to function correctly on Vercel.

## 1. Environment Variables
Go to your Vercel Project Settings > **Environment Variables** and add the following:

| Variable Name | Description | Example Value (Do not use these exact values) |
| :--- | :--- | :--- |
| `DB_HOST` | Hostname of your Azure MySQL | `your-server.mysql.database.azure.com` |
| `DB_USER` | Database username | `your_username` |
| `DB_PASSWORD` | Database password | `your_secure_password` |
| `DB_NAME` | Database name | `deamoura` |
| `DB_PORT` | MySQL Port | `3306` |
| `DB_SSL` | Enable SSL for Azure | `true` |
| `NEXT_PUBLIC_GEMINI_API_KEY` | Google Gemini API Key | `AIzaSy...` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | `deamoura-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `123456789...` |
| `CLOUDINARY_API_SECRET` | Cloudinary Secret | `abc123secret...` |
| `ADMIN_JWT_SECRET` | Secret key for Admin JWT | `long_random_string_at_least_32_chars` |

> **Important**: For Azure MySQL, make sure `DB_SSL` is set to `true`.

## 2. Whitelist Vercel IP
Since Vercel uses dynamic IPs, you have two options for Azure Database Firewall:
1.  **Allow All Azure Services**: In Azure Portal > Connection Security, check "Allow access to Azure services".
2.  **(Recommended for Prod) Allow All IPs**: Temporarily allow `0.0.0.0` - `255.255.255.255` if secure, OR use a Vercel Integration to manage IPs.

## 3. Build Settings
-   **Framework Preset**: Next.js
-   **Build Command**: `next build` (default)
-   **Install Command**: `npm install` (default)

## 4. Troubleshooting
-   If you see "Database Error" or timeouts, check the Azure Firewall settings.
-   If Chatbot doesn't reply, check the `NEXT_PUBLIC_GEMINI_API_KEY` quota.
