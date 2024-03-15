import {
    DuplicateParameterError,
    InvalidPropertyError
} from '../error/errors.js';

function errorHandler(err, req, res, next) {
    try {
        console.error(err);
        if (isMongoError(err)) {
            err = mongoError(err);
        }
        return res.status(err.httpCode || 500).json({
            error: err.message + '.'
        });
    } catch (error) {
        return res.status(500).send('FATAL server error, Contact developer.')
    }
}

function isMongoError(err) {
    if (err.name === 'ValidationError' || (err.code && err.code == 11000)) return true;
    return false;
}

function mongoError(err) {
    if (err.name === 'ValidationError') return handleValidationError(err);
    else if (err.code && err.code == 11000) return handleDuplicateKeyError(err);
}

const handleValidationError = (err) => {
    let errors = Object.values(err.errors).map(el => el.message);
    (errors.length > 1) ? errors = errors.join('\n') : null;
    return new InvalidPropertyError(`${errors}`);

}

const handleDuplicateKeyError = (err) => {
    // const field = Object.keys(err.keyValue);
    // const value = Object.values(err.keyValue);
    if (process.platform === 'win32') {
        return new DuplicateParameterError(`${Object.values(err.keyValue)} ${Object.keys(err.keyValue)}`);
    } else {
        return new DuplicateParameterError(`${err.message.split('{')[1].split('}')[0]}`);
    }
}

export default errorHandler;