import { AppError } from "../utils/app-error.js";
import { hasPermission } from "../utils/rbac.js";

export function requireRoles(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError("You do not have access to this resource", 403));
    }

    return next();
  };
}

export function requirePermission(permission) {
  return (req, _res, next) => {
    if (!req.user || !hasPermission(req.user.role, permission)) {
      return next(new AppError("Insufficient permission", 403));
    }

    return next();
  };
}
