import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Field, FieldLabel } from "@/components/ui/field";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ArrowLeftRight, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { verifyEmail } from "@/services/auth.service";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Toastify from "../components/ui/toastify";
import { useAuthStore } from "@/store/authStore";


const VerifyEmail = () => {
  const [otp, setotp] = useState<string>();
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();
  const isLoading = useAuthStore((state) => state.isLoading);
  const setIsAuthenticated=useAuthStore((state)=>state.setIsAuthenticated);



  if (!email) {
    navigate("/login");
    return null;
  }

  
  const handleClick = async () => {
    try {
      const response = await verifyEmail(email, otp!);
      if (response.success) {
        setIsAuthenticated(true);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error as string || "Verification failed");

    }


  }
  return (
    <>
      <Toastify />
      <div className="min-h-screen w-full bg-[#F9F9FF] flex justify-center items-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6">

          {/* Logo & Heading */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-[#3525CD] text-white p-4 rounded-2xl shadow-md">
              <ArrowLeftRight size={30} strokeWidth={2.5} />
            </div>

            <h1 className="text-[#3525CD] font-bold text-3xl mt-4">
              Verify Email
            </h1>

            <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-xs">
              Enter the 6-digit verification code sent to {email}.
            </p>
          </div>


          {/* OTP Input */}

          <Field className="w-full flex flex-col items-center">
            <FieldLabel
              htmlFor="digits-only"
              className="mb-3 text-gray-700 font-medium"
            >
              Enter verification code
            </FieldLabel>

            <InputOTP
              id="digits-only"
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={otp}
              onChange={(val) => setotp(val)}

            >
              <InputOTPGroup className="gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="
                    w-12 h-12 sm:w-14 sm:h-14
                    rounded-lg
                    border-2
                    border-gray-300
                    text-lg
                    font-semibold
                    focus:border-[#3525CD]
                    focus:ring-2
                    focus:ring-[#3525CD]/20
                  "
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </Field>


          {/* Verify Button */}
          <button onClick={handleClick}
            className={`w-full bg-[#3525CD] text-white py-3 rounded-xlfont-semibold hover:bg-[#2c1fb0] transition duration-200 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}

            disabled={otp?.length !== 6 || isLoading}`}>
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>


          {/* Back */}

          <Link to="/login">


            <button
              className="
            flex
            items-center
            gap-2
            text-sm
            text-gray-500
            hover:text-[#3525CD]
            transition
          "
            >
              <ArrowLeft size={16} />
              Back to Login
            </button>
          </Link>

        </div>
      </div >
    </>
  );
};

export default VerifyEmail;