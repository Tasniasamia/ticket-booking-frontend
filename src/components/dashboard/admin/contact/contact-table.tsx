// "use client";
// import { useState } from "react";
// import dayjs from "dayjs";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";

// import type { Contact } from "@/features/contact/types";
// import { replyContactAction } from "@/features/contact/actions";

// function ReplyForm({ contact, onSuccess }: { contact: Contact; onSuccess?: () => void }) {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [reply, setReply] = useState("");
//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     const res = await replyContactAction(contact.id, { reply_message: reply });
//     setLoading(false);
//     if (res.success) { toast.success(res.message ?? "Reply sent."); onSuccess?.(); router.refresh(); return; }
//     toast.error(res.message ?? "Failed.");
//   };
//   return (
//     <div className="space-y-3 text-sm">
//       <div className="rounded-xl bg-panel/60 p-3">
//         <p className="text-fg/55">From {contact.name} &lt;{contact.email}&gt;</p>
//         <p className="mt-1 font-medium">{contact.subject}</p>
//         <p className="mt-2 whitespace-pre-wrap">{contact.message}</p>
//       </div>
//       {contact.status === "replied" && contact.reply_message ? (
//         <div className="rounded-xl border border-border p-3">
//           <p className="text-fg/55">Previous reply</p>
//           <p className="mt-1 whitespace-pre-wrap">{contact.reply_message}</p>
//         </div>
//       ) : null}
//       <form onSubmit={onSubmit} className="space-y-3">
//         <div>
//           <label className="mb-1 block text-xs text-fg/55">Your reply (email will be sent)</label>
//           <textarea className={field} rows={4} value={reply} onChange={(e) => setReply(e.target.value)} required />
//         </div>
//         <button type="submit" disabled={loading} className="btn-grad w-full rounded-full py-2.5 text-sm font-semibold disabled:opacity-60 cursor-pointer">
//           {loading ? "Sending..." : "Send reply"}
//         </button>
        
//       </form>
//     </div>
//   );
// }




"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { replyContactAction } from "@/features/contact/actions";
import type { Contact } from "@/features/contact/types";
import { DataTable, type Column } from "@/components/common/table/data-table";
import type { PaginationMeta } from "@/components/common/table/table-params";
import { Mail } from "lucide-react";
import { StatusBadge } from "@/components/common/badge/status-badge";
import { SubmitButton } from "@/components/common/form/submit-button";
import dayjs from "dayjs";

const fmt = (iso: string) => (iso ? dayjs(iso).format("DD MMM YYYY, hh:mm A") : "—");
// const field = "w-full rounded-xl border border-border bg-panel px-3 py-2 text-sm outline-none focus:border-coral";


const COLUMNS: Column<Contact>[] = [
  { key: "name", header: "Name", cell: (c) => c.name },
  { key: "email", header: "Email", cell: (c) => c.email },
  { key: "subject", header: "Subject", cell: (c) => c.subject },
  { key: "status", header: "Status", cell: (c) => <StatusBadge label={c.status} tone={c.status === "replied" ? "success" : "warning"} /> },
  { key: "created", header: "Received", cell: (c) => fmt(c.created_at) },
];



const replySchema = z.object({
  reply_message: z.string().min(3, "Reply is required"),
});

type ReplyValues = z.infer<typeof replySchema>;

const field =
  "w-full rounded-xl border border-border bg-panel px-3 py-2 text-sm outline-none focus:border-coral";

function ReplyForm({ contact, onSuccess }: { contact: Contact; onSuccess?: () => void }) {
  const router = useRouter();
  const form = useForm<ReplyValues>({
    resolver: zodResolver(replySchema),
    defaultValues: { reply_message: "" },
  });

  const onSubmit = async (values: ReplyValues) => {
    const res = await replyContactAction(contact.id, values);
    if (res.success) {
      toast.success(res.message ?? "Reply sent.");
      onSuccess?.();
      router.refresh();
      return;
    }
    toast.error(res.message ?? "Failed.");
  };

  return (
    <div className="space-y-3 text-sm">
      <div className="rounded-xl bg-panel/60 p-3">
        <p className="text-fg/55">
          From {contact.name} &lt;{contact.email}&gt;
        </p>
        <p className="mt-1 font-medium">{contact.subject}</p>
        <p className="mt-2 whitespace-pre-wrap">{contact.message}</p>
      </div>

      {contact.status === "replied" && contact.reply_message ? (
        <div className="rounded-xl border border-border p-3">
          <p className="text-fg/55">Previous reply</p>
          <p className="mt-1 whitespace-pre-wrap">{contact.reply_message}</p>
        </div>
      ) : null}

      {/* FormProvider ছাড়া SubmitButton কাজ করবে না */}
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-fg/55">
              Your reply (email will be sent)
            </label>
            <textarea
              className={field}
              rows={4}
              {...form.register("reply_message")}
              required
            />
            {form.formState.errors.reply_message && (
              <p className="mt-1 text-xs text-red-500">
                {form.formState.errors.reply_message.message}
              </p>
            )}
          </div>
          <SubmitButton loadingText="Sending...">Send reply</SubmitButton>
        </form>
      </FormProvider>
    </div>
  );
}


export function ContactTable({ contacts, meta }: { contacts: Contact[]; meta: PaginationMeta }) {
  return (
    <DataTable
      columns={COLUMNS} data={contacts} meta={meta} rowKey={(c) => c.id}
      searchPlaceholder="Search contacts"
      emptyState={{ icon: Mail, title: "No messages yet", description: "Public contact form submissions appear here." }}
      actions={{
        view: { dialog: { title: (c) => c.subject, content: (c, close) => <ReplyForm contact={c} onSuccess={close} />, customWidth: "sm:max-w-lg" } },
      }}
    />
  );
}