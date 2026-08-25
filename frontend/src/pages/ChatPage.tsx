import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../socket/socket";
import Sidebar from "../components/SideBar";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { IoMenu, IoCall, IoAdd, IoHappy, IoSend, IoCheckmarkDone, IoChatbubbles, IoSync, IoSettings } from "react-icons/io5";
import { BiSolidDownArrowAlt } from "react-icons/bi";

import { IoMdArrowBack } from "react-icons/io";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { getMessages, markMessagesAsRead, sendMessage, getConversationWithUser } from "../services/chat.service";
import { getUser } from "@/services/user.service";
import '../App.css';

interface Message {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  participants: {
    id: string;
    username: string;
    profilePic: string | null;
  }[];
}

interface ReceiverUser {
  id: string;
  username: string;
  profilePic: string | null;
}


const ChatPage: React.FC = () => {

  const navigate = useNavigate();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { conversationId, receiverId } = useParams();
  const messagesRef = useRef<HTMLDivElement>(null);
  const [receiver, setReceiver] = useState<ReceiverUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatReceiverId, setChatReceiverId] = useState<string | null>(receiverId ?? null);
  const [isOnline, setIsOnline] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const theme = useThemeStore((state) => state.theme);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  useEffect(() => {

    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }

  }, [isAuthenticated, isLoading, navigate]);



  // Fetch receiver user details if receiverId is present
  useEffect(() => {
    if (receiverId) {
      const fetchUser = async () => {
        const fetchedUser = await getUser(receiverId);
        setReceiver(fetchedUser);
      }
      fetchUser();
    }

  }, [receiverId]);

  //  Listen for incoming messages

  useEffect(() => {

    const handleNewMessage = async (data: {
      conversationId: string;
      message: Message;
    }) => {

      if (data.conversationId !== conversationId) {
        return;
      }

      setMessages((prev) => [
        ...prev,
        data.message,
      ]);
      await markMessagesAsRead(conversationId);

    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };

  }, [conversationId]);

  // Fetch messages for the conversation if conversationId is present
  useEffect(() => {

    const loadChat = async () => {

      try {

        setLoadingMessages(true);

        // CASE 1: Existing conversation
        // /chat/:conversationId


        if (conversationId) {

          const data =
            await getMessages(conversationId);

          setMessages(data.messages);
          setConversation(data.conversation);

          await markMessagesAsRead(
            conversationId
          );

          if (data.conversation) {

            const otherUser =
              data.conversation.participants.find(
                (participant: { id: string }) =>
                  participant.id !== user?.id
              );

            if (otherUser) {

              setChatReceiverId(
                otherUser.id
              );

              setReceiver(otherUser);

            }
          }

          return;
        }


        // CASE 2: User searched from dashboard
        // /chat/user/:receiverId

        if (receiverId) {

          const data =await getConversationWithUser(receiverId);

          // Receiver details
          const fetchedUser = await getUser(receiverId);

          setReceiver(fetchedUser);
          setChatReceiverId(receiverId);


          // Conversation already exists
          if (data.conversation) {
            setConversation(data.conversation);
            setMessages(data.messages);

            // Mark old messages as read
            await markMessagesAsRead(data.conversation.id);

          } else {

            // No previous conversation
            setConversation(null);
            setMessages([]);

          }
        }

      } catch (error) {

        console.error("Error loading chat:", error);

      } finally {

        setLoadingMessages(false);

      }

    };

    loadChat();

  }, [conversationId, receiverId, user?.id]);

  // Listen for online status updates

useEffect(() => {

  const checkUserStatus = (data: {
    userId: string;
    online: boolean;
  }) => {
    if (data.userId === chatReceiverId) {
      setIsOnline(data.online);
    }

  };


  socket.on("user-status",checkUserStatus);
  return () => {
    socket.off("user-status",checkUserStatus);
  };
}, [chatReceiverId]);

useEffect(() => {

  const handleStatusResponse = (data: {
    userId: string;
    online: boolean;
  }) => {
    if (data.userId === chatReceiverId) {
      setIsOnline(data.online);
    }

  };


  socket.on("user-status-response",handleStatusResponse);


  return () => {
    socket.off("user-status-response",handleStatusResponse);
  };

}, [chatReceiverId]);

