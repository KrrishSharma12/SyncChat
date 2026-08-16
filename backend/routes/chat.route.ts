import Router from "express";
import { sendMessage, getMessages, getConversations, markMessagesAsRead, getConversationWithUser, deleteConversation } from "../controllers/chat.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { sendMessageSchema, getMessagesSchema, getConversationsSchema, markMessagesAsReadSchema, getConversationWithUserSchema } from "../schemas/chat.schema";
const router = Router();

router.post("/messages",authMiddleware,validate(sendMessageSchema), sendMessage);
router.get("/conversations/user/:receiverId",authMiddleware,validate(getConversationWithUserSchema),getConversationWithUser);
router.get("/messages/:conversationId",authMiddleware,getMessages);
router.get("/conversations",authMiddleware,validate(getConversationsSchema), getConversations);
router.patch("/messages/:conversationId/read",authMiddleware,validate(markMessagesAsReadSchema),markMessagesAsRead);
router.delete("/conversation/:conversationId", authMiddleware,deleteConversation);
// router.get("/conversations/:conversationId",authMiddleware,validate(getConversationByIdSchema),getConversationById);
export default router;