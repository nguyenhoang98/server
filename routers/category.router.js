import express from 'express';
import {
  categoryCreateController,
  categoryGetController,
  categoryUpdateController,
  categoryDeleteController,
} from '../controllers/category.controller.js';
import {
  middleAdmin,
  middleAdminBlock,
  verifyToken,
} from '../middleware/auth.middleware.js';

const router = express.Router();

router.post(
  '/create',
  verifyToken,
  middleAdmin,
  middleAdminBlock,
  categoryCreateController
);
router.get('/get', categoryGetController);
router.put(
  '/update/:id',
  verifyToken,
  middleAdmin,
  middleAdminBlock,
  categoryUpdateController
);
router.delete(
  '/delete/:id',
  verifyToken,
  middleAdmin,
  middleAdminBlock,
  categoryDeleteController
);

export default router;
