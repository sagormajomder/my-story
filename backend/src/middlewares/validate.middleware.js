import { ZodError } from 'zod';
import { HTTP_STATUS } from '../shared/constants.js';
import ApiError from '../utils/ApiError.js';

/**
 * Express middleware that validates req.body, req.query, and req.params
 * against a Zod schema shaped as: z.object({ body?, query?, params? })
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {import('express').RequestHandler}
 */
const validate = schema => (req, _res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if ('body' in parsed) req.body = parsed.body;
    if ('query' in parsed) req.query = parsed.query;
    if ('params' in parsed) req.params = parsed.params;

    return next();
  } catch (error) {
    if (error && error.name === 'ZodError') {
      const issues = error.issues || error.errors || [];
      const errors = issues.map(err => ({
        field: err.path && err.path.length ? err.path.join('.') : 'unknown',
        message: err.message,
      }));

      return next(
        new ApiError(HTTP_STATUS.BAD_REQUEST, 'Validation failed', errors),
      );
    }
    return next(error);
  }
};

export default validate;
