// "use client";
// import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
// import { MessageCircle, Send, Loader2 } from "lucide-react";
// import { LocalTime } from "@/components/dashboard/events/local-time";
// import {
//   getConversationsAction,
//   getMessagesAction,
//   markReadAction,
//   sendMessageAction,
//   startConversationAction,
// } from "@/features/messaging/actions";
// import type { ChatMessage, Conversation } from "@/features/messaging/types";
// import { useUser } from "@/providers/user-provider";
// import { cn } from "@/lib/utils";

// type Props = {
//   allowStartById?: boolean;
//   className?: string;
// };

// function Avatar({ name, image }: { name: string; image?: string }) {
//   if (image) {
//     // eslint-disable-next-line @next/next/no-img-element
//     return <img src={image} alt="" className="size-10 rounded-full object-cover" />;
//   }
//   return (
//     <span className="grid size-10 place-items-center rounded-full bg-fg/15 text-sm font-bold">
//       {(name || "?").charAt(0).toUpperCase()}
//     </span>
//   );
// }

// export function MessagesPanel({ allowStartById = false, className }: Props) {
//   const { user } = useUser();
//   const myId = user?.id ?? 0;

//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [activeId, setActiveId] = useState<number | null>(null);
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [text, setText] = useState("");
//   const [error, setError] = useState<string | null>(null);
//   const [pending, start] = useTransition();
//   const [loadingMsgs, setLoadingMsgs] = useState(false);
//   const [startId, setStartId] = useState("");
//   const bottomRef = useRef<HTMLDivElement>(null);

//   const active = useMemo(
//     () => conversations.find((c) => c.id === activeId) ?? null,
//     [conversations, activeId],
//   );

//   const loadMessages = useCallback(
//     async (convId: number) => {
//       setLoadingMsgs(true);
//       try {
//         const res = await getMessagesAction(convId);
//         if (res.success && res.messages) {
//           setMessages(res.messages);
//           const unread = res.messages
//             .filter((m) => !m.isRead && m.senderId !== myId)
//             .map((m) => m.id);
//           if (unread.length) {
//             await markReadAction(convId, unread);
//             setConversations((list) =>
//               list.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c)),
//             );
//           }
//         }
//       } finally {
//         setLoadingMsgs(false);
//       }
//     },
//     [myId],
//   );

//   const selectConversation = useCallback(
//     (id: number) => {
//       setActiveId(id);
//       setMessages([]);
//       void loadMessages(id);
//     },
//     [loadMessages],
//   );

//   const loadConversations = useCallback(async () => {
//     const res = await getConversationsAction();
//     if (!res.success || !res.conversations) {
//       setError(res.message ?? "Could not load conversations.");
//       return;
//     }
//     setConversations(res.conversations);

//     // প্রথম conversation select + messages — effect নয়, একই async flow
//     setActiveId((prev) => {
//       const next =
//         prev && res.conversations!.some((c) => c.id === prev)
//           ? prev
//           : (res.conversations![0]?.id ?? null);
//       if (next != null) {
//         // microtask: setState cascade lint এড়াতে
//         queueMicrotask(() => {
//           void loadMessages(next);
//         });
//       } else {
//         setMessages([]);
//       }
//       return next;
//     });
//   }, [loadMessages]);

//   useEffect(() => {
//     void loadConversations();
//   }, [loadConversations]);

