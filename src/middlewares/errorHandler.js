import {ErrorResponse} from '../common/errorResponse'

export const errorHandler = (err, req, res, next) => {
    let error = {...err};

    error.message = err.message;

    if (err.name === null || err.name === undefined) {
        err.name = ""
    }
    // console log error for dev
    // console.log(err.stack.red);

    //Token error
    if (err.name === 'TokenExpiredError') {
        const message = 'Token has expired';
        error = new ErrorResponse(message, 401);
    }

    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = new ErrorResponse(message, 401);
    }

    if (err.name === 'NotBeforeError') {
        const message = 'Invalid token';
        error = new ErrorResponse(message, 401);
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    if (error.statusCode === undefined) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }else{
        res.status(error.statusCode).json({
            success: false,
            error: error.message
        });
    }

};

export const notFound = (req, res, next) => {
    res.status(404).json({
      message: 'Resource not found',
    });
    next();
  };
