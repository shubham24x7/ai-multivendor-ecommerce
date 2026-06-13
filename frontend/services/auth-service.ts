import { apiClient } from "@/lib/api-client";
import type { User } from "@/types/user";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = LoginPayload & {
  name: string;
  role: User["role"];
};

export async function login(payload: LoginPayload) {
  const response = await apiClient.post("/auth/login", payload);
  return response.data;
}

export async function register(payload: RegisterPayload) {
  const response = await apiClient.post("/auth/register", payload);
  return response.data;
}
