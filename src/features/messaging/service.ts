import { api } from "@/lib/api-client";

type ApiSuccess<T> = { success: boolean; statusCode: number; message: string; data: T };
type Raw = Record<string, unknown>;

export const listConversationsRequest = () =>
  api.get<ApiSuccess<Raw[]>>("/messaging/conversations");

export const getMessagesRequest = (convId: number | string, page = 1, pageSize = 40) =>
  api.get<ApiSuccess<{ messages: Raw[]; total: number; page: number; pageSize: number }>>(
    `/messaging/conversations/${convId}/messages`,
    { params: { page, page_size: pageSize } },
  );

export type SendMessageBody = {
  receiver_id: number;
  content?: string;
  event_id?: number;
  attachment_url?: string;
  attachment_type?: string;
  attachment_name?: string;
  attachment_media_id?: number;
};

export const sendMessageRequest = (data: SendMessageBody) =>
  api.post<ApiSuccess<Raw>>("/messaging/messages", data);

export const editMessageRequest = (id: number, content: string) =>
  api.put<ApiSuccess<Raw>>(`/messaging/messages/${id}`, { content });

export const deleteMessageRequest = (id: number) =>
  api.delete<ApiSuccess<unknown>>(`/messaging/messages/${id}`);

export const startConversationRequest = (data: { receiver_id: number; event_id?: number }) =>
  api.post<ApiSuccess<Raw>>("/messaging/conversations", data);

export const markReadRequest = (convId: number | string, message_ids: number[]) =>
  api.post<ApiSuccess<unknown>>(`/messaging/conversations/${convId}/read`, { message_ids });
