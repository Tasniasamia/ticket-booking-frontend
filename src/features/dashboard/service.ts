import { api } from "@/lib/api-client";

export const fetchAdminDashboard = async () => (await api.get("/dashboard/admin")).data.data;
export const fetchManagerDashboard = async () => (await api.get("/dashboard/manager")).data.data;
export const fetchUserDashboard = async () => (await api.get("/dashboard/me")).data.data;
