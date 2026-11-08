"use server";

import {
  fetchAdminDashboard, fetchManagerDashboard, fetchUserDashboard,
} from "./service";
import {
  toAdminDashboard, toManagerDashboard, toUserDashboard,
  type AdminDashboard, type ManagerDashboard, type UserDashboard,
} from "./types";
import { cacheLife, cacheTag } from "next/cache";

export async function getAdminDashboardAction(): Promise<AdminDashboard | null> {

  try { return toAdminDashboard(await fetchAdminDashboard()); } catch { return null; }
}
export async function getManagerDashboardAction(): Promise<ManagerDashboard | null> {

  try { return toManagerDashboard(await fetchManagerDashboard()); } catch { return null; }
}
export async function getUserDashboardAction(): Promise<UserDashboard | null> {

  try { return toUserDashboard(await fetchUserDashboard()); } catch { return null; }
}
