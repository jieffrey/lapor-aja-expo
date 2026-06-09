import api from "@/lib/api";

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  password?: string;
  avatar_url?: string;
}

export async function updateProfileApi(payload: UpdateProfilePayload) {
  const res = await api.patch("/auth/me", payload);
  return res.data;
}

export async function uploadAvatarApi(uri: string): Promise<string> {
  const formData = new FormData();
  const filename = uri.split("/").pop() ?? "avatar.jpg";
  const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
  const mime = ext === "png" ? "image/png" : "image/jpeg";

  formData.append("file", {
    uri,
    name: filename,
    type: mime,
  } as any);

  const res = await api.post("/upload/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  // Server returns Cloudinary URL
  return res.data.url as string;
}
