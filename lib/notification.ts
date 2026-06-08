import api from "./api";
import type { Notification } from "./types";

export async function getNotifications(): Promise<Notification[]> {
  const res = await api.get("/notifications");
  return res.data.data ?? [];
}

export async function getUnreadCount(): Promise<number> {
  const res = await api.get("/notifications/unread-count");
  return res.data.data?.count ?? 0;
}

export async function markAsRead(id: number): Promise<void> {
  await api.patch(`/notifications/${id}/read`);
}

export async function markAllAsRead(): Promise<void> {
  await api.patch("/notifications/read-all");
}
