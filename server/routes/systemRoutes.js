import { Router } from 'express';
import {
  seedDatabase,
  cleanSlateDatabase,
  clearTransactions,
  exportAllData,
  importAllData,
} from '../controllers/systemController.js';

const router = Router();

router.post('/seed', seedDatabase);
router.post('/clean-slate', cleanSlateDatabase);
router.post('/clear-transactions', clearTransactions);
router.get('/export', exportAllData);
router.post('/import', importAllData);

export default router;
