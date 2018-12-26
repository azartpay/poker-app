class RepositoryException extends Error {
    constructor(...args) {
        super(...args);
        this.name = 'RepositoryException';
        Error.captureStackTrace(this, RepositoryException);
    }
}

export default RepositoryException;