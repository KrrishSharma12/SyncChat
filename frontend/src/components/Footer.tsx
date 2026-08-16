import React from "react";
import {
  IoLogoGithub,
  IoLogoLinkedin,
  IoMail,
} from "react-icons/io5";

import { useThemeStore } from "../store/themeStore";

const Footer: React.FC = () => {
  const theme = useThemeStore((state) => state.theme);

  const isDark = theme === "dark";

  return (
    <footer className={`w-full border-t transition-colors sm:ml-25 mt-10  duration-300 ${
        isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200 "
      }`}
    >

      <div className="w-full max-w-4xl mx-auto px-6 sm:px-10 py-4 ">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-indigo-600">
              SyncChat
            </h2>
            <p
              className={`mt-1 text-xs ${ isDark? "text-slate-400": "text-gray-500"}`}>
              Simple, fast and secure real-time communication.
            </p>
          </div>


          <div className="flex-1 text-center">

            <p
              className={`text-xs ${
                isDark
                  ? "text-slate-400"
                  : "text-gray-500"
              }`}
            >
              Built with ❤️ by
            </p>

            <p className="text-sm font-semibold text-indigo-600 mt-1">
              Krish Sharma
            </p>

            <p
              className={`text-[11px] mt-0.5 ${
                isDark
                  ? "text-slate-500"
                  : "text-gray-400"
              }`}
            >
              Full Stack Developer
            </p>

          </div>


          {/* Connect */}
          <div className="flex-1 flex flex-col items-center sm:items-end">

            <p
              className={`text-sm font-semibold ${
                isDark
                  ? "text-slate-200"
                  : "text-gray-800"
              }`}
            >
              Connect With Me
            </p>

            <div className="flex items-center gap-3 mt-2">

              {/* GitHub */}
              <a
                href="#"
                aria-label="GitHub"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                  isDark
                    ? "bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600"
                }`}
              >
                <IoLogoGithub size={16} />
              </a>


              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                  isDark
                    ? "bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600"
                }`}
              >
                <IoLogoLinkedin size={16} />
              </a>


              {/* Email */}
              <a
                href="mailto:example@gmail.com"
                aria-label="Email"
                className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                  isDark
                    ? "bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600"
                }`}
              >
                <IoMail size={16} />
              </a>

            </div>

          </div>

        </div>


        {/* Bottom Divider */}
        <div
          className={`border-t mt-3 pt-2 flex flex-col sm:flex-row items-center justify-between gap-1 ${
            isDark
              ? "border-slate-800"
              : "border-gray-200"
          }`}
        >

          <p
            className={`text-[11px] ${
              isDark
                ? "text-slate-500"
                : "text-gray-500"
            }`}
          >
            © {new Date().getFullYear()} SyncChat
          </p>

          <p
            className={`text-[11px] ${
              isDark
                ? "text-slate-500"
                : "text-gray-500"
            }`}
          >
            Made for seamless conversations
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;