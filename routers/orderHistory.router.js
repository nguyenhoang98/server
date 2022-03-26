import express from 'express';
import {
  getOrderHistory,
  postOrderHistory,
} from '../controllers/orderHistory.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/get', verifyToken, getOrderHistory);
router.post('/post', verifyToken, postOrderHistory);

export default router;
