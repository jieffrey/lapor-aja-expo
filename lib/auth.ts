import api from "./api";
import type { User } from "./types";

type LoginResponse = {
  success: boolean;
  data: User;
  token: string;
};

type RegisterResponse = {
  success: boolean;
  message: string;
};

export async function loginApi(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

export async function registerApi(
  name: string,
  email: string,
  password: string,
): Promise<RegisterResponse> {
  const res = await api.post("/auth/register", { name, email, password });
  return res.data;
}

export async function getMe(): Promise<User> {
  const res = await api.get("/me");
  return res.data.data;
}

export async function getUserById(id: number): Promise<User> {
  const res = await api.get(`/user/${id}`);
  return res.data.data;
}
