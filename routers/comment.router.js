import express from 'express';
import {
  deleteComment,
  getCommentController,
  postCommentController,
  updateComment,
} from '../controllers/comment.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/get/:productId', getCommentController);
router.post('/post/:productId', verifyToken, postCommentController);
router.delete('/delete/:commentId/:productId', verifyToken, deleteComment);
router.put('/update/:commentId/:productId', verifyToken, updateComment);

export default router;
