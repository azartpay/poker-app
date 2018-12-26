class ServiceException extends Error {
    constructor(statusCode, message, cause) {
        super(message);
        this.statusCode = statusCode;
        this.cause = cause;
        this.name = 'ServiceException';
        Error.captureStackTrace(this, ServiceException);
        if (cause && cause.stack) {
            this.stack = this.stack + "\ncaused by " + cause.stack;
        }
    }
}

export default ServiceException;