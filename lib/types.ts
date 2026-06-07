export type UserRole = "user" | "admin" | "superadmin";

export type ReportStatus = "Pending" | "In Progress" | "Resolved" | "Rejected";
export type ReportPriority = "Low" | "Medium" | "High";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  points: number;
  created_at: string;
}

export interface Report {
  id: number;
  user_id: number;
  name: string;
  title: string;
  description: string;
  category: string;
  priority: ReportPriority;
  status: ReportStatus;
  latitude: string | null;
  longitude: string | null;
  image_before: string | null;
  image_after: string | null;
  images: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  report_id: number;
  user_id: number;
  name: string;
  role: UserRole;
  comment: string;
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  type: "new_report" | "status_update" | "comment" | "points_earned";
  title: string;
  message: string;
  read: boolean;
  report_id: number | null;
  triggered_by: number | null;
  created_at: string;
}
