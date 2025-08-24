import { CustomError } from '../utils/custom-error.js';

export const validateRequest = (schema) => {
    return (req, _res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errors = error.details.map((err) => ({
                field: err.path[0],
                message: err.message,
            }));
            throw new CustomError('Validation failed', 422, errors);
        }

        next();
    };
}; 