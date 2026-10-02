// Kept for backwards compatibility: re-exports the single working auth middleware.
// (The old version read `decoded.id` and `user.isActive`, which don't exist, so it always returned 401.)
const protect = require("./authMiddleware");

module.exports = { protect };
