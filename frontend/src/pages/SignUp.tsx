import React, { useEffect, useState } from "react";
import { ArrowLeftRight, Pen, MoveRight } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { userSignup } from "../services/auth.service";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Toastify from "../components/ui/toastify";
import { useAuthStore } from "@/store/authStore";

const SignUp = () => {
  const [privacy, setprivacy] = useState<boolean>(false)
  const [username, setusername] = useState<string>("")
  const [email, setemail] = useState<string>("")
  const [password, setpassword] = useState<string>("")
  const [profileUrl, setprofileUrl] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/");
    }
  }, [isLoading, user, navigate]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

     if (!usernameRegex.test(username.trim())) {
      toast.error("Username must be 3-20 characters and contain only letters, numbers, _ or -");
      return;
    }

    // Email validation
    if (!emailRegex.test(email.trim())) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!profileUrl) {
      toast.error("Please upload your profile image");
      return;
    }

    try {
      const response = await userSignup( username,email,password,profileUrl);
      if (response.success) {
        toast.success(response.message);
       
        navigate("/verify-email", { state: { email: response.email } });
      } else {
        toast.error(response.message);
      }

      URL.revokeObjectURL(preview);

      setPreview("");
      setprofileUrl(null);
      setusername("");
      setemail("");
      setpassword("");
      setprivacy(false);

    } catch (error: any) {
      const message = error?.response?.data?.message || "Signup failed";
      toast.error(message);
      console.log(error);
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];


    if (file && file.type.startsWith("image/")) {
      setprofileUrl(file);
      setPreview(URL.createObjectURL(file));
    }
    else toast.error("Please select a valid image file");

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
              Creating your account...
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
      <Toastify />
      <div className="min-h-screen w-full bg-[#F9F9FF] flex items-center justify-center px-4 py-3">
        <div className="w-full max-w-md lg:max-w-lg bg-white rounded-2xl shadow-xl p-5 sm:p-7">

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-5">
            <div className="bg-[#3525CD] text-white p-3 rounded-xl">
              <ArrowLeftRight size={28} strokeWidth={2.5} />
            </div>

            <h1 className="text-[#3525CD] font-bold text-3xl mt-3">
              Join SyncChat
            </h1>

            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Experience seamless communication in a clear, modern workspace.
            </p>
          </div>


          <form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e)} autoComplete="off" autoCorrect="off" spellCheck="false">

            {/* Profile Image */}
            <div className="flex justify-center">
              <div className="relative">

                <input
                  type="file"
                  id="profile"
                  className="hidden"
                  name="profile"
                  onChange={handleFileChange}

                />

                <label htmlFor="profile">
                  <img
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-dashed border-gray-300 object-cover cursor-pointer"
                    src={preview || "https://imgs.search.brave.com/MkbMbAavVgS79-WnRDMN86Nfwlx0KCp_trd_3Z7ZF8c/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvcHJldmll/dy0xeC8yNi80MC9w/cm9maWxlLXBsYWNl/aG9sZGVyLWltYWdl/LWdyYXktc2lsaG91/ZXR0ZS12ZWN0b3It/MjIxMjI2NDAuanBn"}
                  />
                </label>


                <label
                  htmlFor="profile"
                  className="absolute bottom-0 right-0 bg-[#3525CD] text-white p-2 rounded-full cursor-pointer"
                >
                  <Pen size={16} strokeWidth={2} />
                </label>

              </div>
            </div>


            {/* Inputs */}
            <div className="flex flex-col gap-3">

              <input
                type="text"
                onChange={(e) => setusername(e.target.value)}
                placeholder="Enter your Username"
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#3525CD]"
                required
                name="username"
                value={username}
              />

              <input
                type="email"
                onChange={(e) => setemail(e.target.value)}
                placeholder="Enter your Email"
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#3525CD]"
                required
                name="email"
                value={email}
              />


              <input
                type="password"
                onChange={(e) => setpassword(e.target.value)}
                placeholder="Enter your Password"
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-[#3525CD]"
                required
                name="password"
                value={password}
              />

            </div>

            <div className="flex items-start gap-2 text-sm text-gray-600">
              <input
                id="check-box"
                type="checkbox"
                checked={privacy}
                onChange={(e) => setprivacy(e.target.checked)
                }
                className="mt-1 cursor-pointer"
              />

              <label htmlFor="check-box">
                I agree to the{" "}
                <a href="#" className="text-[#3525CD] hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#3525CD] hover:underline">
                  Privacy Policy
                </a>
                .
              </label>
            </div>



            {/* Create Account */}
            <button
              type="submit" disabled={!privacy}

              className={`w-full bg-[#3525CD] active:scale-[0.99] text-white cursor-pointer rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-[#2b1db0] transition  ${privacy ? "" : "opacity-50 cursor-not-allowed"}`}
            >
              Create Account
              <MoveRight size={20} />
            </button>



            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-300"></div>

              <span className="text-sm text-gray-500">
                OR
              </span>

              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Sign In */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/"

                className="text-[#3525CD] font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>


          </form>

        </div>

      </div>
    </>
  );
};

export default SignUp;


