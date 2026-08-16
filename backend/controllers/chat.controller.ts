import { Request, Response } from "express";
import { Prisma, PrismaClient } from "../generated/prisma/client";
import { adapter } from "../utils/prismaAdapter"
import { generateDirectChatKey } from "../utils/chat";
import { io, userSocketMap } from "../socket/socket";

const prisma = new PrismaClient({ adapter });



export const getConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Get conversations where:
    // 1. Current user is a participant
    // 2. Current user has NOT deleted the conversation
    const conversations =await prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              id: userId,
            },
          },

          NOT: {
            deletedBy: {
              has: userId,
            },
          },
        },

        include: {
          participants: {
            select: {
              id: true,
              username: true,
              profilePic: true,
            },
          },

          messages: {
            orderBy: {
              createdAt: "desc",
            },

            take: 1,
          },
        },

        orderBy: {
          updatedAt: "desc",
        },
      });

    // Format conversations for frontend
    const formattedConversations =
      conversations.map((conversation) => {

        // Find the other participant
        const participant =conversation.participants.find((user) => user.id !== userId);

        return {
          conversationId: conversation.id,

          participant: participant
            ? {
                id: participant.id,
                username: participant.username,
                profilePic: participant.profilePic,
              }
            : null,

          lastMessage:
            conversation.messages[0]?.content ?? "",

          updatedAt:conversation.updatedAt,
          unreadCount: 0,
          online: false,
        };
      });

    return res.status(200).json({success: true,conversations: formattedConversations,
    });

  } catch (error) {
    console.error("Get conversations error:",error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getConversationWithUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { receiverId } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if (!receiverId || Array.isArray(receiverId)) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID is required",
            });
        }

        if (userId === receiverId) {
            return res.status(400).json({
                success: false,
                message: "You cannot chat with yourself",
            });
        }

        const directChatKey = generateDirectChatKey(userId, receiverId);

        const conversation = await prisma.conversation.findUnique({
            where: {
                directChatKey,
            },

            include: {
                participants: {
                    select: {
                        id: true,
                        username: true,
                        profilePic: true,
                    },
                },

                messages: {
                    orderBy: {
                        createdAt: "asc",
                    },

                    include: {
                        sender: {
                            select: {
                                id: true,
                                username: true,
                                profilePic: true,
                            },
                        },
                    },
                },
            },
        });

        // Conversation doesn't exist yet
        if (!conversation) {
            return res.status(200).json({
                success: true,
                conversation: null,
                messages: [],
            });
        }

        return res.status(200).json({
            success: true,
            conversation,
            messages: conversation.messages,
        });

    } catch (error) {
        console.error("Error fetching conversation with user:",error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const markMessagesAsRead = async (req: Request, res: Response) => {

    try {
        const userId = req.user?.id;
        const { conversationId } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if (!conversationId || Array.isArray(conversationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid conversation ID",
            });
        }

        const result = await prisma.message.updateMany({
            where: {
                conversationId: conversationId,

                senderId: {
                    not: userId,
                },

                readAt: null,
            },

            data: {
                readAt: new Date(),
            },
        });


        return res.status(200).json({
            success: true,
            message: "Messages marked as read",
            updatedCount: result.count,
        });

    } catch (error) {
        console.error("Error marking messages as read:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const sendMessage = async (req: Request, res: Response) => {
    try {
        const senderId = req.user?.id;
        const { receiverId, content } = req.body;

        if (!senderId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if (!receiverId || !content?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Receiver and content are required",
            });
        }

        if (senderId === receiverId) {
            return res.status(400).json({
                success: false,
                message: "You cannot send message to yourself",
            });
        }

        const directChatKey = generateDirectChatKey(senderId, receiverId);

        const result = await prisma.$transaction(async (tx) => {

            // Check if receiver exists
            const receiver = await tx.user.findUnique({
                where: {
                    id: receiverId,
                },
            });

            if (!receiver) {
                throw new Error("Receiver not found");
            }

            // Find existing conversation
          let conversation = await tx.conversation.findUnique({
  where: {
    directChatKey,
  },
});

if (!conversation) {
  conversation = await tx.conversation.create({
    data: {
      directChatKey,
      isGroup: false,

      participants: {
        connect: [
          {
            id: senderId,
          },
          {
            id: receiverId,
          },
        ],
      },

      deletedBy: [],
    },
  });
} else {
  // Sender had previously deleted this chat.
  // Make it visible again for sender.

  const updatedDeletedBy =
    conversation.deletedBy.filter(
      (id) => id !== senderId
    );

  conversation = await tx.conversation.update({
    where: {
      id: conversation.id,
    },

    data: {
      deletedBy: {
        set: updatedDeletedBy,
      },

      updatedAt: new Date(),
    },
  });
}
            // Save message
         const message = await tx.message.create({
  data: {
    content: content.trim(),
    senderId,
    conversationId: conversation.id,
  },
});

            return {
                conversation,
                message,
            };
        });
        const receiverSocketId = userSocketMap.get(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("new-message", {
                conversationId: result.conversation.id,
                message: result.message,
            });
        }

        return res.status(201).json({
            success: true,
            conversationId: result.conversation.id,
            message: result.message
        });

    } catch (error) {
        console.error(error);

        if (
            error instanceof Error &&
            error.message === "Receiver not found"
        ) {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const getMessages = async (req: Request, res: Response) => {
    try {

        const userId = req.user?.id;
        const conversationId = req.params.conversationId as string;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const conversation = await prisma.conversation.findUnique({

            where: {
                id: conversationId,
            },

            include: {

                participants: {

                    select: {

                        id: true,

                        username: true,

                        profilePic: true,

                    },

                },

                messages: {

                    orderBy: {

                        createdAt: "asc",

                    },

                    include: {

                        sender: {

                            select: {

                                id: true,

                                username: true,

                                profilePic: true,

                            },

                        },

                    },

                },

            },

        }) as Prisma.ConversationGetPayload<{
            include: {
                participants: {
                    select: {
                        id: true;
                        username: true;
                        profilePic: true;
                    };
                };
                messages: {
                    orderBy: {
                        createdAt: "asc";
                    };
                    include: {
                        sender: {
                            select: {
                                id: true;
                                username: true;
                                profilePic: true;
                            };
                        };
                    };
                };
            };
        }> | null;

        if (!conversation) {

            return res.status(404).json({

                success: false,

                message: "Conversation not found",

            });

        }
        const otherUser = conversation?.participants.find(
            (participant) => participant.id !== req.user?.id
        );
        const isOnline = otherUser ? userSocketMap.has(otherUser.id) : false;

        // Check if current user belongs to this conversation

        const isParticipant = conversation.participants.some((participant) =>
            participant.id === userId
        );
        if (!isParticipant) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }
        return res.status(200).json({
            success: true,
            conversation: {
                id: conversation.id,
                isGroup: conversation.isGroup,
                participants:
                    conversation.participants,
            },
            messages: conversation.messages,
            isOnline,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });

    }
};



export const deleteConversation = async (req: Request,res: Response) => {
  try {
    const userId = req.user?.id;
const conversationId = req.params.conversationId as string;

  
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    const conversation =
      await prisma.conversation.findFirst({
        where: {
          id: conversationId!,

          participants: {
            some: {
              id: userId,
            },
          },
        },
      });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    await prisma.conversation.update({
      where: {
        id: conversationId,
      },

      data: {
        deletedBy: {
          push: userId,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Chat deleted successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};