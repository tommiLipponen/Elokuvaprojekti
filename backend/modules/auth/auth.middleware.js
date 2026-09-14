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

module.exports = authMiddleware;
