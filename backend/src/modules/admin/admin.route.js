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

// Authentication for all routes below
router.use(authenticate);

// Super Admin only routes
router.get('/users', authorize('super_admin'), getAllUsers);
router.patch('/users/:id/role', authorize('super_admin'), changeUserRole);
router.delete('/users/:id', authorize('super_admin'), deleteUser);

// Super Admin and Moderator routes
router.get('/posts', authorize('super_admin', 'moderator'), getAllPostsAdmin);
router.get('/comments', authorize('super_admin', 'moderator'), getAllCommentsAdmin);

export const AdminRoutes = router;
