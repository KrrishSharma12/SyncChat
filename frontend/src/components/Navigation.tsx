import { logoutUser } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { IoLogOut, IoSearchSharp, IoChatbubbles, IoSettings } from "react-icons/io5"
import { useNavigate, useLocation } from "react-router-dom";
const Navigation = () => {
    const theme = useThemeStore((state) => state.theme);
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path: string) => {
        return location.pathname === path;
    };
    return (
        <div>
            <nav className={`fixed bottom-0 left-0 right-0 h-16 ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"} border-t flex justify-around items-center md:hidden z-40`}>


                <button className={`flex flex-col items-center justify-center gap-1 text-xs  ${isActive("/")
                    ? "text-indigo-600 "
                    : theme === "dark"
                        ? "text-slate-300 hover:bg-slate-800"
                        : "text-gray-600 hover:bg-gray-100"
                    }`} onClick={() => navigate("/")}>

                    <IoSearchSharp size={22} />

                    <span>
                        Discover
                    </span>

                </button>
                <button className={`flex flex-col items-center justify-center gap-1 text-xs  ${isActive("/recents")
                    ? "text-indigo-600 "
                    : theme === "dark"
                        ? "text-slate-300 hover:bg-slate-800"
                        : "text-gray-600 hover:bg-gray-100"
                    }`} onClick={() => navigate("/recents")}>

                    <IoChatbubbles size={22} />

                    <span>
                        Chats
                    </span>

                </button>



                {/* <button className="flex flex-col items-center justify-center gap-1 text-xs text-gray-500">

                    <IoCall size={22} />

                    <span>
                        Calls
                    </span>

                </button> */}


                <button className={`flex flex-col items-center justify-center gap-1 text-xs  ${isActive(`/settings/${user?.id}`)
                    ? "text-indigo-600"
                    : theme === "dark"
                        ? "text-slate-300 hover:bg-slate-800"
                        : "text-gray-600 hover:bg-gray-100"
                    }`} onClick={() => navigate(`/settings/${user?.id}`)}>

                    <IoSettings size={22} />

                    <span>
                        Settings
                    </span>

                </button>
                <button className={`flex flex-col items-center justify-center gap-1  text-xs text-red-700
                     theme === "dark"
                        ? "text-slate-300 hover:bg-slate-800"
                        : "text-gray-600 hover:bg-gray-100"
                    }`} onClick={async () => {
                        const confirmLogout = window.confirm("Are you sure you want to logout?");
                        if (confirmLogout) {
                            try {
                                const response = await logoutUser();
                                if (response.success) {
                                    useAuthStore.getState().logout();
                                    navigate("/login");
                                }
                            } catch (error) {
                                console.error("Logout failed:", error);
                            }
                        }
                    }}>

                    <IoLogOut size={22} />

                    <span>
                        Logout
                    </span>

                </button>




            </nav>

        </div>
    )
}

export default Navigation
