const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Attaches req.user when a valid Bearer token is present, but never blocks the
 * request. Used for endpoints that behave differently for signed-in users
 * (e.g. logout) while remaining publicly reachable.
 */
const optionalAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (header && header.startsWith("Bearer")) {
      const decoded = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");
      if (user) req.user = user;
    }
  } catch (error) {
    // Ignore invalid/expired tokens on optional routes
  }
  next();
};

module.exports = optionalAuth;