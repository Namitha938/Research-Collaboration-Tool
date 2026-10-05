const AuditLog = require("../models/AuditLog");

/**
 * Records a platform-wide audit entry without blocking the request flow.
 * Failures are swallowed so auditing can never break the feature being audited.
 *
 * @param {Object} options
 * @param {ObjectId} [options.actor] - req.user._id when authenticated
 * @param {String} [options.actorName]
 * @param {String} [options.actorEmail]
 * @param {String} [options.actorRole]
 * @param {String} options.action - e.g. "user.login", "project.deleted"
 * @param {String} [options.category] - auth | profile | project | admin | security
 * @param {String} [options.entityType] - e.g. "user", "project"
 * @param {String} [options.entityId]
 * @param {String} [options.description] - Human readable summary
 * @param {String} [options.status] - success | failure
 * @param {Object} [options.metadata] - Extra structured detail (never secrets)
 * @param {Object} [options.req] - Express request, used to capture ip / user agent
 */
const logAudit = async ({
  actor = null,
  actorName,
  actorEmail,
  actorRole,
  action,
  category = "auth",
  entityType = "",
  entityId = "",
  description = "",
  status = "success",
  metadata = {},
  req = null,
} = {}) => {
  try {
    if (!action) {
      console.warn("logAudit called without an action");
      return null;
    }

    const resolvedName =
      actorName || req?.user?.name || "System";
    const resolvedEmail = actorEmail || req?.user?.email || "";
    const resolvedRole =
      actorRole || req?.user?.role || (actor ? "researcher" : "system");

    const entry = await AuditLog.create({
      actor: actor || req?.user?._id || null,
      actorName: resolvedName,
      actorEmail: resolvedEmail,
      actorRole: resolvedRole,
      action,
      category,
      entityType,
      entityId: entityId ? String(entityId) : "",
      description,
      status,
      metadata,
      ipAddress: req ? getClientIp(req) : "",
      userAgent: req?.headers?.["user-agent"] || "",
    });

    return entry;
  } catch (error) {
    console.error("logAudit error:", error.message);
    return null;
  }
};

const getClientIp = (req) => {
  const headers = req?.headers || {};
  const forwarded = headers["x-forwarded-for"];
  if (forwarded) {
    return String(forwarded).split(",")[0].trim();
  }
  return req?.ip || req?.socket?.remoteAddress || "";
};

module.exports = logAudit;
module.exports.getClientIp = getClientIp;