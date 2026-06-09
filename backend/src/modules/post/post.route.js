import { Router } from 'express';
import authenticate from '../../middlewares/authenticate.middleware.js';
import authorize from '../../middlewares/authorize.middleware.js';
import validateRequest from '../../middlewares/validate.middleware.js';
import {
  createPost,
  deletePost,
  getAllPosts,
  getMyPosts,
  getPostById,
  updatePost,
} from './post.controller.js';
import {
  createPostSchema,
  postIdParamSchema,
  updatePostSchema,
} from './post.validation.js';

const router = Router();

// ── Public ──────────────────────────────────────────────────────────────────
router.get('/', getAllPosts);
router.get('/my', authenticate, authorize('user', 'moderator', 'super_admin'), getMyPosts);
router.get('/:id', validateRequest(postIdParamSchema), getPostById);

// ── Protected: user / moderator / super_admin ────────────────────────────────
router.post(
  '/',
  authenticate,
  authorize('user', 'moderator', 'super_admin'),
  validateRequest(createPostSchema),
  createPost,
);

router.patch(
  '/:id',
  authenticate,
  authorize('user', 'moderator', 'super_admin'),
  validateRequest(updatePostSchema),
  updatePost,
);

router.delete(
  '/:id',
  authenticate,
  authorize('user', 'moderator', 'super_admin'),
  validateRequest(postIdParamSchema),
  deletePost,
);

export const PostRoutes = router;
