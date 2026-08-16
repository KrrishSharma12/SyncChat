import { logoutUser } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import React from "react";
import { IoSearch, IoChatbubbleEllipses, IoLogOut, IoClose, } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { IoSettings } from "react-icons/io5";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;

}


const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,

}) => {

  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const theme = useThemeStore((state) => state.theme);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await logoutUser();
      if (response.success) {
        logout();
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-screen w-90 ${theme === "dark" ? "bg-slate-900 text-slate-100 shadow-slate-950/50" : "bg-white text-gray-900 shadow-lg"} flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
    >


      {/* Logo */}

      <div className="px-8 py-10 flex items-center justify-between">

        <h1 className="text-4xl font-bold text-indigo-600">
          SyncChat
        </h1>


        <button
          onClick={() => setSidebarOpen(false)}
          className={`md:hidden ${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}
        >
          <IoClose size={25} />
        </button>

      </div>




      {/* Profile */}

      <div className="px-6 mb-8  flex items-center gap-4">

        <div className="relative">

          <img
            src={user?.profile || "/default-avatar.png"}
            alt="profile"
            className="w-12 h-12 rounded-full object-cover"
          />


          <span className={`absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 ${theme === "dark" ? "border-slate-900" : "border-white"} rounded-full`} />

        </div>



        <div>

          <h3 className={`font-semibold ${theme === "dark" ? "text-slate-100" : "text-gray-900"}`}>
            {user?.username || "User"}
          </h3>


          <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}>
            {user?.email}
          </p>

        </div>

      </div>





      {/* Navigation */}

      <nav className="flex-1 px-3 space-y-2">


        {/* Discover */}

        <button
          onClick={() => navigate("/")}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition ${isActive("/")
            ? "bg-indigo-600 text-white shadow-md"
            : theme === "dark"
              ? "text-slate-300 hover:bg-slate-800"
              : "text-gray-600 hover:bg-gray-100"
            }`}
        >

          <IoSearch size={22} />

          <span className="font-medium">
            Discover
          </span>

        </button>





        {/* Recent Chats */}

        <button
          onClick={() => navigate("/recents")}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition ${isActive("/recents")
            ? "bg-indigo-600 text-white shadow-md"
            : theme === "dark"
              ? "text-slate-300 hover:bg-slate-800"
              : "text-gray-600 hover:bg-gray-100"
            }`}
        >

          <IoChatbubbleEllipses size={22} />

          <span className="font-medium">
            Recent Chats
          </span>

        </button>
        <button
          onClick={() => navigate(`/settings/${user?.id}`)}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition ${isActive(`/settings/${user?.id}`)
            ? "bg-indigo-600 text-white shadow-md"
            : theme === "dark"
              ? "text-slate-300 hover:bg-slate-800"
              : "text-gray-600 hover:bg-gray-100"
            }`}
        >
          <IoSettings size={22} />

          <span className="font-medium">
            Settings
          </span>

        </button>
      </nav>





      {/* Logout */}

      <div className="px-3 pb-6">

        <button
          onClick={(e) => {
            handleLogout(e);

          }}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition ${theme === "dark" ? "text-red-400 hover:bg-red-950/40" : "text-red-600 hover:bg-red-50"}`}
        >

          <IoLogOut
            size={22}
            className="rotate-180"
          />


          <span className="font-medium">
            Logout
          </span>

        </button>

      </div>


    </aside>
  );
};


export default Sidebar;