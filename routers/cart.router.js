import express from 'express';
import {
  addCart,
  deleteCart,
  getCart,
} from '../controllers/cart.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
const router = express.Router();

router.get('/get-cart', verifyToken, getCart);
router.post('/add-to-cart', verifyToken, addCart);
router.put('/delete-to-cart/:id', verifyToken, deleteCart);

export default router;