//   // scroll only — setState নেই
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const onSend = () => {
//     if (!active?.participant || !text.trim()) return;
//     const content = text.trim();
//     setText("");
//     start(async () => {
//       const res = await sendMessageAction({
//         receiverId: active.participant!.id,
//         content,
//         eventId: active.eventId ?? undefined,
//       });
//       if (res.success && res.chatMessage) {
//         setMessages((m) => [...m, res.chatMessage!]);
//         void loadConversations();
//       } else {
//         setError(res.message ?? "Send failed.");
//         setText(content);
//       }
//     });
//   };

//   const onStartById = () => {
//     const id = parseInt(startId, 10);
//     if (!id) return;
//     start(async () => {
//       const res = await startConversationAction(id);
//       if (res.success) {
//         setStartId("");
//         await loadConversations();
//         if (res.conversation) selectConversation(res.conversation.id);
//       } else {
//         setError(res.message ?? "Could not start conversation.");
//       }
//     });
//   };

//   return (
//     <div
//       className={cn(
//         "grid min-h-[28rem] overflow-hidden rounded-2xl border border-fg/15 bg-panel/40 lg:grid-cols-[16rem_1fr]",
//         className,
//       )}
//     >
//       <aside className="flex flex-col border-b border-fg/10 lg:border-b-0 lg:border-r">
//         <div className="flex items-center gap-2 border-b border-fg/10 px-4 py-3">
//           <MessageCircle className="size-4 text-coral" />
//           <span className="font-semibold">Messages</span>
//         </div>

//         {allowStartById && (
//           <div className="flex gap-2 border-b border-fg/10 p-3">
//             <input
//               value={startId}
//               onChange={(e) => setStartId(e.target.value)}
//               placeholder="User ID"
//               className="min-w-0 flex-1 rounded-lg border border-fg/15 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-coral/50"
//             />
//             <button
//               type="button"
//               onClick={onStartById}
//               disabled={pending}
//               className="rounded-lg bg-coral px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
//             >
//               Start
//             </button>
//           </div>
//         )}

//         <ul className="flex-1 overflow-y-auto">
//           {conversations.length === 0 && (
//             <li className="px-4 py-8 text-center text-sm text-fg/50">No conversations yet.</li>
//           )}
//           {conversations.map((c) => {
//             const activeRow = c.id === activeId;
//             const name = c.participant?.name ?? "User";
//             return (
//               <li key={c.id}>
//                 <button
//                   type="button"
//                   onClick={() => selectConversation(c.id)}
//                   className={cn(
//                     "flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-fg/5",
//                     activeRow && "bg-fg/10",
//                   )}
//                 >
//                   <Avatar name={name} image={c.participant?.profileImage} />
//                   <div className="min-w-0 flex-1">
//                     <div className="flex items-center justify-between gap-1">
//                       <p className="truncate text-sm font-semibold">{name}</p>
//                       {c.unreadCount > 0 && (
//                         <span className="rounded-full bg-coral px-1.5 text-[10px] font-bold text-white">
//                           {c.unreadCount}
//                         </span>
//                       )}
//                     </div>
//                     <p className="truncate text-xs text-fg/50">
//                       {c.lastMessage?.content ?? c.participant?.role ?? "—"}
//                     </p>
//                   </div>
//                 </button>
//               </li>
//             );
//           })}
//         </ul>
//       </aside>

//       <div className="flex min-h-[20rem] flex-col">
//         {active ? (
//           <>
//             <div className="flex items-center gap-3 border-b border-fg/10 px-4 py-3">
//               <Avatar
//                 name={active.participant?.name ?? "?"}
//                 image={active.participant?.profileImage}
//               />
//               <div>
//                 <p className="font-semibold">{active.participant?.name ?? "Unknown"}</p>
//                 <p className="text-xs capitalize text-fg/50">{active.participant?.role}</p>
//               </div>
//             </div>

//             <div className="flex-1 space-y-3 overflow-y-auto p-4">
//               {loadingMsgs && messages.length === 0 && (
//                 <div className="flex justify-center py-6">
//                   <Loader2 className="size-5 animate-spin text-fg/40" />
//                 </div>
//               )}
//               {!loadingMsgs && messages.length === 0 && (
//                 <p className="py-8 text-center text-sm text-fg/50">No messages yet. Say hello.</p>
//               )}
//               {messages.map((m) => {
//                 const mine = m.senderId === myId;
//                 return (
//                   <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
//                     <div
//                       className={cn(
//                         "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
//                         mine ? "bg-coral text-white" : "bg-fg/10 text-fg",
//                       )}
//                     >
//                       <p className="whitespace-pre-wrap break-words">{m.content}</p>
//                       <p className={cn("mt-1 text-[10px]", mine ? "text-white/70" : "text-fg/45")}>
//                         <LocalTime iso={m.createdAt} format="DD MMM, hh:mm A" />
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })}
//               <div ref={bottomRef} />
//             </div>

