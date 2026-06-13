export const roles = {
  BUYER: "buyer",
  SELLER: "seller",
  ADMIN: "admin"
};

export const permissions = {
  buyer: [
    "profile:read_own",
    "profile:update_own",
    "cart:manage_own",
    "order:create",
    "order:read_own",
    "review:create",
    "notification:read_own"
  ],
  seller: [
    "profile:read_own",
    "profile:update_own",
    "seller:read_own",
    "seller:update_own",
    "store:manage_own",
    "product:create",
    "product:update_own",
    "product:read_own",
    "order:read_seller",
    "notification:read_own"
  ],
  admin: ["*"]
};

export function hasPermission(role, permission) {
  const rolePermissions = permissions[role] || [];
  return rolePermissions.includes("*") || rolePermissions.includes(permission);
}
