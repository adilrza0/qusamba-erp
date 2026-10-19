import { Router } from 'express';
import {
  getRawMaterials,
  createRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
  adjustRawStock,
} from '../controllers/rawMaterialController.js';

const router = Router();

router.route('/')
  .get(getRawMaterials)
  .post(createRawMaterial);

router.route('/:id')
  .put(updateRawMaterial)
  .delete(deleteRawMaterial);

router.route('/:id/adjust-stock')
  .patch(adjustRawStock);

export default router;
