const jwt = require("jsonwebtoken");
const User = require("../model/user-model");   // ✔️ Import User model

/**
 * protect
 * ----------
 * 1. Verifies JWT from  `Authorization: Bearer <token>` header.
 * 2. Loads full user (minus password) into `req.user`.
 */
const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

/**
 * ----------------------------
 * Permits only the specified roles.
 */
const allowRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied: Role not allowed" });
        }
        next();
    };
};

/**
 *
 * ------------------------------
 * Same idea but array syntax.
 */
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied. Insufficient role." });
        }
        next();
    };
};



//new middleware for auto generated pass 
// const authMiddleware = (roles = []) => {
//     return (req, res, next) => {
//         const token = req.headers.authorization?.split(" ")[1];
//         if (!token) return res.status(401).json({ message: "Unauthorized" });

//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = decoded;

//             // Role check
//             if (roles.length && !roles.includes(decoded.role)) {
//                 return res.status(403).json({ message: "Forbidden" });
//             }

//             next();
//         } catch (error) {
//             res.status(401).json({ message: "Invalid Token" });
//         }
//     };
// };







const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const token = authHeader.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // { id, role, ... }

            // Role-based access check
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: "Forbidden: Access denied" });
            }

            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token expired" });
            }
            return res.status(401).json({ message: "Invalid token" });
        }
    };
};



module.exports = {
    protect,
    allowRoles,
    requireRole,
    authMiddleware
};
