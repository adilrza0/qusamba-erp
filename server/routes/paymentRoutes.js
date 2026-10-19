import { Router } from 'express';
import {
  getPayments,
  createPayment,
} from '../controllers/paymentController.js';

const router = Router();

router.route('/')
  .get(getPayments)
  .post(createPayment);

export default router;
