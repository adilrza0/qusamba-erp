import CompanyProfile from '../models/CompanyProfile.js';
import FinishedGood from '../models/FinishedGood.js';
import RawMaterial from '../models/RawMaterial.js';
import Buyer from '../models/Buyer.js';
import Karigar from '../models/Karigar.js';
import Invoice from '../models/Invoice.js';
import Payment from '../models/Payment.js';
import KarigarLog from '../models/KarigarLog.js';
import KarigarAdvance from '../models/KarigarAdvance.js';
import {
  INITIAL_COMPANY_PROFILE,
  INITIAL_FINISHED_GOODS,
  INITIAL_RAW_MATERIALS,
  INITIAL_BUYERS,
  INITIAL_KARIGARS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_KARIGAR_LOGS,
  INITIAL_KARIGAR_ADVANCES,
  CLEAN_PRODUCTION_PROFILE,
  CLEAN_PRODUCTION_FINISHED_GOODS,
  CLEAN_PRODUCTION_RAW_MATERIALS,
} from '../data/initialData.js';

/**
 * Seed initial data (DEMO Mode)
 * Populates sample bangles, buyers, invoices, and karigar logs for testing & training.
 */
export const seedDatabase = async (req, res, next) => {
  try {
    const { force = false } = req.body || {};

    const fgCount = await FinishedGood.countDocuments();
    if (fgCount > 0 && !force) {
      return res.json({ success: true, message: 'Database already populated' });
    }

    // Clear existing if force
    if (force) {
      await Promise.all([
        CompanyProfile.deleteMany({}),
        FinishedGood.deleteMany({}),
        RawMaterial.deleteMany({}),
        Buyer.deleteMany({}),
        Karigar.deleteMany({}),
        Invoice.deleteMany({}),
        Payment.deleteMany({}),
        KarigarLog.deleteMany({}),
        KarigarAdvance.deleteMany({}),
      ]);
    }

    await Promise.all([
      CompanyProfile.create(INITIAL_COMPANY_PROFILE),
      FinishedGood.insertMany(INITIAL_FINISHED_GOODS),
      RawMaterial.insertMany(INITIAL_RAW_MATERIALS),
      Buyer.insertMany(INITIAL_BUYERS),
      Karigar.insertMany(INITIAL_KARIGARS),
      Invoice.insertMany(INITIAL_INVOICES),
      Payment.insertMany(INITIAL_PAYMENTS),
      KarigarLog.insertMany(INITIAL_KARIGAR_LOGS),
      KarigarAdvance.insertMany(INITIAL_KARIGAR_ADVANCES),
    ]);

    if (res && res.json) {
      res.json({
        success: true,
        mode: 'demo',
        message: force ? 'Database reset to demo data!' : 'Database seeded successfully with demo data!',
      });
    }
  } catch (err) {
    if (next) next(err);
    else throw err;
  }
};

/**
 * Clean Slate Production Initialization
 * Keeps standard product master & raw material master templates with 0 stock,
 * and completely purges all dummy buyers, invoices, payments, and artisan logs.
 */
export const cleanSlateDatabase = async (_req, res, next) => {
  try {
    await Promise.all([
      CompanyProfile.deleteMany({}),
      FinishedGood.deleteMany({}),
      RawMaterial.deleteMany({}),
      Buyer.deleteMany({}),
      Karigar.deleteMany({}),
      Invoice.deleteMany({}),
      Payment.deleteMany({}),
      KarigarLog.deleteMany({}),
      KarigarAdvance.deleteMany({}),
    ]);

    await Promise.all([
      CompanyProfile.create(CLEAN_PRODUCTION_PROFILE),
      FinishedGood.insertMany(CLEAN_PRODUCTION_FINISHED_GOODS),
      RawMaterial.insertMany(CLEAN_PRODUCTION_RAW_MATERIALS),
    ]);

    res.json({
      success: true,
      mode: 'production',
      message: 'Production database initialized! Zero mock transactions, ready for live factory operations.',
    });
  } catch (err) {
    if (next) next(err);
    else throw err;
  }
};

/**
 * Clear All Demo Transactions
 * Wipes out all invoices, payments, karigar work logs, and advances.
 * Resets buyer balances and karigar balances to ₹0, but preserves product catalogs and company profiles!
 */
export const clearTransactions = async (_req, res, next) => {
  try {
    await Promise.all([
      Invoice.deleteMany({}),
      Payment.deleteMany({}),
      KarigarLog.deleteMany({}),
      KarigarAdvance.deleteMany({}),
      Buyer.updateMany({}, {
        $set: {
          totalPurchases: 0,
          totalPaid: 0,
          outstandingBalance: 0,
          overdueDays: 0,
        }
      }),
      Karigar.updateMany({}, {
        $set: {
          totalDozensProduced: 0,
          totalEarned: 0,
          totalAdvances: 0,
          netPayable: 0,
        }
      })
    ]);

    res.json({
      success: true,
      message: 'All demo invoices, payments, and work logs purged! Accounts reset to ₹0 balance.',
    });
  } catch (err) {
    if (next) next(err);
    else throw err;
  }
};

export const exportAllData = async (_req, res, next) => {
  try {
    const [
      companyProfile,
      finishedGoods,
      rawMaterials,
      buyers,
      karigars,
      invoices,
      payments,
      karigarLogs,
      karigarAdvances,
    ] = await Promise.all([
      CompanyProfile.findOne(),
      FinishedGood.find(),
      RawMaterial.find(),
      Buyer.find(),
      Karigar.find(),
      Invoice.find(),
      Payment.find(),
      KarigarLog.find(),
      KarigarAdvance.find(),
    ]);

    res.json({
      timestamp: new Date().toISOString(),
      companyProfile,
      finishedGoods,
      rawMaterials,
      buyers,
      karigars,
      invoices,
      payments,
      karigarLogs,
      karigarAdvances,
    });
  } catch (err) {
    next(err);
  }
};

export const importAllData = async (req, res, next) => {
  try {
    const data = req.body;
    if (!data) {
      res.status(400);
      throw new Error('No data provided');
    }

    await Promise.all([
      data.companyProfile ? (async () => {
        await CompanyProfile.deleteMany({});
        await CompanyProfile.create(data.companyProfile);
      })() : null,
      data.finishedGoods ? (async () => {
        await FinishedGood.deleteMany({});
        await FinishedGood.insertMany(data.finishedGoods);
      })() : null,
      data.rawMaterials ? (async () => {
        await RawMaterial.deleteMany({});
        await RawMaterial.insertMany(data.rawMaterials);
      })() : null,
      data.buyers ? (async () => {
        await Buyer.deleteMany({});
        await Buyer.insertMany(data.buyers);
      })() : null,
      data.karigars ? (async () => {
        await Karigar.deleteMany({});
        await Karigar.insertMany(data.karigars);
      })() : null,
      data.invoices ? (async () => {
        await Invoice.deleteMany({});
        await Invoice.insertMany(data.invoices);
      })() : null,
      data.payments ? (async () => {
        await Payment.deleteMany({});
        await Payment.insertMany(data.payments);
      })() : null,
      data.karigarLogs ? (async () => {
        await KarigarLog.deleteMany({});
        await KarigarLog.insertMany(data.karigarLogs);
      })() : null,
      data.karigarAdvances ? (async () => {
        await KarigarAdvance.deleteMany({});
        await KarigarAdvance.insertMany(data.karigarAdvances);
      })() : null,
    ]);

    res.json({ success: true, message: 'Backup restored to MongoDB successfully!' });
  } catch (err) {
    next(err);
  }
};
