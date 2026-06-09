import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import { HTTP_STATUS } from '../shared/constants.js';
import ApiError from '../utils/ApiError.js';

const authenticate = (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        'Authentication required. Please log in.',
      );
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(
        new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          'Session expired. Please log in again.',
        ),
      );
    }
    if (error.name === 'JsonWebTokenError') {
      return next(
        new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          'Invalid token. Please log in again.',
        ),
      );
    }
    return next(error);
  }
};

export default authenticate;
