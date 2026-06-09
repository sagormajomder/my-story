import { Router } from 'express';
import validateRequest from '../../middlewares/validate.middleware.js';
import { registerUser } from './user.controller.js';
import { userRegistrationValidationSchema } from './user.validation.js';

const router = Router();

router.post(
  '/register',
  validateRequest(userRegistrationValidationSchema),
  registerUser,
);

export const UserRoutes = router;
