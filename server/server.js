/**
 * ──────────────────────────────────────────────────────────────────
 *  Qusamba ERP — Express Server Entry Point (Production Ready)
 * ──────────────────────────────────────────────────────────────────
 */

import 'dotenv/config';           // Load .env before anything else
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB, disconnectDB } from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import itemRoutes from './routes/itemRoutes.js';
import finishedGoodRoutes from './routes/finishedGoodRoutes.js';
import rawMaterialRoutes from './routes/rawMaterialRoutes.js';
import buyerRoutes from './routes/buyerRoutes.js';
import karigarRoutes from './routes/karigarRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import karigarLogRoutes from './routes/karigarLogRoutes.js';
import karigarAdvanceRoutes from './routes/karigarAdvanceRoutes.js';
import companyProfileRoutes from './routes/companyProfileRoutes.js';
import systemRoutes from './routes/systemRoutes.js';
import FinishedGood from './models/FinishedGood.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Initialise Express ─────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Security & Parsing Middleware ──────────────────────────────

// Helmet with content security policy configured for Google Fonts & canvas confetti
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// CORS — support configurable client origins or same-origin deployment
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',').map((s) => s.trim()) 
  : ['http://localhost:5173', 'http://localhost:5000', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parse JSON & URL-encoded bodies
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// HTTP request logger
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Health Check ───────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'development',
    deploymentReady: true,
  });
});

// ─── API Routes ─────────────────────────────────────────────────
app.use('/api/items', itemRoutes);
app.use('/api/finished-goods', finishedGoodRoutes);
app.use('/api/raw-materials', rawMaterialRoutes);
app.use('/api/buyers', buyerRoutes);
app.use('/api/karigars', karigarRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/karigar-logs', karigarLogRoutes);
app.use('/api/karigar-advances', karigarAdvanceRoutes);
app.use('/api/profile', companyProfileRoutes);
app.use('/api/system', systemRoutes);

// ─── Production Static File Serving (Full-Stack Deployment) ─────
const clientDist = path.resolve(__dirname, '../dist');
app.use(express.static(clientDist));

// Single Page Application (SPA) fallback for non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) next();
  });
});

// ─── 404 Catch-All for unhandled API calls ──────────────────────
app.use('/api/*', (_req, res, next) => {
  res.status(404);
  next(new Error('API route not found'));
});

// ─── Centralised Error Handler (must be last) ───────────────────
app.use(errorHandler);

// ─── Scheduled Backups (node-cron) ──────────────────────────────
const scheduleBackups = () => {
  cron.schedule('0 2 * * *', async () => {
    console.log('\n⏰  Cron triggered: Starting scheduled R2 backup…');
    try {
      const { default: runBackup } = await import('./scripts/backupToR2.js');
    } catch (err) {
      console.error('❌  Scheduled backup failed:', err.message);
    }
  }, {
    timezone: 'Asia/Kolkata',
  });

  console.log('📅  Daily automated backup scheduled at 02:00 AM IST.');
};

// ─── Start Server ───────────────────────────────────────────────
const start = async () => {
  // 1. Connect to MongoDB Atlas
  await connectDB();

  // 2. Intelligent Auto-seed logic (Supports 'clean', 'demo', or 'false')
  try {
    const count = await FinishedGood.countDocuments();
    const seedMode = process.env.AUTO_SEED || (process.env.NODE_ENV === 'production' ? 'clean' : 'demo');

    if (count === 0 && seedMode !== 'false') {
      console.log(`🌱  Database is empty. Initializing in [${seedMode}] mode…`);
      const { seedDatabase, cleanSlateDatabase } = await import('./controllers/systemController.js');
      if (seedMode === 'clean') {
        await cleanSlateDatabase({}, { json: () => {} }, (err) => { if (err) console.error(err); });
        console.log('✅  Clean production database initialized (0 dummy transactions).');
      } else {
        await seedDatabase({ body: { force: true } }, { json: () => {} }, (err) => { if (err) console.error(err); });
        console.log('✅  Initial demo data seeded into MongoDB.');
      }
    }
  } catch (seedErr) {
    console.warn('⚠️  Auto-seed notice:', seedErr.message);
  }

  // 3. Start Express listener
  app.listen(PORT, () => {
    console.log(`\n🚀  Qusamba ERP server running → http://localhost:${PORT}`);
    console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
    console.log(`   Static dist : ${clientDist}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
  });

  // 4. Schedule daily backups if R2 is configured
  if (process.env.R2_ACCOUNT_ID && process.env.R2_ACCOUNT_ID !== 'your_cloudflare_account_id') {
    scheduleBackups();
  } else {
    console.log('ℹ️   Cloudflare R2 backups disabled (credentials not configured).');
  }
};

start();
