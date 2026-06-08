import api from "./api";
import type { Comment } from "./types";

export async function getCommentsByReport(
  reportId: number,
): Promise<Comment[]> {
  const res = await api.get(`/comments/report/${reportId}`);
  return res.data.data ?? [];
}

export async function createComment(payload: {
  report_id: number;
  comment: string;
}): Promise<Comment> {
  const res = await api.post("/comments", payload);
  return res.data.data;
}