useEffect(() => {

  if (!chatReceiverId) {
    return;
  }

  
  socket.emit("check-user-status",chatReceiverId);


}, [chatReceiverId]);

  useEffect(() => {

    if (messagesRef.current) {

      messagesRef.current.scrollTop =
        messagesRef.current.scrollHeight;

    }

  }, [messages]);

  useEffect(() => {

    const handleTyping = (data: { conversationId: string; }) => {
      if (data.conversationId === conversationId) {
        setIsTyping(true);
      }

    };

    const handleStopTyping = (data: { conversationId: string; }) => {

      if (data.conversationId === conversationId) {
        setIsTyping(false);
      }
    };

    socket.on("user-typing", handleTyping
    );

    socket.on("user-stop-typing", handleStopTyping);

    return () => {

      socket.off("user-typing", handleTyping);

      socket.off("user-stop-typing", handleStopTyping);

    };

  }, [conversationId]);

  const handleSendMessage = async () => {

    if (!message.trim()) return;

    try {

      const response = await sendMessage({
        receiverId: conversation?.participants.find((p: { id: string }) => p.id !== user?.id)?.id || receiverId || "",
        content: message,

      });

      setMessages((prev) => [...prev, response.message,]);

      setMessage("");
      setShowEmojiPicker(false);

    } catch (error) {

      console.error(error);

    }

  };
  if (isLoading || loadingMessages) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        Loading...

      </div>

    );

  }
  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-[#f9f9ff] text-gray-900"}`}>

      {/* Overlay */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className={`md:ml-90 h-screen flex flex-col relative ${theme === "dark" ? "bg-slate-950" : "bg-[#f9f9ff]"}`}>

        {/* Header */}

        <header className={`h-16 ${theme === "dark" ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-gray-200"} backdrop-blur-md border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-30`}>

          {/* Left */}

          <div className="flex items-center gap-3">

            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-indigo-600">
              <IoMenu size={28} />
            </button>

            <div className="relative ">
              <div className="flex justify-between items-center gap-6">
                <span onClick={() => navigate('/recents')}><IoMdArrowBack size={30} /></span>
                <img src={conversation?.participants.find((participant: { id: string; username: string; profilePic: string | null }) => participant.id !== user?.id)?.profilePic || receiver?.profilePic ||
                  "/default-avatar.png"} alt="Profile" className="w-10 h-10 rounded-full object-cover" />

                {/* Online Indicator */}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />

            </div>

            <div>

              <h2 className="font-semibold text-lg">

                {conversation?.participants.find(
                  (participant: { id: string; username: string; profilePic: string | null }) => participant.id !== user?.id
                )?.username || receiver?.username || "Loading..."}

              </h2>
              <p className="text-sm text-green-600">{isOnline ? "Online" : "Offline"}</p>



            </div>

          </div>

          {/* Right */}

          <div className="flex items-center gap-2">

          

            <button className="p-2 rounded-full hover:bg-gray-100 transition">

              <IoCall size={22} />

            </button>

          

          </div>

        </header>
        <section
          ref={messagesRef}
          onScroll={() => {
            if (!messagesRef.current) return;

            const { scrollTop, scrollHeight, clientHeight } =
              messagesRef.current;

            const isNearBottom =
              scrollHeight - scrollTop - clientHeight < 100;

            setShowScrollButton(!isNearBottom);
          }}
          className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col gap-4"
        >

          {/* Date */}

          <div className="flex justify-center my-3">

            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">

              Today

            </span>

          </div>

          {/* Empty State */}

          {messages.length === 0 ? (

            <div className="flex flex-1 flex-col items-center justify-center text-center">

              <div className="w-40 h-40 rounded-full bg-indigo-100 flex items-center justify-center">

                <IoChatbubbles
                  size={60}
                  className="text-indigo-600"
                />

              </div>

              <h3 className="mt-5 text-xl font-semibold">

                No messages yet

              </h3>

              <p className="text-gray-500 max-w-xs mt-2">

                Start your first conversation 👋

              </p>

            </div>

          ) : (

            messages.map((msg) => {

              const isMine = msg.senderId === user?.id;

              return (

                <div
                  key={msg.id}
                  className={`flex ${isMine
                    ? "justify-end"
                    : "justify-start"
                    }`}
                >

                  <div
                    className={`max-w-[85%] md:max-w-[70%] flex flex-col ${isMine
                      ? "items-end"
                      : "items-start"
                      }`}
                  >

                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm ${isMine
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                        }`}
                    >

                      <p className="text-sm leading-6 wrap-break-word">

                        {msg.content}

                      </p>

                    </div>

                    <div className="flex items-center gap-1 mt-1 px-1">

                      <span className="text-[10px] text-gray-500">

                        {new Date(
                          msg.createdAt
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}

                      </span>

                      {isMine && (

                        <IoCheckmarkDone
                          size={15}
                          className="text-indigo-600"
                        />

                      )}

                    </div>

                  </div>

                </div>

              );

            })

          )}

        </section>
        {showScrollButton && (
          <button
            onClick={() => {
              messagesRef.current?.scrollTo({
                top: messagesRef.current.scrollHeight,
                behavior: "smooth",
              });
            }}
            className="absolute right-6 bottom-24 z-20 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition"
            aria-label="Scroll to latest messages"
          >
            <BiSolidDownArrowAlt size={25}/>
            </button>
        )}
        {/* Chat Input */}

        <footer className={`sticky bottom-16 md:bottom-0 ${theme === "dark" ? "bg-slate-900/90 border-slate-800" : "bg-white/90 border-gray-200"} backdrop-blur-xl border-t p-4 z-20`}>

          <div className="max-w-4xl mx-auto flex items-center gap-3">

            {/* Attachment */}

            <button
              className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
            >
              <IoAdd size={22} />
            </button>

            {/* Input */}

            <div className="flex-1 relative flex items-center">
              {isTyping && (
                <div className="px-3 sm:px-4 md:px-8 pb-1.5">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                    <span className="truncate max-w-[65%]">
                      {conversation?.participants.find(
                        (participant) => participant.id !== user?.id
                      )?.username}{" "}
                      is typing
                    </span>

                    <span className="flex items-center gap-1 shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              )}
              <input value={message} onChange={(e) => {
                const value = e.target.value;
                setMessage(value);

                if (!chatReceiverId || !conversationId) {
                  return;
                }

                if (!value.trim()) {
                  socket.emit("stop-typing", {
                    receiverId: chatReceiverId,
                    conversationId,
                  });

                  return;
                }

                socket.emit("typing", {
                  receiverId: chatReceiverId,
                  conversationId,
                });

                if (typingTimeoutRef.current) {
                  clearTimeout(typingTimeoutRef.current);
                }

                typingTimeoutRef.current = setTimeout(() => {
                  socket.emit("stop-typing", {
                    receiverId: chatReceiverId,
                    conversationId,
                  });
                }, 1000);
              }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}

                placeholder="Type a message..."
                className={`w-full h-12 rounded-full border px-4 pr-12 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 ${theme === "dark"
                  ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-400"
                  : "border-gray-300 bg-gray-50 text-gray-900"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="absolute right-3 text-gray-500 hover:text-indigo-600 transition"
              >
                <IoHappy size={22} />
              </button>
              {showEmojiPicker && (
                <div className="absolute z-50 bottom-14 left-1/2 -translate-x-1/2 w-[calc(100vw-24px)] max-w-82.5 sm:left-auto sm:right-0 sm:translate-x-0 sm:w-auto sm:max-w-none ">
                  <EmojiPicker theme={theme === "dark" ? Theme.DARK : Theme.LIGHT} width="100%" height={280} searchDisabled={true} previewConfig={{
                    showPreview: false,
                  }}
                    onEmojiClick={(emojiData) => { setMessage((prev) => prev + emojiData.emoji); }}
                  />
                </div>
              )}
            </div>

            {/* Send */}

            <button disabled={!message.trim()} onClick={handleSendMessage} className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition ${message.trim() ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`} >

              <IoSend size={20} />

            </button>

          </div>

        </footer>

        {/* Mobile Bottom Navigation */}

        <nav className={`fixed bottom-0 left-0 right-0 h-16 ${theme === "dark" ? "bg-slate-900/90 border-slate-800" : "bg-white/90 border-gray-200"} backdrop-blur-xl border-t flex items-center justify-around md:hidden z-40`}>

          <button className="flex flex-col items-center gap-1 text-indigo-600 text-xs" >
            <IoChatbubbles size={22} />

            <span>Chats</span>

          </button>

          <button className="flex flex-col items-center gap-1 text-gray-500 text-xs">

            <IoCall size={22} />

            <span> Calls</span>

          </button>

          <button
            className="flex flex-col items-center gap-1 text-gray-500 text-xs"
          >

            <IoSync size={22} />

            <span> Status </span>

          </button>

          <button
            className="flex flex-col items-center gap-1 text-gray-500 text-xs"
          >

            <IoSettings size={22} />

            <span>
              Settings
            </span>

          </button>

        </nav>

      </main>

    </div>

  );

};

export default ChatPage;