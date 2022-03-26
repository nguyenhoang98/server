import express from 'express';
import {
  provincesController,
  districtController,
  wardsController,
} from '../controllers/option.controller.js';

const router = express.Router();

router.get('/address/provinces', provincesController);
router.get('/address/districts/:province_code', districtController);
router.get('/address/wards/:district_code', wardsController);

export default router;
