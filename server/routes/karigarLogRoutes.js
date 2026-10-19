import { Router } from 'express';
import {
  getKarigarLogs,
  createKarigarLog,
} from '../controllers/karigarLogController.js';

const router = Router();

router.route('/')
  .get(getKarigarLogs)
  .post(createKarigarLog);

export default router;
