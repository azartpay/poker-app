class RepositoryException extends Error {
    constructor(...args: any[]) {
        super(...args);
        this.name = 'RepositoryException';
        Error.captureStackTrace(this, RepositoryException);
    }
}

export default RepositoryException;
