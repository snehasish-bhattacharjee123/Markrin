const { z } = require('zod');

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
            const errors = Array.isArray(error.errors) ? error.errors : (error.issues || []);
            return res.status(400).json({
                message: 'Validation Error',
                errors: errors.map((err) => ({
                    path: err.path,
                    message: err.message,
                })),
            });
        }
        next(error);
    }
};

module.exports = validate;
