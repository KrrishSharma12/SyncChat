import { api } from "./axiosInstance";


export interface SendMessagePayload {
  receiverId: string;
  content: string;
}



export const sendMessage = async (payload: SendMessagePayload) => {
  const response = await api.post("/chat/messages", payload);
  return response.data;
};


export const getMessages = async (conversationId: string) => {
  const response = await api.get(`/chat/messages/${conversationId}`);
  return response.data;
};

export const getConversations = async () => {
  const response = await api.get("/chat/conversations");
  return response.data;
};

export const markMessagesAsRead = async (conversationId: string) => {
  const response = await api.patch(`/chat/messages/${conversationId}/read`);
  return response.data;
};

export const getConversationWithUser = async (receiverId: string) => {
  const response = await api.get(`/chat/conversations/user/${receiverId}`);
  return response.data;
};

export const deleteConversation = async (conversationId: string) => {
  const response = await api.delete(`/chat/conversation/${conversationId}`);
  return response.data;
};