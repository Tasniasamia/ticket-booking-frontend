// "use server";

// import { getErrorMessage } from "@/features/auth/service";
// import { getToken } from "@/lib/session";
// import {
//   deleteMessageRequest,
//   editMessageRequest,
//   getMessagesRequest,
//   listConversationsRequest,
//   markReadRequest,
//   sendMessageRequest,
//   startConversationRequest,
//   type SendMessageBody,
// } from "./service";
// import { toConversation, toMessage, type ChatMessage, type Conversation } from "./types";

// export async function getConversationsAction() {
//   try {
//     const res = await listConversationsRequest();
//     const list = Array.isArray(res.data.data) ? res.data.data : [];
//     return { success: true as const, conversations: list.map(toConversation) };
//   } catch (err) {
//     return { success: false as const, message: getErrorMessage(err) };
//   }
// }

// export async function getMessagesAction(convId: number | string, page = 1, pageSize = 40) {
//   try {
//     const res = await getMessagesRequest(convId, page, pageSize);
//     const data = res.data.data;
//     const msgs = Array.isArray(data.messages) ? data.messages.map(toMessage) : [];
//     return { success: true as const, messages: msgs, total: Number(data.total ?? msgs.length) };
//   } catch (err) {
//     return { success: false as const, message: getErrorMessage(err) };
//   }
// }

// export async function sendMessageAction(input: {
//   receiverId: number;
//   content?: string;
//   eventId?: number;
//   attachmentUrl?: string;
//   attachmentType?: string;
//   attachmentName?: string;
//   attachmentMediaId?: number;
// }) {
//   const content = (input.content ?? "").trim();
//   if (!content && !input.attachmentUrl) {
//     return { success: false as const, message: "Message or file required." };
//   }
//   try {
//     const body: SendMessageBody = {
//       receiver_id: input.receiverId,
//       content,
//       event_id: input.eventId,
//       attachment_url: input.attachmentUrl,
//       attachment_type: input.attachmentType,
//       attachment_name: input.attachmentName,
//       attachment_media_id: input.attachmentMediaId,
//     };
//     const res = await sendMessageRequest(body);
//     return {
//       success: true as const,
//       chatMessage: toMessage(res.data.data as Record<string, unknown>),
//     };
//   } catch (err) {
//     return { success: false as const, message: getErrorMessage(err) };
//   }
// }

// export async function editMessageAction(id: number, content: string) {
//   try {
//     const res = await editMessageRequest(id, content.trim());
//     return {
//       success: true as const,
//       chatMessage: toMessage(res.data.data as Record<string, unknown>),
//     };
//   } catch (err) {
//     return { success: false as const, message: getErrorMessage(err) };
//   }
// }

// export async function deleteMessageAction(id: number) {
//   try {
//     await deleteMessageRequest(id);
//     return { success: true as const };
//   } catch (err) {
//     return { success: false as const, message: getErrorMessage(err) };
//   }
// }

// export async function startConversationAction(receiverId: number, eventId?: number) {
//   try {
//     const res = await startConversationRequest({ receiver_id: receiverId, event_id: eventId });
//     return {
//       success: true as const,
//       conversation: toConversation(res.data.data as Record<string, unknown>),
//     };
//   } catch (err) {
//     return { success: false as const, message: getErrorMessage(err) };
//   }
// }

// export async function markReadAction(convId: number | string, messageIds: number[]) {
//   try {
//     if (!messageIds.length) return { success: true as const };
//     await markReadRequest(convId, messageIds);
//     return { success: true as const };
//   } catch (err) {
//     return { success: false as const, message: getErrorMessage(err) };
//   }
// }

// export async function getMessagingWsTokenAction() {
//   const token = await getToken();
//   if (!token) return { success: false as const, message: "Not authenticated" };
//   return { success: true as const, token };
// }

"use server";

import { getErrorMessage } from "@/features/auth/service";
import { getToken } from "@/lib/session";
import {
  deleteMessageRequest,
  editMessageRequest,
  getMessagesRequest,
  listConversationsRequest,
  markReadRequest,
  sendMessageRequest,
  startConversationRequest,
  type SendMessageBody,
} from "./service";
import { toConversation, toMessage, type ChatMessage, type Conversation } from "./types";

export async function getConversationsAction() {
  try {
    const res = await listConversationsRequest();
    const list = Array.isArray(res.data.data) ? res.data.data : [];
    return { success: true as const, conversations: list.map(toConversation) };
  } catch (err) {
    return { success: false as const, message: getErrorMessage(err) };
  }
}

/** beforeId omitted -> newest page. beforeId set -> the page of messages older than that id. */
export async function getMessagesAction(convId: number | string, beforeId?: number, pageSize = 30) {
  try {
    const res = await getMessagesRequest(convId, beforeId, pageSize);
    const data = res.data.data;
    const msgs = Array.isArray(data.messages) ? data.messages.map(toMessage) : [];
    return {
      success: true as const,
      messages: msgs,
      total: Number(data.total ?? msgs.length),
      hasMore: Boolean(data.hasMore),
    };
  } catch (err) {
    return { success: false as const, message: getErrorMessage(err) };
  }
}

export async function sendMessageAction(input: {
  receiverId: number;
  content?: string;
  eventId?: number;
  attachmentUrl?: string;
  attachmentType?: string;
  attachmentName?: string;
  attachmentMediaId?: number;
}) {
  const content = (input.content ?? "").trim();
  if (!content && !input.attachmentUrl) {
    return { success: false as const, message: "Message or file required." };
  }
  try {
    const body: SendMessageBody = {
      receiver_id: input.receiverId,
      content,
      event_id: input.eventId,
      attachment_url: input.attachmentUrl,
      attachment_type: input.attachmentType,
      attachment_name: input.attachmentName,
      attachment_media_id: input.attachmentMediaId,
    };
    const res = await sendMessageRequest(body);
    return {
      success: true as const,
      chatMessage: toMessage(res.data.data as Record<string, unknown>),
    };
  } catch (err) {
    return { success: false as const, message: getErrorMessage(err) };
  }
}

export async function editMessageAction(id: number, content: string) {
  try {
    const res = await editMessageRequest(id, content.trim());
    return {
      success: true as const,
      chatMessage: toMessage(res.data.data as Record<string, unknown>),
    };
  } catch (err) {
    return { success: false as const, message: getErrorMessage(err) };
  }
}

export async function deleteMessageAction(id: number) {
  try {
    await deleteMessageRequest(id);
    return { success: true as const };
  } catch (err) {
    return { success: false as const, message: getErrorMessage(err) };
  }
}

export async function startConversationAction(receiverId: number, eventId?: number) {
  try {
    const res = await startConversationRequest({ receiver_id: receiverId, event_id: eventId });
    return {
      success: true as const,
      conversation: toConversation(res.data.data as Record<string, unknown>),
    };
  } catch (err) {
    return { success: false as const, message: getErrorMessage(err) };
  }
}

export async function markReadAction(convId: number | string, messageIds: number[]) {
  try {
    if (!messageIds.length) return { success: true as const };
    await markReadRequest(convId, messageIds);
    return { success: true as const };
  } catch (err) {
    return { success: false as const, message: getErrorMessage(err) };
  }
}

export async function getMessagingWsTokenAction() {
  const token = await getToken();
  if (!token) return { success: false as const, message: "Not authenticated" };
  return { success: true as const, token };
}
