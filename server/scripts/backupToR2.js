#!/usr/bin/env node

/**
 * ──────────────────────────────────────────────────────────────────
 *  MongoDB → Cloudflare R2  Automated Backup Script
 * ──────────────────────────────────────────────────────────────────
 *
 *  What it does:
 *    1. Exports every collection in the database to JSON files.
 *    2. Compresses them into a single .tar.gz archive.
 *    3. Uploads the archive to Cloudflare R2.
 *    4. Cleans up all temporary local files.
 *
 *  Usage:
 *    node scripts/backupToR2.js          # Run manually
 *    npm run backup                      # Via package.json script
 *
 *  Can also be triggered on a schedule via node-cron in server.js.
 *  See the `scheduleBackups()` function at the bottom of server.js.
 * ──────────────────────────────────────────────────────────────────
 */

import 'dotenv/config';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import archiver from 'archiver';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import mongoose from 'mongoose';
import r2Client from '../config/r2.js';

// ─── Resolve paths relative to this script ─────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const TMP_DIR    = path.join(__dirname, '..', 'tmp');

/**
 * Build a timestamped filename: backup_2026-10-14_173000.tar.gz
 */
const getTimestamp = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
  ].join('-') + '_' + [
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join('');
};

/**
 * Strategy A — mongodump (preferred if mongodump is installed).
 * Falls back to Strategy B if mongodump is unavailable.
 */
const tryMongodump = (dumpDir) => {
  try {
    execSync(`mongodump --uri="${process.env.MONGO_URI}" --out="${dumpDir}" --gzip`, {
      stdio: 'pipe',
    });
    console.log('📦  mongodump completed successfully.');
    return true;
  } catch {
    console.warn('⚠️   mongodump not found or failed — falling back to JSON export.');
    return false;
  }
};

/**
 * Strategy B — Pure-Mongoose JSON export.
 * Iterates all collections, dumps each as a JSON file.
 */
const jsonExport = async (dumpDir) => {
  const conn = mongoose.connection;
  const collections = await conn.db.listCollections().toArray();

  for (const { name } of collections) {
    const docs = await conn.db.collection(name).find({}).toArray();
    const filePath = path.join(dumpDir, `${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(docs, null, 2));
    console.log(`   └─ exported ${name} (${docs.length} docs)`);
  }

  console.log('📦  JSON export completed.');
};

/**
 * Compress the dump directory into a .tar.gz archive.
 * Returns the path to the archive.
 */
const compressDir = (sourceDir, archivePath) => {
  return new Promise((resolve, reject) => {
    const output  = fs.createWriteStream(archivePath);
    const archive = archiver('tar', { gzip: true, gzipOptions: { level: 9 } });

    output.on('close', () => {
      const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
      console.log(`🗜️   Archive created: ${sizeMB} MB`);
      resolve(archivePath);
    });

    archive.on('error', reject);
    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
};

/**
 * Upload the archive to Cloudflare R2.
 */
const uploadToR2 = async (filePath, objectKey) => {
  const fileStream = fs.createReadStream(filePath);
  const fileStat   = fs.statSync(filePath);

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: objectKey,
    Body: fileStream,
    ContentLength: fileStat.size,
    ContentType: 'application/gzip',
  });

  await r2Client.send(command);
  console.log(`☁️   Uploaded to R2: ${process.env.R2_BUCKET_NAME}/${objectKey}`);
};

/**
 * Remove the temporary directory and archive.
 */
const cleanup = (dirs) => {
  for (const d of dirs) {
    if (fs.existsSync(d)) {
      fs.rmSync(d, { recursive: true, force: true });
    }
  }
  console.log('🧹  Temp files cleaned up.');
};

// ─── Main Execution ─────────────────────────────────────────────
const runBackup = async () => {
  const timestamp   = getTimestamp();
  const dumpDir     = path.join(TMP_DIR, `dump_${timestamp}`);
  const archiveName = `backup_${timestamp}.tar.gz`;
  const archivePath = path.join(TMP_DIR, archiveName);

  console.log(`\n🚀  Starting backup — ${new Date().toISOString()}`);
  console.log(`   Target: R2 bucket "${process.env.R2_BUCKET_NAME}"\n`);

  // Ensure tmp directory exists
  fs.mkdirSync(dumpDir, { recursive: true });

  try {
    // Step 1 — Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅  Connected to MongoDB for backup.');

    // Step 2 — Export data (try mongodump first, fallback to JSON)
    const usedMongodump = tryMongodump(dumpDir);
    if (!usedMongodump) {
      await jsonExport(dumpDir);
    }

    // Step 3 — Compress
    await compressDir(dumpDir, archivePath);

    // Step 4 — Upload to Cloudflare R2
    await uploadToR2(archivePath, `backups/${archiveName}`);

    console.log('✅  Backup completed successfully.\n');
  } catch (err) {
    console.error('❌  Backup failed:', err.message);
    process.exitCode = 1;
  } finally {
    // Step 5 — Cleanup temp files & close DB connection
    cleanup([dumpDir, archivePath]);
    await mongoose.connection.close();
  }
};

// Run when executed directly (node scripts/backupToR2.js)
runBackup();

export default runBackup;
