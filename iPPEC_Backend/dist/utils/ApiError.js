export class ApiError extends Error {
    statusCode;
    isOperational;
    /**
     * Creates a structured API error.
     * @param statusCode The HTTP status code of the error.
     * @param message The error message.
     * @param isOperational A flag to distinguish between operational errors and programmer errors.
     * @param stack The stack trace (optional).
     */
    constructor(statusCode, message, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
//# sourceMappingURL=ApiError.js.map