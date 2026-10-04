const { verifyAccessToken } = require('./token.service');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
        error: "Access token required",
        });
    }

    const token = authHeader.split(' ')[1];

    try {
    const payload = verifyAccessToken(token);

    req.user = payload; // Attach the payload to the request object for further use
    next(); // Proceed to the next middleware or route handler if the token is valid
    } catch {
//if token is invalid or expired, return a 401 Unauthorized response with an error message
    return res.status(401).json({ 
        error: "Invalid or expired access token",
    });
    }
};

// For public endpoints that behave differently for logged-in vs anonymous users:
// attaches req.user when a valid token is present, otherwise proceeds without one instead of rejecting.
const optionalAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }

    const token = authHeader.split(' ')[1];

    try {
        req.user = verifyAccessToken(token);
    } catch {
        // Invalid/expired token on a public route: treat as anonymous rather than failing the request.
    }

    next();
};

module.exports = authMiddleware;
module.exports.optionalAuthMiddleware = optionalAuthMiddleware;