//             <div className="flex gap-2 border-t border-fg/10 p-3">
//               <input
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     onSend();
//                   }
//                 }}
//                 placeholder="Type a message..."
//                 className="flex-1 rounded-xl border border-fg/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-coral/50"
//               />
//               <button
//                 type="button"
//                 onClick={onSend}
//                 disabled={pending || !text.trim()}
//                 className="inline-flex items-center gap-1 rounded-xl bg-coral px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
//               >
//                 <Send className="size-4" />
//               </button>
//             </div>
//           </>
//         ) : (
//           <div className="grid flex-1 place-items-center text-sm text-fg/50">
//             Select a conversation
//           </div>
//         )}
//       </div>

//       {error && (
//         <p className="col-span-full border-t border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs text-rose-300">
//           {error}
//         </p>
//       )}
//     </div>
//   );
// }


"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { LocalTime } from "@/components/dashboard/events/local-time";
import {
  getConversationsAction,
  getMessagesAction,
  markReadAction,
  sendMessageAction,
  startConversationAction,
} from "@/features/messaging/actions";
import type { ChatMessage, Conversation } from "@/features/messaging/types";
import { useUser } from "@/providers/user-provider";
import { cn } from "@/lib/utils";

type Props = {
  allowStartById?: boolean;
  className?: string;
};

function Avatar({ name, image }: { name: string; image?: string }) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt="" className="size-10 rounded-full object-cover" />;
  }
  return (
    <span className="grid size-10 place-items-center rounded-full bg-fg/15 text-sm font-bold">
      {(name || "?").charAt(0).toUpperCase()}
    </span>
  );
}

