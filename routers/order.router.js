import express from 'express';
import {
  completeOrderController,
  deleteOrderController,
  deliveryOrderController,
  getOrderController,
  postOrderController,
} from '../controllers/order.controller.js';
import {
  middleAdmin,
  middleAdminBlock,
  verifyToken,
} from '../middleware/auth.middleware.js';
const router = express.Router();

router.get('/get', verifyToken, middleAdmin, getOrderController);
router.post('/post', verifyToken, postOrderController);
router.delete(
  '/delete/:id',
  verifyToken,
  middleAdmin,
  middleAdminBlock,
  deleteOrderController
);
router.put(
  '/delivery/:id',
  verifyToken,
  middleAdmin,
  middleAdminBlock,
  deliveryOrderController
);
router.put(
  '/complete/:id',
  verifyToken,
  middleAdmin,
  middleAdminBlock,
  completeOrderController
);
export default router;
