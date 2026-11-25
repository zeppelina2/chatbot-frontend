import { api } from "@/api/axios";

export const apiRegister = async (username: string, password: string) =>
  await api.post("/auth/register", { username, password });

export const apiLogin = async (username: string, password: string) =>
  await api.post("/auth/login", { username, password });

export const apiLogout = async () => await api.post("/auth/logout");

export const apiUser = async () =>
  await api.get("/auth/user");
