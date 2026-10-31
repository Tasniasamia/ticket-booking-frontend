"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import type { Profile } from "@/features/user/type";
import { updateMemberAction } from "@/features/user/actions";

const field = "w-full rounded-xl border border-border bg-panel px-3 py-2 text-sm outline-none focus:border-coral";

export function MemberEditForm({ user, onSuccess }: { user: Profile; onSuccess?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status || "active");
  const [designation, setDesignation] = useState(user.designation || "");
  const [isVerified, setIsVerified] = useState(user.is_verified);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateMemberAction(user.id, { name, email, role, status, designation: designation || undefined, is_verified: isVerified });
    setLoading(false);
    if (res.success) { toast.success(res.message ?? "Updated."); onSuccess?.(); router.refresh(); return; }
    toast.error(res.message ?? "Failed.");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div><label className="mb-1 block text-xs text-fg/55">Name</label><input className={field} value={name} onChange={(e) => setName(e.target.value)} required /></div>
      <div><label className="mb-1 block text-xs text-fg/55">Email</label><input className={field} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-fg/55">Role</label>
          <select className={field} value={role} onChange={(e) => setRole(e.target.value as Profile["role"])}>
            <option value="user">User</option><option value="manager">Manager</option><option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-fg/55">Status</label>
          <select className={field} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="active">Active</option><option value="deactivated">Deactivated</option>
          </select>
        </div>
      </div>
      <div><label className="mb-1 block text-xs text-fg/55">Designation</label><input className={field} value={designation} onChange={(e) => setDesignation(e.target.value)} /></div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isVerified} onChange={(e) => setIsVerified(e.target.checked)} /> Verified</label>
      <button type="submit" disabled={loading} className="btn-grad w-full rounded-full py-2.5 text-sm font-semibold disabled:opacity-60">
        {loading ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
