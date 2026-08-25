import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import { IoSearch, IoSettings, IoMenu, IoNotifications, IoChatbubbles, IoCall, IoSync, IoPersonAdd, } from "react-icons/io5";

import { searchUsers } from "../services/user.service";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";

interface SearchUser {
    id: string;
    username: string;
    profilePic: string | null;
}

const Dashboard: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search, setsearch] = useState("");
    const [results, setResults] = useState<SearchUser[]>([]);
    const [searching, setSearching] = useState(false);
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isLoading = useAuthStore((state) => state.isLoading);
    const theme = useThemeStore((state) => state.theme);

    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, isLoading, navigate]);

    useEffect(() => {
        if (!search.trim()) {
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setSearching(true);

                const searchedUsers = await searchUsers(search);

                if (searchedUsers) {
                    setResults(searchedUsers);
                } else {
                    setResults([]);
                }
            } catch (err) {
                console.log(err);
                setResults([]);
            } finally {
                setSearching(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    if (isLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-[#f9f9ff]"}`}>
                <h2 className="text-xl font-semibold text-indigo-600">
                    Loading...
                </h2>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-[#f9f9ff] text-gray-900"}`}>
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

            {/* Main */}

            <main className="md:ml-90 min-h-screen flex flex-col">
                {/* Header */}

                <header className={`h-16 ${theme === "dark" ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-gray-200"} backdrop-blur-md border-b flex items-center justify-between px-4 md:px-8 sticky top-0 z-30`}>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden text-indigo-600"
                        >
                            <IoMenu size={28} />
                        </button>

                        <h2 className="text-2xl font-bold text-indigo-600">
                            Discover
                        </h2>
                    </div>

                    {/* Desktop Search */}

                    <div className="hidden sm:block relative w-full max-w-md mx-4">
                        <div className="flex items-center bg-gray-100 border border-gray-300/30 rounded-full px-4 py-1.5 focus-within:ring-2 focus-within:ring-indigo-600/20">
                            <IoSearch size={20} className="text-gray-500 mr-2" />

                            <input
                                id="user-search"
                                value={search}
                                onChange={(e) => setsearch(e.target.value)}
                                type="text"
                                placeholder="Search by username"
                                className={`bg-transparent border-none focus:ring-0 ${theme === "dark" ? "text-slate-100 placeholder:text-slate-400" : "text-gray-900 placeholder:text-gray-500"} w-full py-0.5 outline-none`}
                            />
                        </div>

                        {(search.trim() || searching) && (
                            <div className="absolute mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-h-96 overflow-y-auto z-50">
                                {searching ? (
                                    <div className="p-4 text-center text-gray-500">
                                        Searching...
                                    </div>
                                ) : results.length === 0 ? (
                                    <div className="p-4 text-center text-gray-500">
                                        No users found
                                    </div>
                                ) : (
                                    results.map((u) => (
                                        <button onClick={() => {
                                            navigate(`/chat/user/${u.id}`);
                                            setsearch("");
                                        }}
                                            key={u.id}
                                            className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-100 transition"
                                        >
                                            <img src={u.profilePic || "/default-avatar.png"} alt={u.username} className="w-12 h-12 rounded-full object-cover" />

                                            <div className="flex flex-col items-start text-black">
                                                <span className="font-semibold">
                                                    {u.username}
                                                </span>

                                                <span className="text-sm text-gray-500">
                                                    @{u.username}
                                                </span>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <button className={`p-2 rounded-full ${theme === "dark" ? "hover:bg-slate-800" : "hover:bg-gray-100"}`}>
                            <IoNotifications size={22} />
                        </button>

                        <img
                            src={user?.profile || "/default-avatar.png"}
                            alt="profile"
                            className="w-9 h-9 rounded-full object-cover"
                        />
                    </div>
                </header>
                {/* Dashboard Content */}

                <section className="flex-1 p-5 md:p-10 flex flex-col items-center gap-10">

                    {/* Mobile Search */}

                    <div className="sm:hidden relative w-full max-w-md">

<div className={`flex items-center ${theme === "dark" ? "bg-slate-800 border-slate-700" : "bg-gray-100 border-gray-300/30"} rounded-full px-4 py-1.5 focus-within:ring-2 focus-within:ring-indigo-600/20`}>

                            <IoSearch size={20} className="text-gray-500 mr-2" />

                            <input
                                id="mobile-user-search"
                                type="text"
                                value={search}
                                onChange={(e) => setsearch(e.target.value)}
                                placeholder="Search by username"
                                className="bg-transparent border-none focus:ring-0 text-gray-900 placeholder:text-gray-500 w-full py-0.5 outline-none"
                            />

                        </div>


                        {(search.trim() || searching) && (

                            <div className="absolute mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-h-96 overflow-y-auto z-50">


                                {
                                    searching ? (

                                        <div className="p-4 text-center text-gray-500">
                                            Searching...
                                        </div>

                                    ) : results.length === 0 ? (

                                        <div className="p-4 text-center text-gray-500">
                                            No users found
                                        </div>

                                    ) : (

                                        results.map((u) => (

                                            <button onClick={() => {
                                            navigate(`/chat/user/${u.id}`);
                                            setsearch("");
                                        }}
                                            
                                                key={u.id}
                                                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-100 transition"
                                            >

                                                <img
                                                    src={u.profilePic || "/default-avatar.png"}
                                                    alt={u.username}
                                                    className="w-12 h-12 rounded-full object-cover"
                                                />


                                                <div className="flex flex-col items-start">

                                                    <span className="font-semibold">
                                                        {u.username}
                                                    </span>


                                                    <span className="text-sm text-gray-500">
                                                        @{u.username}
                                                    </span>


                                                </div>


                                            </button>

                                        ))

                                    )
                                }


                            </div>

                        )}


                    </div>



                    {/* Welcome Card */}


                    <div className={`rounded-2xl shadow-sm p-6 md:p-10 w-full max-w-3xl ${theme === "dark" ? "bg-slate-900 border border-slate-800" : "bg-white"}`}>


                        <div className="flex flex-col items-center text-center py-12">


                            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center">

                                <IoChatbubbles
                                    size={50}
                                    className="text-indigo-600"
                                />

                            </div>



                            <h1 className="mt-6 text-3xl font-bold">

                                Welcome, {user?.username || "User"}

                            </h1>



                            <p className={`mt-3 max-w-md ${theme === "dark" ? "text-slate-400" : "text-gray-500"}`}>

                                Your chat dashboard is ready.
                                Search and chat features will be added here.

                            </p>



                        </div>


                    </div>


                </section>



                {/* Floating Add Button */}


                <button
                    className="fixed right-6 bottom-24 md:bottom-8 w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-xl flex items-center justify-center hover:scale-110 transition z-30"
                >

                    <IoPersonAdd size={25} />

                </button>
                {/* Mobile Bottom Navigation */}

                <nav className={`fixed bottom-0 left-0 right-0 h-16 ${theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"} border-t flex justify-around items-center md:hidden z-40`}>


                    <button className="flex flex-col items-center justify-center gap-1 text-xs text-indigo-600">

                        <IoChatbubbles size={22} />

                        <span>
                            Chats
                        </span>

                    </button>



                    <button className="flex flex-col items-center justify-center gap-1 text-xs text-gray-500">

                        <IoCall size={22} />

                        <span>
                            Calls
                        </span>

                    </button>



                    <button className="flex flex-col items-center justify-center gap-1 text-xs text-gray-500">

                        <IoSync size={22} />

                        <span>
                            Status
                        </span>

                    </button>



                    <button className="flex flex-col items-center justify-center gap-1 text-xs text-gray-500">

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


export default Dashboard;