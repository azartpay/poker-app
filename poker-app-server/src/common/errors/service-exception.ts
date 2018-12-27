class ServiceException extends Error {
    constructor(private statusCode: number, public message: string, private cause?: any) {
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
