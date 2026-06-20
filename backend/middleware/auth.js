const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access Denied. Missing or malformed Auth Token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach the decoded payload (e.g., { id: '...' }) to req
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or Expired Security Token' });
    }
};