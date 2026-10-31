"use client";
import dayjs from "dayjs";
import { Users } from "lucide-react";
import { DataTable, type Column } from "@/components/common/table/data-table";
import type { PaginationMeta } from "@/components/common/table/table-params";
import type { Profile } from "@/features/user/type";
import { deleteUserAction } from "@/features/user/actions";
import { StatusBadge } from "@/components/common/badge/status-badge";
import { MemberEditForm } from "./member-edit-form";

const fmt = (iso: string) => (iso ? dayjs(iso).format("DD MMM YYYY") : "—");
const COLUMNS: Column<Profile>[] = [
  { key: "image", header: "Photo", cell: (u) => u.profile_image ? <img src={u.profile_image} alt={u.name} className="size-10 rounded-full object-cover" /> : "—" },
  { key: "name", header: "Name", cell: (u) => u.name || "—" },
  { key: "email", header: "Email", cell: (u) => u.email || "—" },
  { key: "role", header: "Role", cell: (u) => <StatusBadge label={u.role} tone={u.role === "admin" ? "warning" : u.role === "manager" ? "success" : "neutral"} /> },
  { key: "status", header: "Status", cell: (u) => <StatusBadge label={u.status} tone={u.status === "active" ? "success" : "danger"} /> },
  { key: "verified", header: "Verified", cell: (u) => (u.is_verified ? "Yes" : "No") },
  { key: "created", header: "Joined", cell: (u) => fmt(u.createdAt) },
];

export function UserTable({ users, meta }: { users: Profile[]; meta: PaginationMeta }) {
  return (
    <DataTable
      columns={COLUMNS} data={users} meta={meta} rowKey={(u) => u.id}
      searchPlaceholder="Search by name or email"
      emptyState={{ icon: Users, title: "No users yet", description: "Registered users will appear here." }}
      actions={{
        view: {
          dialog: {
            title: (u) => u.name,
            content: (u) => (
              <div className="space-y-2 text-sm">
                <p><span className="text-fg/55">Email:</span> {u.email}</p>
                <p><span className="text-fg/55">Role:</span> {u.role}</p>
                <p><span className="text-fg/55">Phone:</span> {u.phone_number || "—"}</p>
                <p><span className="text-fg/55">Country:</span> {u.country || "—"}</p>
                <p><span className="text-fg/55">Designation:</span> {u.designation || "—"}</p>
                <p><span className="text-fg/55">Status:</span> {u.status}</p>
              </div>
            ),
          },
        },
        edit: { dialog: { title: (u) => `Edit ${u.name}`, content: (u, close) => <MemberEditForm user={u} onSuccess={close} />, customWidth: "sm:max-w-md" } },
        delete: deleteUserAction,
      }}
    />
  );
}
