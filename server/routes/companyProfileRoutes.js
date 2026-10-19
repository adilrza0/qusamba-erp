import { Router } from 'express';
import {
  getCompanyProfile,
  updateCompanyProfile,
} from '../controllers/companyProfileController.js';

const router = Router();

router.route('/')
  .get(getCompanyProfile)
  .put(updateCompanyProfile);

export default router;
