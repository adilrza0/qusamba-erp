import { Router } from 'express';
import {
  getBuyers,
  createBuyer,
  updateBuyer,
  deleteBuyer,
} from '../controllers/buyerController.js';

const router = Router();

router.route('/')
  .get(getBuyers)
  .post(createBuyer);

router.route('/:id')
  .put(updateBuyer)
  .delete(deleteBuyer);

export default router;
