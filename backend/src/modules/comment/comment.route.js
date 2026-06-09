import { Router } from 'express';
import authenticate from '../../middlewares/authenticate.middleware.js';
import authorize from '../../middlewares/authorize.middleware.js';
import validateRequest from '../../middlewares/validate.middleware.js';
import {
  createComment,
  deleteComment,
  getMyCommentCount,
  getPostComments,
} from './comment.controller.js';
import { createCommentSchema } from './comment.validation.js';

const router = Router();

// Public route to view comments on a post
router.get('/post/:postId', getPostComments);

// Authenticated route for Dashboard stat
router.get('/my/count', authenticate, getMyCommentCount);

// Authenticated route to create a comment
// Block guest users from creating comments
router.post(
  '/',
  authenticate,
  authorize('user', 'moderator', 'super_admin'),
  validateRequest(createCommentSchema),
  createComment,
);

// Authenticated route to delete a comment (controller logic checks specific permissions)
router.delete(
  '/:id',
  authenticate,
  authorize('user', 'moderator', 'super_admin'),
  deleteComment,
);

export const CommentRoutes = router;
