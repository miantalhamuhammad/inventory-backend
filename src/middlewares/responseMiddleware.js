const ResponseMiddleware = (req, res, next) => {
    // Store the original status code
    const originalStatusCode = res.statusCode || 200;
    const path = req.url;

    // Custom response method for success
    res.success = (data = null, message = 'Success', code = originalStatusCode) => {
        const response = {
            succeeded: true,
            statusCode: code,
            message,
            timestamp: new Date().toISOString(),
            path,
        };

        // Handle paginated data
        if (data && data.items && Array.isArray(data.items)) {
            response.data = data.items;
            response.pagination = {
                total: data.total,
                page: data.page,
                limit: data.limit,
                totalPages: data.totalPages,
            };
        } else {
            response.data = data;
        }

        return res.status(code).json(response);
    };

    // Custom response method for error
    res.error = (message = 'Internal server error', code = 500, errors = null) => {
        return res.status(code).json({
            succeeded: false,
            statusCode: code,
            message,
            errors,
            timestamp: new Date().toISOString(),
            path,
        });
    };

    // Custom response method for validation errors
    res.validation = (errors = null) => {
        return res.status(422).json({
            succeeded: false,
            statusCode: 422,
            message: 'Validation failed',
            errors,
            timestamp: new Date().toISOString(),
            path,
        });
    };

    // Keep the old method names for backward compatibility
    res.successRes = res.success;
    res.errorRes = res.error;
    res.validationRes = res.validation;

    next();
};

export default ResponseMiddleware;