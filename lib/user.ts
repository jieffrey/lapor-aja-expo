import api from "./api";
import type { User } from "./types";

export async function getLeaderboard(): Promise<User[]> {
  const res = await api.get("/user/leaderboard");
  return res.data.data ?? [];
}

export async function getUserProfile(id: number): Promise<User> {
  const res = await api.get(`/user/${id}`);
  return res.data.data;
}
