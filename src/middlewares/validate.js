const { z } = require('zod');

/**
 * Zod Validation Middleware Factory
 * Takes a Zod schema and returns an Express middleware that validates
 * the request against it. On failure, returns 400 with structured errors.
 */
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details,
        },
      });
    }
    next(error);
  }
};

module.exports = validate;
