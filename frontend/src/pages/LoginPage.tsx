import React, { useState } from "react";
import { ArrowLeftRight, Eye, MoveRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/authStore";
import { googleLogin, userLogin } from "@/services/auth.service";
import Toastify from "../components/ui/toastify";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);
  
  if (user) {
    navigate("/");
  }

const handleGoogleLogin = useGoogleLogin({

  flow: "auth-code",

  onSuccess: async (codeResponse) => {

    try {
      const response = await googleLogin( codeResponse.code );


      if (response.success) {

        setUser( response.user);

        navigate("/");

      }

    } catch (error) {

      console.error("Google login failed:",error);

    }

  },

  onError: () => {
    console.error("Google Login Failed");

  },

});

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await userLogin(email, password);
      if (response.success) {
        setUser(response.user);
        navigate("/");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error as string || "Login failed");
    }
    setEmail("")
    setPassword("")
  }
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#F9F9FF] flex items-center justify-center px-4 py-3">
        <div className="w-full max-w-md lg:max-w-lg bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center">


            <div className="relative">
              <div className="absolute inset-0 rounded-full border-4 border-[#3525CD]/20 animate-ping"></div>

              <div className="w-16 h-16 rounded-full bg-[#3525CD] flex items-center justify-center animate-spin">
                <ArrowLeftRight size={30} className="text-white" />
              </div>
            </div>

            <h2 className="mt-6 text-2xl font-bold text-[#3525CD]">
              Logging...
            </h2>

            <p className="text-gray-500 mt-2 text-center">
              Please wait while we prepare everything for you.
            </p>


            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-6">
              <div className="h-full w-1/2 bg-[#3525CD] animate-[loading_1.5s_ease-in-out_infinite]"></div>
            </div>


            <div className="w-full mt-8 space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-12 bg-[#3525CD]/20 rounded-lg animate-pulse"></div>
            </div>

          </div>
        </div>
      </div>
    );


  }
  return (
    <>
      <div className="min-h-screen w-full bg-[#F9F9FF] flex items-center justify-center px-4 py-4">

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">


          {/* Header */}

          <div className="flex flex-col items-center text-center mb-6">

            <div className="bg-[#3525CD] text-white p-3 rounded-xl">
              <ArrowLeftRight size={28} strokeWidth={2.5} />
            </div>


            <h1 className="text-[#3525CD] font-bold text-3xl mt-4">
              Welcome Back
            </h1>


            <p className="text-gray-500 mt-2 text-sm">
              Sign in to continue your conversations.
            </p>


          </div>




          {/* Form */}

          <form className="flex flex-col gap-4" onSubmit={(e) => handleLogin(e)}>


            {/* Email */}

            <input
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#3525CD]/20 focus:border-[#3525CD] transition"
              required
            />



            {/* Password */}

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 pr-12 outline-none focus:ring-2 focus:ring-[#3525CD]/20 focus:border-[#3525CD] transition"
                required
              />


              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <Eye size={18} />
              </button>


            </div>





            {/* Forgot */}

            <div className="text-right">

              <Link
                to="/forgot-password"
                className="text-sm text-[#3525CD] hover:underline"
              >
                Forgot Password?
              </Link>

            </div>





            {/* Login Button */}

            <button
              type="submit"
              className="w-full bg-[#3525CD] text-white rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-[#2b1db0] transition font-semibold"
            >

              Login

              <MoveRight size={20} />

            </button>





            {/* Divider */}

            <div className="flex items-center gap-3 my-2">

              <div className="flex-1 h-px bg-gray-300"></div>

              <span className="text-sm text-gray-400">
                OR
              </span>

              <div className="flex-1 h-px bg-gray-300"></div>

            </div>





            {/* Google */}

            <button
              type="button"
              onClick={() => handleGoogleLogin()}
              className="w-full border cursor-pointer border-gray-300 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition"
            >

              <FcGoogle size={22} />

              <span className="font-medium text-gray-700">
                Continue with Google
              </span>


            </button>


          </form>




          {/* Signup */}

          <p className="text-center text-sm text-gray-500 mt-6">

            Don't have an account?

            <Link
              to="/signup"
              className="text-[#3525CD] font-semibold ml-1 hover:underline"
            >
              Sign up
            </Link>


          </p>


        </div>

      </div>
      <Toastify />
    </>
  );
};

export default Login;