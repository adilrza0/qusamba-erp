import { Router } from 'express';
import {
  getFinishedGoods,
  getFinishedGoodById,
  createFinishedGood,
  updateFinishedGood,
  deleteFinishedGood,
  adjustFinishedStock,
} from '../controllers/finishedGoodController.js';

const router = Router();

router.route('/')
  .get(getFinishedGoods)
  .post(createFinishedGood);

router.route('/:id')
  .get(getFinishedGoodById)
  .put(updateFinishedGood)
  .delete(deleteFinishedGood);

router.route('/:id/adjust-stock')
  .patch(adjustFinishedStock);

export default router;
