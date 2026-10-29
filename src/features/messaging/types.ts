export type UserBrief = {
  id: number;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
};

export type ChatMessage = {
  id: number;
  conversationId: number;
  senderId: number;
  sender?: UserBrief | null;
  content: string;
  isRead: boolean;
  isEdited?: boolean;
  attachmentUrl?: string;
  attachmentType?: string;
  attachmentName?: string;
  attachmentMediaId?: number;
  createdAt: string;
  updatedAt?: string;
};

export type Conversation = {
  id: number;
  participant: UserBrief | null;
  eventId?: number | null;
  lastMessage?: ChatMessage | null;
  unreadCount: number;
  updatedAt: string;
  createdAt: string;
};

type Raw = Record<string, unknown>;
const asObj = (v: unknown): Raw => (v && typeof v === "object" ? (v as Raw) : {});

function toUser(v: unknown): UserBrief | null {
  const o = asObj(v);
  if (!Number(o.id ?? 0)) return null;
  return {
    id: Number(o.id),
    name: String(o.name ?? ""),
    email: String(o.email ?? ""),
    role: String(o.role ?? ""),
    profileImage: o.profile_image ? String(o.profile_image) : undefined,
  };
}

export function toMessage(d: Raw): ChatMessage {
  return {
    id: Number(d.id ?? 0),
    conversationId: Number(d.conversation_id ?? 0),
    senderId: Number(d.sender_id ?? 0),
    sender: toUser(d.sender),
    content: String(d.content ?? ""),
    isRead: Boolean(d.is_read),
    isEdited: Boolean(d.is_edited),
    attachmentUrl: d.attachment_url ? String(d.attachment_url) : undefined,
    attachmentType: d.attachment_type ? String(d.attachment_type) : undefined,
    attachmentName: d.attachment_name ? String(d.attachment_name) : undefined,
    attachmentMediaId:
      d.attachment_media_id != null ? Number(d.attachment_media_id) : undefined,
    createdAt: String(d.created_at ?? ""),
    updatedAt: d.updated_at ? String(d.updated_at) : undefined,
  };
}

export function toConversation(d: Raw): Conversation {
  const lm = d.last_message;
  return {
    id: Number(d.id ?? 0),
    participant: toUser(d.participant),
    eventId: d.event_id != null ? Number(d.event_id) : null,
    lastMessage: lm && typeof lm === "object" ? toMessage(asObj(lm)) : null,
    unreadCount: Number(d.unread_count ?? 0),
    updatedAt: String(d.updated_at ?? d.UpdatedAt ?? ""),
    createdAt: String(d.created_at ?? d.CreatedAt ?? ""),
  };
}
