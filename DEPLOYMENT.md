# Qusamba ERP — Production Deployment Guide & Data Strategy

> **Enterprise Edition**: Handcrafted Bangle Manufacturing & Wholesale Distribution ERP  
> **Production Stack**: React 19 Frontend (Vite) + Express/Node.js API + MongoDB Atlas  
> **Hosting Model**: Single-port full-stack container/service OR decoupled client/server  

---

## 1. Mock Data Strategy & Production Data Architecture

### What Was Changed with Mock Data
Previously, initial demo transactions (sample invoices, dummy buyers, mock karigar advances) were hardcoded and automatically retained in the browser's local storage, even when connecting to a clean MongoDB database.

The following changes have been implemented:

1. **Self-Contained Server Data Module ([`server/data/initialData.js`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/server/data/initialData.js))**:
   - Eliminated fragile cross-directory imports (`../../src/data/mockData.js`).
   - Defined two distinct database states:
     - **`DEMO_DATA`**: Sample Kundan/Lac bangle catalog, sample Rajasthan/Delhi buyers, sample invoices, and karigar logs for onboarding or staff training.
     - **`CLEAN_PRODUCTION_DATA`**: Ready for live factory operations with **zero fake invoices, zero dummy buyers, zero mock payments, and zero fake artisan logs**. Product sizing matrices and HSN codes (`71179090`) are preserved with 0 stock, ready for real batch entries.

2. **Server-Level Initialization Modes (`AUTO_SEED`)**:
   Controlled via the `AUTO_SEED` environment variable in your server configuration:
   - `AUTO_SEED=clean` *(Default in Production)*: If MongoDB is completely empty, it sets up your clean business profile template, Indian bangle sizes (`2-2` to `2-12`), and zero dummy transactions.
   - `AUTO_SEED=demo` *(Default in Development)*: Populates the sample dataset for immediate feature verification.
   - `AUTO_SEED=false`: Leaves the database completely unseeded for custom migrations.

3. **In-App Production Database Controls in Settings**:
   Factory administrators can manage the database live from the **Settings & Business Profile** tab:
   - **"Initialize Clean Slate"**: Wipes all demo records and establishes a pristine production state with 0 transactions.
   - **"Purge Demo Transactions"**: Wipes all invoices, receipts, and work logs, resetting customer khata and artisan balances to ₹0 while preserving your bangle designs and raw material masters.
   - **"Load Demo Dataset"**: Restores the sample demonstration data at any time for new user onboarding.
   - **"Export Full ERP Backup (JSON)"**: One-click download of all MongoDB Atlas collections.
   - **"Restore from Backup File"**: Upload a previous JSON backup to restore live state.

4. **True Single Source of Truth Syncing ([`AppContext.jsx`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/src/context/AppContext.jsx))**:
   - Fixed the frontend state sync logic so empty arrays (`[]`) from MongoDB are respected. If your production database has 0 invoices, the UI shows 0 invoices rather than falling back to demo records.

---

## 2. Production Build & Static Serving Architecture

The backend Express application ([`server/server.js`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/server/server.js)) is configured as a production-grade full-stack server:
- Automatically serves the compiled frontend assets from `dist/` using `express.static`.
- Handles Single Page Application (SPA) client routing: all non-API web traffic automatically falls back to `dist/index.html`.
- Preserves `/api/*` routes for all ERP REST operations.
- Automatically handles CORS whether accessing from same-origin (production) or Vite dev server (development).
- Implements HTTP security headers via `helmet` configured for Google Fonts and interactive confetti animations.

---

## 3. Recommended Deployment Options

### Option A: Render (Easiest Full-Stack Deployment)

Render allows you to host the frontend and backend together on a single Web Service.

1. **Push your repository to GitHub / GitLab**.
2. **Create a New Web Service on [Render Dashboard](https://dashboard.render.com/)**:
   - Connect your Qusamba ERP repository.
   - **Environment**: `Node`
   - **Build Command**:
     ```bash
     npm install && npm run build && cd server && npm install
     ```
   - **Start Command**:
     ```bash
     cd server && npm start
     ```
3. **Configure Environment Variables** in the Render settings:
   | Variable | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production caching & static serving |
   | `PORT` | `5000` (or `10000`) | Port assigned by Render |
   | `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection URI |
   | `AUTO_SEED` | `clean` | Initializes clean production slate with 0 dummy records |
   | `JWT_SECRET` | *(64-char random hex)* | Used for session & API token verification |

4. Click **Deploy Web Service**. Your ERP will be live at `https://your-app-name.onrender.com`.

---

### Option B: Docker Container Deployment (Railway, Fly.io, DigitalOcean, VPS)

A multi-stage [`Dockerfile`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/Dockerfile) and [`docker-compose.yml`](file:///c:/Users/adilr/Desktop/Qusamba%20ERP/docker-compose.yml) are included in the repository.

#### To deploy with Docker Compose:
```bash
# 1. Clone the repository on your server
git clone <your-repo-url>
cd "Qusamba ERP"

# 2. Set your environment variables in server/.env or export them:
export MONGO_URI="mongodb+srv://<user>:<password>@cluster0.mongodb.net/QusambaERP?retryWrites=true&w=majority"
export AUTO_SEED="clean"
export NODE_ENV="production"

# 3. Build and launch the container
docker compose up -d --build

# 4. Verify running status
docker compose ps
docker compose logs -f
```

---

### Option C: Decoupled Deployment (Vercel Frontend + Render Backend)

If you prefer hosting the React client on Vercel and the Express API on Render:

1. **Deploy Backend (Render / Railway)**:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Add Environment Variable: `CLIENT_URL=https://your-frontend.vercel.app`

2. **Deploy Frontend (Vercel)**:
   - Root Directory: `./` (project root)
   - Framework Preset: `Vite`
   - Add Environment Variable:
     ```env
     VITE_API_URL=https://your-backend.onrender.com
     ```
   - Deploy. The frontend will route all API requests to your remote backend.

---

## 4. Production MongoDB Atlas Checklist

Before opening the ERP for live factory transactions:

1. **Network Access / IP Whitelisting**:
   - In MongoDB Atlas Console → **Network Access**, ensure your cloud server's IP is allowed (or `0.0.0.0/0` with strong password authentication).
2. **Dedicated Database User**:
   - Create a dedicated user with `readWrite` permissions strictly scoped to the `QusambaERP` database.
3. **Automated Cloud Backups (Optional Cloudflare R2)**:
   - If using off-site S3-compatible backups, set `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, and `R2_BUCKET_NAME` in `server/.env`.
   - The server will run an automated backup daily at 02:00 AM IST (`cron: 0 2 * * *`).

---

## 5. Post-Deployment Verification Steps

Once your deployment is live:

1. Visit `https://your-domain/api/health` → verify response:
   ```json
   { "success": true, "status": "healthy", "environment": "production", "deploymentReady": true }
   ```
2. Visit the main URL `https://your-domain/` → verify the dashboard loads with the **"MongoDB Online"** green indicator.
3. Open **Settings & Business Profile**:
   - Enter your real factory legal name, Trade Name, 15-digit GSTIN, Bank Account / IFSC, and UPI ID.
   - Click **Save Business Profile**.
   - If you wish to start with completely empty ledgers, click **Initialize Clean Slate**.
4. Test creating a live wholesale tax invoice and verifying the printable A4 tax bill.
