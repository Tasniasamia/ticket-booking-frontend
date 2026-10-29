"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  MessageCircle, Send, Loader2, Check, CheckCheck, Clock, AlertCircle,
  Paperclip, Pencil, Trash2, X, FileText,
} from "lucide-react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { uploadMediaAction } from "@/features/media/actions";
import {
  deleteMessageAction,
  editMessageAction,
  getConversationsAction,
  getMessagesAction,
  getMessagingWsTokenAction,
  markReadAction,
  sendMessageAction,
  startConversationAction,
} from "@/features/messaging/actions";
import type { ChatMessage, Conversation } from "@/features/messaging/types";
import { useUser } from "@/providers/user-provider";
import { cn } from "@/lib/utils";

type Props = { allowStartById?: boolean; className?: string };
type SendStatus = "sending" | "sent" | "failed";
type UiMessage = ChatMessage & { clientId?: string; sendStatus?: SendStatus };

dayjs.extend(relativeTime);

const PAGE_SIZE = 30;

// "a few seconds ago", "5 minutes ago", "2 hours ago"; older than a day -> "29 Oct, 10:28 PM"
function timeLabel(iso: string): string {
  const d = dayjs(iso);
  if (!d.isValid()) return "—";
  const now = dayjs();
  if (d.isAfter(now)) return "just now"; // client clock slightly behind server
  if (now.diff(d, "hour") >= 24) return d.format(d.isSame(now, "year") ? "DD MMM, hh:mm A" : "DD MMM YYYY, hh:mm A");
  return d.fromNow();
}

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

function StatusIcon({ status, isRead }: { status?: SendStatus; isRead?: boolean }) {
  if (status === "sending") return <Clock className="inline size-3 opacity-80" />;
  if (status === "failed") return <AlertCircle className="inline size-3 text-rose-300" />;
  if (isRead) return <CheckCheck className="inline size-3.5 opacity-90" />;
  return <Check className="inline size-3 opacity-80" />;
}

