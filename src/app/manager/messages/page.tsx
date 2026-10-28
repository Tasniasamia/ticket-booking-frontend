import type { Metadata } from "next";
import { MessagesPanel } from "@/components/messaging/messages-panel";

export const metadata: Metadata = { title: "Messages" };

export default function MessagesPage() {
  return (
    <div>
      <h2 className="mb-4 text-lg font-bold">Messages</h2>
      <p className="mb-4 text-sm text-fg/60">
        Chat with people you are connected with (admin after verification, event managers after booking).
      </p>
      <MessagesPanel />
    </div>
  );
}

