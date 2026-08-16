import SignUp from './pages/SignUp'
import LoginPage from './pages/LoginPage'
import { BrowserRouter, Route, Routes } from 'react-router'
import VerifyEmail from './pages/VerifyEmail'
import DashboardPage from './pages/DashboardPage'
import ChatPage from './pages/ChatPage'
import RecentChats from './pages/RecentChats'
import { useAuthStore } from './store/authStore'
import { getCurrentUser } from './services/auth.service'
import { useEffect } from 'react'
import {socket} from './socket/socket'
import Setting from './pages/Setting'
import NotFound from './pages/NotFound'
const App = () => {
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const logout = useAuthStore((state) => state.logout);
  const setLoading = useAuthStore((state) => state.setIsLoading);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);

        const response = await getCurrentUser();

        if (response?.user) {
          setCurrentUser(response.user);
          socket.emit("setup", response.user.id);
        } else {
          logout();
        }
      } catch (error) {
        console.error("Failed to load current user:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [setCurrentUser, logout, setLoading]);

  if (useAuthStore.getState().isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9ff]">
        <h2 className="text-xl font-semibold text-indigo-600">
          Loading...
        </h2>
      </div>
    );
  }

  return (

    <BrowserRouter>
      <Routes>
        <Route path="*"element={<NotFound />}/>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/" element={<DashboardPage />} />
        <Route path="/recents" element={<RecentChats />} />
        <Route path="/chat/:conversationId" element={<ChatPage />} />
        <Route path="/chat/user/:receiverId" element={<ChatPage />} />
        <Route path="/settings/:userId" element={<Setting />} />
      </Routes>
    </BrowserRouter>
  )
}


export default App
