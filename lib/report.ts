import api from "./api";
import type { Report } from "./types";

export async function getReports(): Promise<Report[]> {
  const res = await api.get("/reports");
  return res.data.data ?? [];
}

export async function getReportById(id: number): Promise<Report> {
  const res = await api.get(`/reports/${id}`);
  return res.data.data;
}

export async function createReport(formData: FormData): Promise<Report> {
  const res = await api.post("/reports", formData);
  return res.data.data;
}
