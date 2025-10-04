// In your auth.js file
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    console.log("Authorization header:", req.headers.authorization);
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
}


module.exports = { authMiddleware }; 