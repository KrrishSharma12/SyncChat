import { z } from "zod";


// Send Message
// POST /chat/messages

export const sendMessageSchema = z.object({

  body: z.object({

    receiverId: z
      .string()
      .uuid("Invalid receiver ID"),

    content: z
      .string()
      .trim()
      .min(1, "Message cannot be empty")
      .max(5000, "Message is too long"),

  }),

});


// Get Messages
// GET /chat/messages/:conversationId

export const getMessagesSchema = z.object({

  params: z.object({

    conversationId: z
      .string()
      .uuid("Invalid conversation ID"),

  }),

});


// Get Conversation By ID
// GET /chat/conversations/:conversationId

export const getConversationByIdSchema = z.object({

  params: z.object({

    conversationId: z
      .string()
      .uuid("Invalid conversation ID"),

  }),

});


// Get Conversation With User
// GET /chat/conversations/user/:receiverId

export const getConversationWithUserSchema = z.object({

  params: z.object({

    receiverId: z
      .string()
      .uuid("Invalid receiver ID"),

  }),

});


// Mark Messages As Read
// PATCH /chat/messages/:conversationId/read

export const markMessagesAsReadSchema = z.object({

  params: z.object({

    conversationId: z
      .string()
      .uuid("Invalid conversation ID"),

  }),

});


// Get Conversations / Recent Chats
// GET /chat/conversations

export const getConversationsSchema = z.object({

  query: z.object({}).optional(),

});