import { Router } from 'express';
import {
  getKarigars,
  createKarigar,
  updateKarigar,
  deleteKarigar,
  settleKarigar,
} from '../controllers/karigarController.js';

const router = Router();

router.route('/')
  .get(getKarigars)
  .post(createKarigar);

router.route('/:id')
  .put(updateKarigar)
  .delete(deleteKarigar);

router.route('/:id/settle')
  .post(settleKarigar);

export default router;