export function MessagesPanel({ allowStartById = false, className }: Props) {
  const { user } = useUser();
  const myId = user?.id ?? 0;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [, setTick] = useState(0); // re-render so "x minutes ago" stays fresh
  const [hasMore, setHasMore] = useState(false);
  const [startId, setStartId] = useState("");
  const [wsState, setWsState] = useState<"off" | "on" | "error">("off");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  const listRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const shouldStickRef = useRef(true);
  const activeIdRef = useRef<number | null>(null);
  const myIdRef = useRef(myId);
  const messagesRef = useRef<UiMessage[]>([]);
  const loadSeqRef = useRef(0); // ignores stale responses when switching conversations fast
  const loadingOlderRef = useRef(false);
  const hasMoreRef = useRef(false);
  const prependRef = useRef<{ height: number; top: number } | null>(null);
  const previewUrlsRef = useRef<Map<string, string>>(new Map());

  useEffect(() => { activeIdRef.current = activeId; }, [activeId]);
  useEffect(() => { myIdRef.current = myId; }, [myId]);
  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 15000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => {
    const urls = previewUrlsRef.current;
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId],
  );


  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior });
  };

  // After older messages are prepended, keep the viewport on the same message.
  useLayoutEffect(() => {
    const a = prependRef.current;
    const el = listRef.current;
    if (!a || !el) return;
    el.scrollTop = a.top + (el.scrollHeight - a.height);
    prependRef.current = null;
  }, [messages]);

  useEffect(() => {
    if (!shouldStickRef.current) return;
    requestAnimationFrame(() => scrollToBottom("auto"));
  }, [messages]);

  const markUnreadAsRead = useCallback(async (convId: number, list: ChatMessage[]) => {
    const unread = list.filter((m) => !m.isRead && m.senderId !== myIdRef.current).map((m) => m.id);
    if (!unread.length) return;
    await markReadAction(convId, unread);
    setConversations((cs) => cs.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c)));
  }, []);

  const fetchMessages = useCallback(async (convId: number) => {
    const seq = ++loadSeqRef.current;
    setLoadingMsgs(true);
    setHasMore(false);
    try {
      const res = await getMessagesAction(convId, undefined, PAGE_SIZE);
      if (seq !== loadSeqRef.current) return; // user already switched conversation
      if (res.success && res.messages) {
        setMessages(res.messages.map((m) => ({ ...m, sendStatus: "sent" as const })));
        setHasMore(res.hasMore);
        shouldStickRef.current = true;
        await markUnreadAsRead(convId, res.messages);
      }
    } finally {
      if (seq === loadSeqRef.current) setLoadingMsgs(false);
    }
  }, [markUnreadAsRead]);

  const loadOlder = useCallback(async () => {
    const convId = activeIdRef.current;
    if (convId == null || loadingOlderRef.current || !hasMoreRef.current) return;
    const el = listRef.current;
    const oldest = messagesRef.current.find((m) => m.id > 0);
    if (!el || !oldest) return;

    loadingOlderRef.current = true;
    setLoadingOlder(true);
    const seq = loadSeqRef.current;
    try {
      const res = await getMessagesAction(convId, oldest.id, PAGE_SIZE);
      if (seq !== loadSeqRef.current || !res.success) return;
      const older = res.messages.map((m) => ({ ...m, sendStatus: "sent" as const }));
      prependRef.current = { height: el.scrollHeight, top: el.scrollTop };
      setMessages((prev) => {
        const have = new Set(prev.map((m) => m.id));
        return [...older.filter((m) => !have.has(m.id)), ...prev];
      });
      setHasMore(res.hasMore);
      void markUnreadAsRead(convId, res.messages);
    } finally {
      loadingOlderRef.current = false;
      setLoadingOlder(false);
    }
  }, [markUnreadAsRead]);

  const onListScroll = () => {
    const el = listRef.current;
    if (!el) return;
    shouldStickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (el.scrollTop < 80) void loadOlder();
  };

  const selectConversation = useCallback(
    (id: number) => {
      setActiveId(id);
      setMessages([]);
      setHasMore(false);
      setEditingId(null);
      setPendingFile(null);
      shouldStickRef.current = true;
      void fetchMessages(id);
    },
    [fetchMessages],
  );

  const refreshConversationList = useCallback(async () => {
    const res = await getConversationsAction();
    if (res.success && res.conversations) setConversations(res.conversations);
  }, []);

  const applyIncomingMessage = useCallback(
    (raw: ChatMessage) => {
      const msg: UiMessage = { ...raw, sendStatus: "sent" };
      if (activeIdRef.current === msg.conversationId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id && m.id > 0)) return prev;
          if (msg.senderId === myIdRef.current) {
            const withoutTmp = prev.filter(
              (m) =>
                !(
                  m.clientId &&
                  m.sendStatus === "sending" &&
                  m.content === msg.content &&
                  (m.attachmentName ?? "") === (msg.attachmentName ?? "")
                ),
            );
            if (withoutTmp.some((m) => m.id === msg.id)) return withoutTmp;
            return [...withoutTmp, msg];
          }
          return [...prev, msg];
        });
        if (msg.senderId !== myIdRef.current && msg.id > 0) {
          void markReadAction(msg.conversationId, [msg.id]);
        }
      }
      setConversations((list) => {
        const idx = list.findIndex((c) => c.id === msg.conversationId);
        if (idx === -1) {
          void refreshConversationList();
          return list;
        }
        const copy = [...list];
        const c = { ...copy[idx], lastMessage: msg };
        if (msg.senderId !== myIdRef.current && activeIdRef.current !== msg.conversationId) {
          c.unreadCount = (c.unreadCount ?? 0) + 1;
        }
        copy.splice(idx, 1);
        return [c, ...copy];
      });
    },
    [refreshConversationList],
  );

  useEffect(() => {
    if (!user) return;
    let ws: WebSocket | null = null;
    let closed = false;
    let pingTimer: ReturnType<typeof setInterval> | undefined;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const connect = async () => {
      const base = process.env.NEXT_PUBLIC_WS_URL;
      if (!base) { setWsState("off"); return; }
      const tok = await getMessagingWsTokenAction();
      if (!tok.success || !tok.token || closed) return;
      const url = `${base}${base.includes("?") ? "&" : "?"}token=${encodeURIComponent(tok.token)}`;
      ws = new WebSocket(url);
      ws.onopen = () => {
        setWsState("on");
        pingTimer = setInterval(() => {
          if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "ping" }));
        }, 25000);
      };
      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data as string) as { type: string; payload: Record<string, unknown> };
          if (data.type === "message" && data.payload) {
            const p = data.payload;
            applyIncomingMessage({
              id: Number(p.id ?? 0),
              conversationId: Number(p.conversation_id ?? 0),
              senderId: Number(p.sender_id ?? 0),
              content: String(p.content ?? ""),
              isRead: Boolean(p.is_read),
              isEdited: Boolean(p.is_edited),
              attachmentUrl: p.attachment_url ? String(p.attachment_url) : undefined,
              attachmentType: p.attachment_type ? String(p.attachment_type) : undefined,
              attachmentName: p.attachment_name ? String(p.attachment_name) : undefined,
              createdAt: String(p.created_at ?? new Date().toISOString()),
            });
          }
          if (data.type === "message_updated" && data.payload) {
            const p = data.payload;
            const id = Number(p.id ?? 0);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === id
                  ? {
                      ...m,
                      content: String(p.content ?? m.content),
                      isEdited: true,
                      updatedAt: p.updated_at ? String(p.updated_at) : m.updatedAt,
                    }
                  : m,
              ),
            );
          }
          if (data.type === "message_deleted" && data.payload) {
            const id = Number(data.payload.id ?? 0);
            setMessages((prev) => prev.filter((m) => m.id !== id));
          }
          if (data.type === "read" && data.payload) {
            const ids = (data.payload.message_ids as number[]) ?? [];
            const readBy = Number(data.payload.read_by ?? 0);
            if (readBy !== myIdRef.current && ids.length) {
              setMessages((prev) =>
                prev.map((m) => (ids.includes(m.id) ? { ...m, isRead: true } : m)),
              );
            }
          }
        } catch { /* ignore */ }
      };
      ws.onerror = () => setWsState("error");
      ws.onclose = () => {
        setWsState("off");
        if (pingTimer) clearInterval(pingTimer);
        if (!closed) retryTimer = setTimeout(connect, 4000);
      };
    };
    void connect();
    return () => {
      closed = true;
      if (pingTimer) clearInterval(pingTimer);
      if (retryTimer) clearTimeout(retryTimer);
      ws?.close();
    };
  }, [user, applyIncomingMessage]);

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
        setConversations(res.conversations);
        const firstId = res.conversations[0]?.id ?? null;
        setActiveId(firstId);
        if (firstId != null) await fetchMessages(firstId);
      } finally {
        if (!cancelled) setLoadingList(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadFile = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("model_name", "message");
    fd.append("folder", "message");
    const up = await uploadMediaAction(fd);
    if (!up.success || !up.media) throw new Error(up.message ?? "Upload failed");
    const url = up.media.secure_url || up.media.public_url;
    const isImg = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
    return {
      attachmentUrl: url,
      attachmentType: isImg ? "image" : isPdf ? "pdf" : "file",
      attachmentName: file.name,
      attachmentMediaId: up.media.id,
    };
  };

  const onSend = () => {
    if (!active?.participant || activeId == null) return;
    const content = (drafts[activeId] ?? "").trim();
    if (!content && !pendingFile) return;

    const clientId = `tmp-${Date.now()}`;
    const file = pendingFile;
    setDrafts((d) => ({ ...d, [activeId]: "" }));
    setPendingFile(null);

    const isImage = !!file?.type.startsWith("image/");
    const previewUrl = file && isImage ? URL.createObjectURL(file) : undefined;
    if (previewUrl) previewUrlsRef.current.set(clientId, previewUrl);

    const optimistic: UiMessage = {
      id: 0,
      clientId,
      conversationId: active.id,
      senderId: myId,
      content,
      isRead: false,
      createdAt: new Date().toISOString(),
      sendStatus: "sending",
      attachmentUrl: previewUrl,
      attachmentName: file?.name,
      attachmentType: isImage ? "image" : file ? "file" : undefined,
    };
    setMessages((m) => [...m, optimistic]);
    shouldStickRef.current = true;
    requestAnimationFrame(() => scrollToBottom("smooth"));

    start(async () => {
      try {
        let meta: Awaited<ReturnType<typeof uploadFile>> | undefined;
        if (file) meta = await uploadFile(file);
        const res = await sendMessageAction({
          receiverId: active.participant!.id,
          content,
          eventId: active.eventId ?? undefined,
          ...meta,
        });
        if (res.success && res.chatMessage) {
          setMessages((prev) =>
            prev.map((m) =>
              m.clientId === clientId
                ? { ...res.chatMessage!, sendStatus: "sent" as const }
                : m,
            ),
          );
          void refreshConversationList();
        } else {
          setMessages((prev) =>
            prev.map((m) => (m.clientId === clientId ? { ...m, sendStatus: "failed" } : m)),
          );
          setError(res.message ?? "Send failed.");
        }
      } catch (e) {
        setMessages((prev) =>
          prev.map((m) => (m.clientId === clientId ? { ...m, sendStatus: "failed" } : m)),
        );
        setError(e instanceof Error ? e.message : "Send failed.");
      } finally {
        const url = previewUrlsRef.current.get(clientId);
        if (url) {
          // let React swap to the uploaded image first, then free the blob
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          previewUrlsRef.current.delete(clientId);
        }
      }
    });
  };

  const onDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Delete this message?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e11d48",
      reverseButtons: true,
    });
    if (!result.isConfirmed) return;

    start(async () => {
      const res = await deleteMessageAction(id);
      if (res.success) setMessages((prev) => prev.filter((m) => m.id !== id));
      else setError(res.message ?? "Delete failed.");
    });
  };

  const onSaveEdit = () => {
    if (editingId == null || !editText.trim()) return;
    const id = editingId;
    const content = editText.trim();
    start(async () => {
      const res = await editMessageAction(id, content);
      if (res.success && res.chatMessage) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...res.chatMessage!, sendStatus: "sent" } : m)),
        );
        setEditingId(null);
      } else setError(res.message ?? "Edit failed.");
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
      } else setError(res.message ?? "Could not start conversation.");
    });
  };

  return (
    <div className={cn("grid h-[min(40rem,calc(100dvh-9rem))] min-h-[28rem] grid-rows-[minmax(0,10rem)_minmax(0,1fr)] overflow-hidden rounded-2xl border border-fg/15 bg-panel/40 lg:grid-cols-[16rem_1fr] lg:grid-rows-[minmax(0,1fr)]", className)}>
      <aside className="flex min-h-0 flex-col border-b border-fg/10 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2 border-b border-fg/10 px-4 py-3">
          <MessageCircle className="size-4 text-coral" />
          <span className="font-semibold">Messages</span>
          <span className={cn("ml-auto size-2 rounded-full", wsState === "on" && "bg-emerald-400", wsState === "off" && "bg-fg/30", wsState === "error" && "bg-rose-400")} />
        </div>
        {allowStartById && (
          <div className="flex gap-2 border-b border-fg/10 p-3">
            <input value={startId} onChange={(e) => setStartId(e.target.value)} placeholder="User ID"
              className="min-w-0 flex-1 rounded-lg border border-fg/15 bg-transparent px-2 py-1.5 text-sm outline-none" />
            <button type="button" onClick={onStartById} disabled={pending}
              className="rounded-lg bg-coral px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-50 cursor-pointer">Start</button>
          </div>
        )}
        <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {loadingList && <li className="flex justify-center py-8"><Loader2 className="size-5 animate-spin text-fg/40" /></li>}
          {!loadingList && conversations.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-fg/50">No conversations yet.</li>
          )}
          {conversations.map((c) => (
            <li key={c.id}>
              <button type="button" onClick={() => selectConversation(c.id)}
                className={cn("flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-fg/5", c.id === activeId && "bg-fg/10")}>
                <Avatar name={c.participant?.name ?? "User"} image={c.participant?.profileImage} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="truncate text-sm font-semibold">{c.participant?.name ?? "User"}</p>
                    {c.unreadCount > 0 && (
                      <span className="rounded-full bg-coral px-1.5 text-[10px] font-bold text-white">{c.unreadCount}</span>
                    )}
                  </div>
                  <p className="truncate text-xs text-fg/50">{c.lastMessage?.content || c.lastMessage?.attachmentName || c.participant?.role || "—"}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex min-h-0 flex-col">
        {active ? (
          <>
            <div className="flex items-center gap-3 border-b border-fg/10 px-4 py-3">
              <Avatar name={active.participant?.name ?? "?"} image={active.participant?.profileImage} />
              <div>
                <p className="font-semibold">{active.participant?.name ?? "Unknown"}</p>
                <p className="text-xs capitalize text-fg/50">{active.participant?.role}</p>
              </div>
            </div>

            <div ref={listRef} onScroll={onListScroll} className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-4 pretty-scroll">
              {loadingOlder && (
                <div className="flex justify-center py-2"><Loader2 className="size-4 animate-spin text-fg/40" /></div>
              )}
              {loadingMsgs && messages.length === 0 && (
                <div className="flex justify-center py-6"><Loader2 className="size-5 animate-spin text-fg/40" /></div>
              )}
              {!loadingMsgs && messages.length === 0 && (
                <p className="py-8 text-center text-sm text-fg/50">No messages yet. Say hello.</p>
              )}
              {messages.map((m) => {
                const mine = m.senderId === myId;
                const key = m.clientId ?? String(m.id);
                return (
                  <div key={key} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[80%] rounded-2xl px-3.5 py-2 text-sm", mine ? "bg-coral text-white" : "bg-fg/10 text-fg", m.sendStatus === "failed" && "ring-1 ring-rose-400/50")}>
                      {editingId === m.id ? (
                        <div className="space-y-2">
                          <textarea value={editText} onChange={(e) => setEditText(e.target.value)}
                            className="w-full rounded-lg border border-fg/20 bg-background/80 p-2 text-fg text-sm" rows={2} />
                          <div className="flex gap-2">
                            <button type="button" onClick={onSaveEdit} className="rounded bg-fg/20 px-2 py-0.5 text-xs cursor-pointer">Save</button>
                            <button type="button" onClick={() => setEditingId(null)} className="rounded px-2 py-0.5 text-xs opacity-70 cursor-pointer">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {m.attachmentUrl && m.attachmentType === "image" && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <div className="relative mb-2 overflow-hidden rounded-lg">
                              <img src={m.attachmentUrl} alt={m.attachmentName ?? ""}
                                onLoad={() => { if (shouldStickRef.current) scrollToBottom("auto"); }}
                                className={cn("max-h-48 w-auto max-w-full rounded-lg object-cover", m.sendStatus === "sending" && "opacity-60")} />
                              {m.sendStatus === "sending" && (
                                <span className="absolute inset-0 grid place-items-center bg-black/20">
                                  <Loader2 className="size-5 animate-spin text-white" />
                                </span>
                              )}
                            </div>
                          )}
                          {m.attachmentUrl && m.attachmentType !== "image" && (
                            <a href={m.attachmentUrl} target="_blank" rel="noreferrer"
                              className="mb-1 flex items-center gap-1 text-xs underline opacity-90">
                              <FileText className="size-3.5" />
                              {m.attachmentName || "File"}
                            </a>
                          )}
                          {m.content ? <p className="whitespace-pre-wrap break-words">{m.content}</p> : null}
                          <p className={cn("mt-1 flex items-center justify-end gap-1 text-[10px]", mine ? "text-white/70" : "text-fg/45")}>
                            {m.isEdited && <span>edited · </span>}
                            <time dateTime={m.createdAt} title={dayjs(m.createdAt).format("DD MMM YYYY, hh:mm:ss A")} suppressHydrationWarning>
                              {timeLabel(m.createdAt)}
                            </time>
                            {mine && <StatusIcon status={m.sendStatus ?? "sent"} isRead={m.isRead} />}
                          </p>
                          {mine && m.id > 0 && (
                            <div className={cn("mt-1 flex gap-2 text-[10px]", mine ? "text-white/80" : "")}>
                              <button type="button" className="inline-flex items-center gap-0.5 hover:underline cursor-pointer"
                                onClick={() => { setEditingId(m.id); setEditText(m.content); }}>
                                <Pencil className="size-3" /> Edit
                              </button>
                              <button type="button" className="inline-flex items-center gap-0.5 hover:underline cursor-pointer"
                                onClick={() => onDelete(m.id)}>
                                <Trash2 className="size-3" /> Delete
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="h-px w-full shrink-0" aria-hidden />
            </div>

            {pendingFile && (
              <div className="flex items-center gap-2 border-t border-fg/10 px-3 py-1.5 text-xs text-fg/70">
                <FileText className="size-3.5" />
                <span className="truncate">{pendingFile.name}</span>
                <button type="button" onClick={() => setPendingFile(null)} className="ml-auto p-1 cursor-pointer"><X className="size-3.5" /></button>
              </div>
            )}

            <div className="flex gap-2 border-t border-fg/10 p-3">
              <input ref={fileRef} type="file" accept="image/*,.pdf,application/pdf" className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setPendingFile(f);
                  e.target.value = "";
                }} />
              <button type="button" onClick={() => fileRef.current?.click()}
                className="inline-flex size-10 items-center justify-center rounded-xl border border-fg/15 hover:bg-fg/5 cursor-pointer" title="Attach">
                <Paperclip className="size-4" />
              </button>
              <input
                value={activeId != null ? (drafts[activeId] ?? "") : ""}
                onChange={(e) => {
                  if (activeId == null) return;
                  setDrafts((d) => ({ ...d, [activeId]: e.target.value }));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); }
                }}
                placeholder="Type a message..."
                className="flex-1 rounded-xl border border-fg/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-coral/50"
              />
              <button type="button" onClick={onSend}
                disabled={pending || activeId == null || (!(drafts[activeId] ?? "").trim() && !pendingFile)}
                className="inline-flex items-center gap-1 rounded-xl bg-coral px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 cursor-pointer">
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
        <p className="col-span-full border-t border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs text-rose-300">{error}</p>
      )}
    </div>
  );
}