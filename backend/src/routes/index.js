import { Router } from 'express';

import { PostRoutes } from '../modules/post/post.route.js';
import { UserRoutes } from '../modules/user/user.route.js';
import { CommentRoutes } from '../modules/comment/comment.route.js';
import { AdminRoutes } from '../modules/admin/admin.route.js';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: UserRoutes,
  },
  {
    path: '/posts',
    route: PostRoutes,
  },
  {
    path: '/comments',
    route: CommentRoutes,
  },
  {
    path: '/admin',
    route: AdminRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
