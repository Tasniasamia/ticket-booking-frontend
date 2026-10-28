"use server";

import { getErrorMessage } from "@/features/auth/service";
import {
  getMessagesRequest,
  listConversationsRequest,
  markReadRequest,
  sendMessageRequest,
  startConversationRequest,
} from "./service";
import { toConversation, toMessage, type ChatMessage, type Conversation } from "./types";

export type ConversationsResult = {
  success: boolean;
  message?: string;
  conversations?: Conversation[];
};

export async function getConversationsAction(): Promise<ConversationsResult> {
  try {
    const res = await listConversationsRequest();
    const list = Array.isArray(res.data.data) ? res.data.data : [];
    return { success: true, conversations: list.map(toConversation) };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export type MessagesResult = {
  success: boolean;
  message?: string;
  messages?: ChatMessage[];
  total?: number;
};

export async function getMessagesAction(
  convId: number | string,
  page = 1,
  pageSize = 40,
): Promise<MessagesResult> {
  try {
    const res = await getMessagesRequest(convId, page, pageSize);
    const data = res.data.data;
    const msgs = Array.isArray(data.messages) ? data.messages.map(toMessage) : [];
    return { success: true, messages: msgs, total: Number(data.total ?? msgs.length) };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export type SendResult = {
  success: boolean;
  message?: string;
  chatMessage?: ChatMessage;
};

export async function sendMessageAction(input: {
  receiverId: number;
  content: string;
  eventId?: number;
}): Promise<SendResult> {
  const content = input.content.trim();
  if (!content) return { success: false, message: "Message cannot be empty." };
  try {
    const res = await sendMessageRequest({
      receiver_id: input.receiverId,
      content,
      event_id: input.eventId,
    });
    return { success: true, chatMessage: toMessage(res.data.data as Record<string, unknown>) };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export type StartConvResult = {
  success: boolean;
  message?: string;
  conversation?: Conversation;
};

export async function startConversationAction(receiverId: number, eventId?: number): Promise<StartConvResult> {
  try {
    const res = await startConversationRequest({
      receiver_id: receiverId,
      event_id: eventId,
    });
    return { success: true, conversation: toConversation(res.data.data as Record<string, unknown>) };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}

export async function markReadAction(convId: number | string, messageIds: number[]) {
  try {
    if (!messageIds.length) return { success: true };
    await markReadRequest(convId, messageIds);
    return { success: true };
  } catch (err) {
    return { success: false, message: getErrorMessage(err) };
  }
}
