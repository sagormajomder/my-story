import { Router } from 'express';
import authenticate from '../../middlewares/authenticate.middleware.js';
import authorize from '../../middlewares/authorize.middleware.js';
import {
  changeUserRole,
  deleteUser,
  getAllCommentsAdmin,
  getAllPostsAdmin,
  getAllUsers,
} from './admin.controller.js';

const router = Router();

// Secure all admin routes
router.use(authenticate, authorize('super_admin'));

router.get('/users', getAllUsers);
router.patch('/users/:id/role', changeUserRole);
router.delete('/users/:id', deleteUser);

router.get('/posts', getAllPostsAdmin);
router.get('/comments', getAllCommentsAdmin);

export const AdminRoutes = router;
