import { Router } from 'express';
import validateRequest from '../../middlewares/validate.middleware.js';
import { loginUser, logoutUser, registerUser } from './user.controller.js';
import { userLoginValidationSchema, userRegistrationValidationSchema } from './user.validation.js';

const router = Router();

router.post(
  '/register',
  validateRequest(userRegistrationValidationSchema),
  registerUser,
);

router.post(
  '/login',
  validateRequest(userLoginValidationSchema),
  loginUser,
);

router.post('/logout', logoutUser);

export const UserRoutes = router;
