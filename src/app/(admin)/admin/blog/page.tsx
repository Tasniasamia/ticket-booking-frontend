import type { Metadata } from "next";
import { ComingSoon } from "@/components/dashboard/shared/coming-soon";

export const metadata: Metadata = { title: "Blog" };

export default function AdminBlogPage() {
  return <ComingSoon href="/admin/blog" />;
}
