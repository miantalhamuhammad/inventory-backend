import logger from '../config/logger.js';
const loggerMiddleware = (req, res, next) => {
    // Log the request
    logger.info(JSON.stringify({
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('user-agent'),
    }));


    // Capture the response
    const originalSend = res.send;
    res.send = function send(data) {
        logger.info(`${req.method} ${req.url} -> ${req.ip} ${res.statusCode} ${Date.now() - req._startTime}ms`);
        originalSend.call(this, data);
    };

    req._startTime = Date.now();
    next();
};

export default loggerMiddleware;