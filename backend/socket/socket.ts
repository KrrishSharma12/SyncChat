
import { Server } from "socket.io";
import dotenv from "dotenv";
export let io: Server;
export const userSocketMap = new Map<string, string>();
dotenv.config();
export const initializeSocket = (server: any) => {

    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
        },
    });

    io.on("connection", (socket) => {

        socket.on("typing", ({ receiverId, conversationId, }: { receiverId: string; conversationId: string; }) => {

            const receiverSocketId = userSocketMap.get(receiverId);

            if (receiverSocketId) {

                io.to(receiverSocketId).emit("user-typing",
                    {
                        conversationId,
                    }
                );

            }
        }
        );

        socket.on("stop-typing", ({ receiverId, conversationId, }: { receiverId: string; conversationId: string; }) => {

            const receiverSocketId = userSocketMap.get(receiverId);

            if (receiverSocketId) {

                io.to(receiverSocketId).emit("user-stop-typing",
                    {
                        conversationId,
                    }
                );

            }

        }
        );

        socket.on("setup", (userId: string) => {
            const oldSocketId = userSocketMap.get(userId);

            // Store latest socket
            userSocketMap.set(userId, socket.id);

            // Save userId on socket itself
            socket.data.userId = userId;

         


            // If user already had another socket,
            // don't send offline event.
            if (!oldSocketId) {

                io.emit("user-status", {userId,online: true,});
            }

        }
    );


    socket.on("check-user-status",(userId: string) => {

        const online = userSocketMap.has(userId);
        // Send ONLY to the user who requested it

        socket.emit("user-status-response",{ userId, online, } );
      }
    );


        socket.on("disconnect", () => {

            const userId = socket.data.userId;
            if (!userId) {
                return;
            }


            const currentSocketId =userSocketMap.get(userId);


            // VERY IMPORTANT
            //
            // Only delete the user if the socket
            // disconnecting is still the user's
            // current socket.

            if (currentSocketId === socket.id) {

                userSocketMap.delete(userId);

                io.emit("user-status", { userId, online: false,});


            }

        });

    });

};



