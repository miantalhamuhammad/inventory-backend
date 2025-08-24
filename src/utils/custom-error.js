class CustomError extends Error {
    constructor(message, statusCode = 500, errors = null) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends CustomError {
    constructor(errors) {
        super('Validation Error', 422, errors);
    }
}

class DatabaseError extends CustomError {
    constructor(message = 'Database Error', errors = null) {
        super(message, 500, errors);
    }
}

class AuthenticationError extends CustomError {
    constructor(message = 'Authentication Error') {
        super(message, 401);
    }
}

class AuthorizationError extends CustomError {
    constructor(message = 'Authorization Error') {
        super(message, 403);
    }
}

class NotFoundError extends CustomError {
    constructor(resource, identifier = '') {
        const message = identifier
            ? `${resource} with identifier ${identifier} not found`
            : `${resource} not found`;
        super(message, 404);
        this.resource = resource;
        this.identifier = identifier;
    }
}



export {
    CustomError,
    ValidationError,
    DatabaseError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
};

