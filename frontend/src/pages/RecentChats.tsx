import  { useEffect, useMemo, useState, } from "react";

import { useNavigate } from "react-router-dom";

import { IoMenu, IoSearch, IoChatbubbles, } from "react-icons/io5";

import Sidebar from "../components/SideBar";

import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";

import { deleteConversation, getConversations, } from "../services/chat.service";
import { socket } from "@/socket/socket";

interface RecentChat {

  conversationId: string;

  lastMessage: string;

  updatedAt: string;

  unreadCount: number;

  online: boolean;

  participant: {

    id: string;

    username: string;

    profilePic: string | null;

  };

}



const RecentChats = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; } | null>(null);

  const [selectedChat, setSelectedChat] = useState<RecentChat | null>(null);
  const [loadingChats, setLoadingChats] = useState(false);

  const [search, setSearch] = useState("");

  const [chats, setChats] = useState<RecentChat[]>([]);
  const navigate = useNavigate();


  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isLoading = useAuthStore((state) => state.isLoading);
  const theme = useThemeStore((state) => state.theme);




useEffect(() => {

  const closeContextMenu = () => {
    setContextMenu(null);
    setSelectedChat(null);
  };

  document.addEventListener( "click", closeContextMenu);

  return () => {
     document.removeEventListener(
      "click",
      closeContextMenu
    );
  };

}, []);

  useEffect(() => {

    const handleNewMessage = (data: {
      conversationId: string;
      message: any;
    }) => {

      setChats((prevChats) => {

        return prevChats.map((chat) => {

          if (chat.conversationId === data.conversationId) {

            return {
              ...chat,

              lastMessage: data.message.content,

              updatedAt: data.message.createdAt,

              unreadCount: chat.unreadCount + 1,
            };

          }

          return chat;

        });

      });

    };

    socket.on("new-message", handleNewMessage);
    return () => {
      socket.off("new-message", handleNewMessage);
    };

  }, []);

  useEffect(() => {

    if (!isLoading && !isAuthenticated) {

      navigate("/login");

    }

  }, [isAuthenticated, isLoading, navigate,]);

  useEffect(() => {

    const fetchChats = async () => {

      try {

        setLoadingChats(true);

        const data = await getConversations();
        setChats(data.conversations);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingChats(false);
      }

    };

    fetchChats();

  }, []);
  const handleDeleteChat = async () => {

  if (!selectedChat) {
    return;
  }

  try {

    await deleteConversation(selectedChat.conversationId );

    // Remove it immediately from UI

    setChats((prev) =>
      prev.filter(
        (chat) =>
          chat.conversationId !==
          selectedChat.conversationId
      )
    );

    setContextMenu(null);
    setSelectedChat(null);

  } catch (error) {

    console.error(
      "Failed to delete chat:",
      error
    );

  }
};

  const filteredChats = useMemo(() => {

  return chats.filter((chat) =>
    chat.participant?.username
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

}, [chats, search]);

  if (isLoading || loadingChats) {

    return (

      <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-[#f9f9ff]"}`}>

        <h2 className="text-xl font-semibold text-indigo-600">

          Loading Chats...

        </h2>

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

      <main className={`md:ml-90 min-h-screen ${theme === "dark" ? "bg-slate-950" : "bg-[#f9f9ff]"}`}>

        {/* Header */}
        <header className={`h-16 ${theme === "dark" ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-gray-200"} backdrop-blur-md border-b flex items-center px-4 md:px-8 sticky top-0 z-30`}>

          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-indigo-600 mr-3"
          >
            <IoMenu size={28} />
          </button>

          <h1 className=" font-semibold text-2xl text-indigo-600">
            Recent Chats
          </h1>

        </header>

        {/* Content */}

        <section className="p-4 md:p-8">

          <div className="max-w-3xl mx-auto">

            {/* Search */}

            <div className={`border rounded-xl px-4 py-3 flex items-center gap-3 ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"}`}>

              <IoSearch
                size={22}
                className="text-gray-500"
              />

              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search chats..." className="flex-1 outline-none bg-transparent" />

            </div>

            {/* Chats */}

            <div className="mt-6 space-y-3">


              {filteredChats.map((chat) => (

                <div key={chat.conversationId} onClick={() => navigate(`/chat/${chat.conversationId}`)}
                  className={`border rounded-xl p-4 flex items-center gap-4 ${theme === "dark" ? "bg-slate-900 border-slate-800 hover:bg-slate-800" : "bg-white border-gray-200 hover:bg-indigo-50"} transition cursor-pointer`}
                  onContextMenu={(e) => {
                    e.preventDefault(); setSelectedChat(chat);
                    setContextMenu({
                      x: e.clientX,
                      y: e.clientY,
                    });
                  }} >

                  {/* Avatar */}
                  <div className="relative">

                    <img
                      src={chat.participant.profilePic || "/default-avatar.png"} alt={chat.participant.username} className="w-12 h-12 rounded-full object-cover" />
                    {chat.online && (<span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />)}

                  </div>

                  {/* Info */}

                  <div className="flex-1 min-w-0">

                    <div className="flex justify-between items-center">

                      <h3 className={`font-semibold truncate ${theme === "dark" ? "text-slate-100" : "text-gray-900"}`}>

                        {chat.participant.username}

                      </h3>

                      <span className={`text-xs ${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}>

                        {new Date(chat.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", })}

                      </span>

                    </div>

                    <p className={`text-sm truncate ${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}>

                      {chat.lastMessage}

                    </p>

                  </div>

                  {/* Unread */}

                  {chat.unreadCount > 0 && (<span className="bg-indigo-600 text-white text-xs rounded-full px-2 py-1">{chat.unreadCount} </span>

                  )}

                </div>

              ))}

            </div>

            {/* Empty */}

            {filteredChats.length === 0 && (

              <div className="flex flex-col items-center justify-center mt-20 text-center">

                <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center">

                  <IoChatbubbles
                    size={55}
                    className="text-indigo-600"
                  />

                </div>

                <h3 className="mt-5 text-xl font-semibold">

                  No chats yet

                </h3>

                <p className={`mt-2 ${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}>

                  Start a conversation with someone.

                </p>

              </div>

            )}

          </div>

        </section>

      </main>

      {contextMenu && selectedChat && (
  <div className="fixed z-100 w-44 rounded-xl border bg-white py-1 shadow-lg"
    style={{ left: contextMenu.x, top: contextMenu.y,}}
    onClick={(e) => e.stopPropagation()}>

    <button
      onClick={handleDeleteChat}
      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 "
    >
      Delete Chat
    </button>

  </div>
)}

    </div>
  );
}

export default RecentChats





