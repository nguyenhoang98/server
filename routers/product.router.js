import express from 'express';
import {
  verifyToken,
  middleAdmin,
  middleAdminBlock,
} from '../middleware/auth.middleware.js';
import {
  createProductController,
  deleteProductController,
  getProductController,
  ratingController,
  updateProductController,
} from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', getProductController);
router.post(
  '/create',
  verifyToken,
  middleAdmin,
  middleAdminBlock,
  createProductController
);
router.delete(
  '/delete/:id',
  verifyToken,
  middleAdmin,
  middleAdminBlock,
  deleteProductController
);
router.put(
  '/update/:id',
  verifyToken,
  middleAdmin,
  middleAdminBlock,
  updateProductController
);
router.post('/rating/:id', verifyToken, ratingController);

export default router;
