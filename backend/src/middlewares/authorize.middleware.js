import { HTTP_STATUS } from '../shared/constants.js';
import ApiError from '../utils/ApiError.js';

const authorize =
  (...allowedRoles) =>
  (req, _res, next) => {
    if (!req.user) {
      return next(
        new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Authentication required.'),
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          HTTP_STATUS.FORBIDDEN,
          `Access denied. This action requires one of the following roles: ${allowedRoles.join(', ')}.`,
        ),
      );
    }

    return next();
  };

export default authorize;
