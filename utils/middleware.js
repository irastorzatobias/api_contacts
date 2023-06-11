const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('./logger');

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    const errorResponseMap = {
        'CastError': { status: 400, message: 'malformatted id' },
        'ValidationError': { status: 400, message: error.message },
        'JsonWebTokenError': { status: 401, message: 'token missing or invalid' },
        'TokenExpiredError': { status: 401, message: 'token expired, login again' },
    };

    const errorResponse = errorResponseMap[error.name];

    if(errorResponse) {
        return response.status(errorResponse.status).json({ error: errorResponse.message });
    }

    next(error);
};

const getTokenFrom = request => {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7);
    }
    return null;
};

const tokenExtractor = (request, response, next) => {
    request.token = getTokenFrom(request);
    next();
};

const userExtractor = async (request, response, next) => {
    const token = getTokenFrom(request);

    if (token) {
        const decodedToken = jwt.verify(token, process.env.SECRET);
        if (!decodedToken.username) {
            return response.status(401).json({ error: 'token invalid' });
        }

        request.user = await User.findByPk(decodedToken.id);
    }

    next();
};

const checkAuthentication = async (request, response, next) => {
    if (!request.user) {
        return response.status(401).json({ error: 'token missing or invalid' });
    }

    next();
};

module.exports = {
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor,
    checkAuthentication
};