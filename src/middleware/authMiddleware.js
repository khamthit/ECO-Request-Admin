const jwt = require('jsonwebtoken');
const { SendError } = require('../utils/response');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return SendError(res, 401, 'Unauthorized: No token provided.');
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify the token using the same secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user payload to the request object
        req.user = decoded;
        next(); // Token is valid, proceed to the next middleware/controller
    } catch (error) {
        return SendError(res, 401, 'Unauthorized: Invalid or expired token.');
    }
};

module.exports = authMiddleware;