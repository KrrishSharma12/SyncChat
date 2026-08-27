import React, { useRef, useState } from "react";
import {IoCamera, IoChevronDown, IoChevronForward,IoLockClosed, IoMoon, IoPerson, IoSunny,} from "react-icons/io5";
import axios from "axios";
import Navigation from "../components/Navigation";
import Sidebar from "../components/SideBar";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import Footer from "@/components/Footer";
import { updateProfile, changePassword,} from "@/services/user.service";
import { ToastContainer } from "react-toastify";


type PanelType =
  | "username"
  | "password"
  | null;


const Setting = () => {

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [activePanel, setActivePanel] =
    useState<PanelType>(null);

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [avatarPreview, setAvatarPreview] =
    useState<string | null>(null);

  // const [avatarFile, setAvatarFile] =
  //   useState<File | null>(null);


  const fileInputRef =
    useRef<HTMLInputElement>(null);


  const user =
    useAuthStore((state) => state.user);

  const setCurrentUser =
    useAuthStore((state) => state.setCurrentUser);


  const theme =
    useThemeStore((state) => state.theme);

  const toggleTheme =
    useThemeStore((state) => state.toggleTheme);


  const initialUsername =
    user?.username || "";

  const initialAvatar =
    user?.profile || null;




  if (
    username === "" &&
    initialUsername
  ) {
    setUsername(initialUsername);
  }


  // -----------------------------
  // Set initial avatar
  // -----------------------------

  if (
    !avatarPreview &&
    initialAvatar
  ) {
    setAvatarPreview(initialAvatar);
  }




  // const saveAvatar = async () => {

  //   if (!avatarFile) {
  //     return;
  //   }


  //   try {

  //     const response =
  //       await updateProfile({
  //         profilePic: avatarFile,
  //       });


  //     setCurrentUser(
  //       response.user
  //     );


  //     setAvatarFile(null);


  //     setMessage(
  //       "Profile picture updated successfully."
  //     );


  //   } catch (error: any) {

  //     console.error(error);


  //     setMessage(
  //       error?.response?.data?.message ||
  //       "Failed to update profile picture."
  //     );

  //   }

  // };


  // Select Avatar


  const handleAvatarUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      event.target.files?.[0];


    if (!file) {
      return;
    }


    // Check image type

    if (
      !file.type.startsWith("image/")
    ) {

      setMessage(
        "Please select an image file."
      );

      return;
    }


    // Check image size

    if (
      file.size > 5 * 1024 * 1024
    ) {

      setMessage(
        "Image must be smaller than 5MB."
      );

      return;
    }




    // Preview only

    const previewUrl =
      URL.createObjectURL(file);


    setAvatarPreview(
      previewUrl
    );

  };


  // -----------------------------
  // Save Username / Password
  // -----------------------------

  const handleSave = async (
    type: Exclude<
      PanelType,
      null
    >
  ) => {

    if (!user) {
      return;
    }


    // =================================
    // USERNAME
    // =================================

    if (
      type === "username"
    ) {

      if (!username.trim()) {

        setMessage(
          "Username cannot be empty."
        );

        return;
      }


      try {

        const response =
          await updateProfile({

            username:
              username.trim(),

          });


        setCurrentUser(
          response.user
        );


        setMessage(
          "Username updated successfully."
        );


        setActivePanel(
          null
        );


      } catch (error: unknown) {
        console.error(
          "Password update failed:",
          error
        );

        if (axios.isAxiosError(error)) {
          setMessage(
            error.response?.data?.message ||
            "Failed to update password."
          );
        } else {
          setMessage("Failed to update password.");
        }
      }

    }


    // =================================
    // PASSWORD
    // =================================

    if (
      type === "password"
    ) {

      if (!currentPassword) {

        setMessage(
          "Current password is required."
        );

        return;
      }


      if (
        password.length < 6
      ) {

        setMessage(
          "Password must be at least 6 characters."
        );

        return;
      }


      if (
        password !== confirmPassword
      ) {

        setMessage(
          "Passwords do not match."
        );

        return;
      }


      try {

        await changePassword({

          currentPassword,

          newPassword:
            password,

        });


        setCurrentPassword(
          ""
        );

        setPassword(
          ""
        );

        setConfirmPassword(
          ""
        );


        setMessage(
          "Password updated successfully."
        );


        setActivePanel(
          null
        );


      } catch (error: unknown) {
        console.error(
          "Password update failed:",
          error
        );

        if (axios.isAxiosError(error)) {
          setMessage(
            error.response?.data?.message ||
            "Failed to update password."
          );
        } else {
          setMessage("Failed to update password.");
        }
      }

    }

  };


  return (

    <>

      <div
        className={`
          min-h-screen
          overflow-x-hidden

          ${theme === "dark"
            ? "bg-slate-950 text-zinc-100"
            : "bg-[#f9f9ff] text-gray-900"
          }
        `}
      >

        {/* =========================
            MOBILE SIDEBAR OVERLAY
        ========================== */}

        {sidebarOpen && (

          <div
            onClick={() =>
              setSidebarOpen(false)
            }

            className="
              fixed
              inset-0
              z-40
              bg-slate-900/40
              md:hidden
            "
          />

        )}


        {/* =========================
            SIDEBAR
        ========================== */}

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />


        {/* =========================
            MAIN
        ========================== */}

        <main
          className="
            min-h-screen
            px-3
            py-4
            sm:px-4
            sm:py-6
            md:ml-90
            md:px-8
            md:py-8
            lg:px-12
          "
        >

          <div
            className={`
              mx-auto
              w-full
              max-w-5xl
              rounded-2xl
              border
              p-4
              shadow-sm
              backdrop-blur

              sm:rounded-3xl
              sm:p-6

              md:p-8

              ${theme === "dark"
                ? "border-slate-800 bg-slate-900/95"
                : "border-gray-200 bg-white/90"
              }
            `}
          >

            {/* =========================
                PROFILE HEADER
            ========================== */}

            <div
              className="
                flex
                flex-col
                gap-5

                sm:gap-6

                md:flex-row
                md:items-center
                md:justify-between
              "
            >

              {/* Profile */}

              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-3

                  sm:gap-4
                "
              >

                {/* Avatar */}

                <div
                  className="
                    group
                    relative
                    shrink-0
                  "
                >

                  <img
                    src={
                      avatarPreview ||
                      "/default-avatar.png"
                    }

                    alt="Profile"

                    className="
                      h-16
                      w-16
                      rounded-full
                      object-cover
                      ring-4
                      ring-indigo-100

                      sm:h-20
                      sm:w-20

                      md:h-24
                      md:w-24
                    "
                  />


                  {/* Camera button */}

                  <button
                    type="button"

                    onClick={() =>
                      fileInputRef.current?.click()
                    }

                    className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      rounded-full
                      bg-slate-900/50
                      text-white
                      opacity-100
                      transition

                      md:opacity-0
                      md:group-hover:opacity-100
                    "
                  >

                    <IoCamera
                      className="
                        text-lg
                        sm:text-xl
                      "
                    />

                  </button>


                  {/* File input */}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={
                      handleAvatarUpload
                    }
                  />

                </div>


                {/* User information */}

                <div className="min-w-0">

                  <h1
                    className="
                      truncate
                      text-xl
                      font-semibold

                      sm:text-2xl
                    "
                  >
                    {
                      user?.username ||
                      "Your Profile"
                    }
                  </h1>


                  <p
                    className="
                      mt-1
                      truncate
                      text-xs
                      text-gray-500

                      sm:text-sm
                    "
                  >
                    {
                      user?.email ||
                      "Update your account details here"
                    }
                  </p>

                </div>

              </div>


              {/* =========================
                  THEME BUTTON
              ========================== */}

              <button
                type="button"

                onClick={() =>
                  toggleTheme()
                }

                className={`
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  px-4
                  py-2
                  text-sm
                  font-medium
                  transition

                  sm:w-fit

                  ${theme === "dark"
                    ? "bg-slate-800 text-white hover:bg-slate-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >

                {
                  theme === "dark" ? (

                    <IoMoon size={18} />

                  ) : (

                    <IoSunny size={18} />

                  )
                }


                {
                  theme === "dark"
                    ? "Dark mode on"
                    : "Dark mode off"
                }

              </button>

            </div>


            {/* =========================
                MESSAGE
            ========================== */}

            {message && (

              <div
                className="
                  mt-5
                  rounded-2xl
                  border
                  border-indigo-200
                  bg-indigo-50
                  px-3
                  py-3
                  text-xs
                  text-indigo-700

                  sm:mt-6
                  sm:px-4
                  sm:text-sm
                "
              >

                {message}

              </div>

            )}


            {/* =========================
                SETTINGS
            ========================== */}

            <section
              className="
                mt-6
                space-y-3

                sm:mt-8
              "
            >

              {/* =================================
                  USERNAME
              ================================== */}

              <div
                className={`
                  flex
                  cursor-pointer
                  items-center
                  justify-between
                  gap-3
                  rounded-2xl
                  border
                  px-3
                  py-3.5
                  transition

                  sm:px-4
                  sm:py-4

                  ${theme === "dark"
                    ? "border-zinc-800 bg-slate-900"
                    : "border-gray-200 bg-gray-50"
                  }
                `}

                onClick={() =>
                  setActivePanel(
                    activePanel === "username"
                      ? null
                      : "username"
                  )
                }
              >

                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                  "
                >

                  <div
                    className={`
                      shrink-0
                      rounded-xl
                      p-2

                      ${theme === "dark"
                        ? "bg-zinc-950"
                        : "bg-white"
                      }
                    `}
                  >

                    <IoPerson
                      size={18}
                    />

                  </div>


                  <div
                    className="min-w-0"
                  >

                    <p
                      className="
                        truncate
                        text-sm
                        font-medium

                        sm:text-base
                      "
                    >
                      Change Username
                    </p>


                    <p
                      className="
                        truncate
                        text-xs
                        text-gray-500

                        sm:text-sm
                      "
                    >
                      Update how your name appears on the app
                    </p>

                  </div>

                </div>


                <div
                  className="shrink-0"
                >

                  {
                    activePanel === "username"
                      ? (
                        <IoChevronDown
                          size={20}
                        />
                      )
                      : (
                        <IoChevronForward
                          size={20}
                        />
                      )
                  }

                </div>

              </div>


              {/* =================================
                  USERNAME PANEL
              ================================== */}

              {
                activePanel === "username" && (

                  <div
                    className={`
                      rounded-2xl
                      border
                      px-3
                      py-4

                      sm:px-4

                      ${theme === "dark"
                        ? "border-zinc-800 bg-slate-900"
                        : "border-gray-200 bg-white"
                      }
                    `}
                  >

                    <label
                      className="
                        mb-2
                        block
                        text-sm
                        font-medium
                      "
                    >
                      New Username
                    </label>


                    <input
                      value={username}

                      onChange={(e) =>
                        setUsername(
                          e.target.value
                        )
                      }

                      placeholder="Enter new username"

                      className={`
                        w-full
                        rounded-xl
                        border
                        px-3
                        py-2.5
                        text-sm
                        outline-none

                        focus:border-indigo-500
                        focus:ring-2
                        focus:ring-indigo-500/20

                        ${theme === "dark"
                          ? "border-zinc-700 bg-zinc-950 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                        }
                      `}
                    />


                    <div
                      className="
                        mt-4
                        flex
                        flex-col
                        gap-2

                        sm:flex-row
                        sm:gap-3
                      "
                    >

                      <button
                        type="button"

                        onClick={() =>
                          handleSave(
                            "username"
                          )
                        }

                        className="
                          w-full
                          rounded-xl
                          bg-indigo-600
                          px-4
                          py-2.5
                          text-sm
                          font-medium
                          text-white

                          sm:w-auto
                        "
                      >
                        Save Username
                      </button>


                      <button
                        type="button"

                        onClick={() =>
                          setActivePanel(null)
                        }

                        className={`
                          w-full
                          rounded-xl
                          px-4
                          py-2.5
                          text-sm
                          font-medium

                          sm:w-auto

                          ${theme === "dark"
                            ? "bg-slate-800 text-zinc-200"
                            : "bg-gray-100 text-gray-700"
                          }
                        `}
                      >
                        Cancel
                      </button>

                    </div>

                  </div>

                )
              }


              {/* =================================
                  PASSWORD
              ================================== */}

              <div
                className={`
                  flex
                  cursor-pointer
                  items-center
                  justify-between
                  gap-3
                  rounded-2xl
                  border
                  px-3
                  py-3.5
                  transition

                  sm:px-4
                  sm:py-4

                  ${theme === "dark"
                    ? "border-zinc-800 bg-slate-900"
                    : "border-gray-200 bg-gray-50"
                  }
                `}

                onClick={() =>
                  setActivePanel(
                    activePanel === "password"
                      ? null
                      : "password"
                  )
                }
              >

                <div
                  className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                  "
                >

                  <div
                    className={`
                      shrink-0
                      rounded-xl
                      p-2

                      ${theme === "dark"
                        ? "bg-zinc-950"
                        : "bg-white"
                      }
                    `}
                  >

                    <IoLockClosed
                      size={18}
                    />

                  </div>


                  <div
                    className="min-w-0"
                  >

                    <p
                      className="
                        truncate
                        text-sm
                        font-medium

                        sm:text-base
                      "
                    >
                      Change Password
                    </p>


                    <p
                      className="
                        truncate
                        text-xs
                        text-gray-500

                        sm:text-sm
                      "
                    >
                      Set a new password for your account
                    </p>

                  </div>

                </div>


                <div
                  className="shrink-0"
                >

                  {
                    activePanel === "password"
                      ? (
                        <IoChevronDown
                          size={20}
                        />
                      )
                      : (
                        <IoChevronForward
                          size={20}
                        />
                      )
                  }

                </div>

              </div>


              {/* =================================
                  PASSWORD PANEL
              ================================== */}

              {
                activePanel === "password" && (

                  <div
                    className={`
                      rounded-2xl
                      border
                      px-3
                      py-4

                      sm:px-4

                      ${theme === "dark"
                        ? "border-zinc-800 bg-slate-900"
                        : "border-gray-200 bg-white"
                      }
                    `}
                  >

                    {/* Current Password */}

                    <label
                      className="
                        mb-2
                        block
                        text-sm
                        font-medium
                      "
                    >
                      Current Password
                    </label>


                    <input
                      type="password"

                      value={
                        currentPassword
                      }

                      onChange={(e) =>
                        setCurrentPassword(
                          e.target.value
                        )
                      }

                      placeholder="Enter current password"

                      className={`
                        w-full
                        rounded-xl
                        border
                        px-3
                        py-2.5
                        text-sm
                        outline-none

                        focus:border-indigo-500
                        focus:ring-2
                        focus:ring-indigo-500/20

                        ${theme === "dark"
                          ? "border-zinc-700 bg-zinc-950 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                        }
                      `}
                    />


                    {/* New Password */}

                    <label
                      className="
                        mb-2
                        mt-2
                        block
                        text-sm
                        font-medium
                      "
                    >
                      New Password
                    </label>


                    <input
                      type="password"

                      value={password}

                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }

                      placeholder="Enter new password"

                      className={`
                        w-full
                        rounded-xl
                        border
                        px-3
                        py-2.5
                        text-sm
                        outline-none

                        focus:border-indigo-500
                        focus:ring-2
                        focus:ring-indigo-500/20

                        ${theme === "dark"
                          ? "border-zinc-700 bg-zinc-950 text-white"
                          : "border-gray-300 bg-white text-gray-900"
                        }
                      `}
                    />


                    {/* Confirm Password */}

                    <label
                      className="
                        mb-2
                        mt-3
                        block
                        text-sm
                        font-medium
                      "
                    >
                      Confirm Password
                    </label>


                    <input
                      type="password"

                      value={
                        confirmPassword
                      }

                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }

                      placeholder="Confirm password"

                      className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
${theme === "dark" ? "border-zinc-700 bg-zinc-950 text-white" : "border-gray-300 bg-white text-gray-900"}
                      `}
                    />
                    {/* Buttons */}

                    <div
                      className="
                        mt-4
                        flex
                        flex-col
                        gap-2

                        sm:flex-row
                        sm:gap-3
                      "
                    >

                      <button
                        type="button"

                        onClick={() =>
                          handleSave(
                            "password"
                          )
                        }

                        className="
                          w-full
                          rounded-xl
                          bg-indigo-600
                          px-4
                          py-2.5
                          text-sm
                          font-medium
                          text-white

                          sm:w-auto
                        "
                      >
                        Save Password
                      </button>


                      <button
                        type="button"

                        onClick={() =>
                          setActivePanel(null)
                        }

                        className={`
                          w-full
                          rounded-xl
                          px-4
                          py-2.5
                          text-sm
                          font-medium

                          sm:w-auto

                          ${theme === "dark"
                            ? "bg-slate-800 text-zinc-200"
                            : "bg-gray-100 text-gray-700"
                          }
                        `}
                      >
                        Cancel
                      </button>

                    </div>

                  </div>

                )
              }

            </section>

          </div>

        </main>



        <Footer />
        <Navigation />

      </div>


      <ToastContainer />

    </>

  );

};


export default Setting;