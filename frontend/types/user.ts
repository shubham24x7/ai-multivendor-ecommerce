export type UserRole = "buyer" | "seller" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
};
