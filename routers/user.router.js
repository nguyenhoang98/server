import express from 'express';
import {
  middleAdmin,
  middleAdminBlock,
  verifyToken,
} from '../middleware/auth.middleware.js';
import {
  checkLoginController,
  deleteUserController,
  getUsersController,
  loginController,
  registerController,
  updateRoleController,
  updateUserController,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/', verifyToken, checkLoginController);
router.get('/list', verifyToken, middleAdmin, getUsersController);
router.delete(
  '/delete/:id',
  verifyToken,
  middleAdmin,
  middleAdminBlock,
  deleteUserController
);
router.put('/update/:id', verifyToken, updateUserController);
router.put(
  '/update/role/:id',
  verifyToken,
  middleAdmin,
  middleAdminBlock,
  updateRoleController
);

export default router;