export function MessagesPanel({ allowStartById = false, className }: Props) {
  const { user } = useUser();
  const myId = user?.id ?? 0;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [startId, setStartId] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId],
  );

  const fetchMessages = useCallback(
    async (convId: number) => {
      setLoadingMsgs(true);
      try {
        const res = await getMessagesAction(convId);
        if (res.success && res.messages) {
          setMessages(res.messages);
          const unread = res.messages
            .filter((m) => !m.isRead && m.senderId !== myId)
            .map((m) => m.id);
          if (unread.length) {
            await markReadAction(convId, unread);
            setConversations((list) =>
              list.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c)),
            );
          }
        }
      } finally {
        setLoadingMsgs(false);
      }
    },
    [myId],
  );

  const selectConversation = useCallback(
    (id: number) => {
      setActiveId(id);
      setMessages([]);
      void fetchMessages(id);
    },
    [fetchMessages],
  );

  const refreshConversationList = useCallback(async () => {
    const res = await getConversationsAction();
    if (res.success && res.conversations) {
      setConversations(res.conversations);
    }
  }, []);

  // Mount: একবার list + optional first thread (effect-এ helper নয় — lint safe)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoadingList(true);
      try {
        const res = await getConversationsAction();
        if (cancelled) return;

        if (!res.success || !res.conversations) {
          setError(res.message ?? "Could not load conversations.");
          return;
        }

        const list = res.conversations;
        setConversations(list);

        const firstId = list[0]?.id ?? null;
        setActiveId(firstId);

        if (firstId != null) {
          setLoadingMsgs(true);
          try {
            const msgRes = await getMessagesAction(firstId);
            if (cancelled) return;
            if (msgRes.success && msgRes.messages) {
              setMessages(msgRes.messages);
              const unread = msgRes.messages
                .filter((m) => !m.isRead && m.senderId !== myId)
                .map((m) => m.id);
              if (unread.length) {
                await markReadAction(firstId, unread);
                if (!cancelled) {
                  setConversations((prev) =>
                    prev.map((c) => (c.id === firstId ? { ...c, unreadCount: 0 } : c)),
                  );
                }
              }
            }
          } finally {
            if (!cancelled) setLoadingMsgs(false);
          }
        }
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once only
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSend = () => {
    if (!active?.participant || !text.trim()) return;
    const content = text.trim();
    setText("");
    start(async () => {
      const res = await sendMessageAction({
        receiverId: active.participant!.id,
        content,
        eventId: active.eventId ?? undefined,
      });
      if (res.success && res.chatMessage) {
        setMessages((m) => [...m, res.chatMessage!]);
        void refreshConversationList();
      } else {
        setError(res.message ?? "Send failed.");
        setText(content);
      }
    });
  };

  const onStartById = () => {
    const id = parseInt(startId, 10);
    if (!id) return;
    start(async () => {
      const res = await startConversationAction(id);
      if (res.success && res.conversation) {
        setStartId("");
        await refreshConversationList();
        selectConversation(res.conversation.id);
      } else {
        setError(res.message ?? "Could not start conversation.");
      }
    });
  };

  return (
    <div
      className={cn(
        "grid min-h-[28rem] overflow-hidden rounded-2xl border border-fg/15 bg-panel/40 lg:grid-cols-[16rem_1fr]",
        className,
      )}
    >
      <aside className="flex flex-col border-b border-fg/10 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2 border-b border-fg/10 px-4 py-3">
          <MessageCircle className="size-4 text-coral" />
          <span className="font-semibold">Messages</span>
        </div>

        {allowStartById && (
          <div className="flex gap-2 border-b border-fg/10 p-3">
            <input
              value={startId}
              onChange={(e) => setStartId(e.target.value)}
              placeholder="User ID"
              className="min-w-0 flex-1 rounded-lg border border-fg/15 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-coral/50"
            />
            <button
              type="button"
              onClick={onStartById}
              disabled={pending}
              className="rounded-lg bg-coral px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
            >
              Start
            </button>
          </div>
        )}

        <ul className="flex-1 overflow-y-auto">
          {loadingList && (
            <li className="flex justify-center py-8">
              <Loader2 className="size-5 animate-spin text-fg/40" />
            </li>
          )}
          {!loadingList && conversations.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-fg/50">No conversations yet.</li>
          )}
          {conversations.map((c) => {
            const activeRow = c.id === activeId;
            const name = c.participant?.name ?? "User";
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => selectConversation(c.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-fg/5",
                    activeRow && "bg-fg/10",
                  )}
                >
                  <Avatar name={name} image={c.participant?.profileImage} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="truncate text-sm font-semibold">{name}</p>
                      {c.unreadCount > 0 && (
                        <span className="rounded-full bg-coral px-1.5 text-[10px] font-bold text-white">
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-fg/50">
                      {c.lastMessage?.content ?? c.participant?.role ?? "—"}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="flex min-h-[20rem] flex-col">
        {active ? (
          <>
            <div className="flex items-center gap-3 border-b border-fg/10 px-4 py-3">
              <Avatar
                name={active.participant?.name ?? "?"}
                image={active.participant?.profileImage}
              />
              <div>
                <p className="font-semibold">{active.participant?.name ?? "Unknown"}</p>
                <p className="text-xs capitalize text-fg/50">{active.participant?.role}</p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {loadingMsgs && messages.length === 0 && (
                <div className="flex justify-center py-6">
                  <Loader2 className="size-5 animate-spin text-fg/40" />
                </div>
              )}
              {!loadingMsgs && messages.length === 0 && (
                <p className="py-8 text-center text-sm text-fg/50">No messages yet. Say hello.</p>
              )}
              {messages.map((m) => {
                const mine = m.senderId === myId;
                return (
                  <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
                        mine ? "bg-coral text-white" : "bg-fg/10 text-fg",
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words">{m.content}</p>
                      <p className={cn("mt-1 text-[10px]", mine ? "text-white/70" : "text-fg/45")}>
                        <LocalTime iso={m.createdAt} format="DD MMM, hh:mm A" />
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <div className="flex gap-2 border-t border-fg/10 p-3">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSend();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 rounded-xl border border-fg/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-coral/50"
              />
              <button
                type="button"
                onClick={onSend}
                disabled={pending || !text.trim()}
                className="inline-flex items-center gap-1 rounded-xl bg-coral px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                <Send className="size-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="grid flex-1 place-items-center text-sm text-fg/50">
            {loadingList ? "Loading…" : "Select a conversation"}
          </div>
        )}
      </div>

      {error && (
        <p className="col-span-full border-t border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}