import { Router } from 'express';
import {
  getKarigarAdvances,
  createKarigarAdvance,
} from '../controllers/karigarAdvanceController.js';

const router = Router();

router.route('/')
  .get(getKarigarAdvances)
  .post(createKarigarAdvance);

export default router;
