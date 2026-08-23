import { useNavigate } from "react-router-dom";
import { IoArrowBack, IoHomeOutline } from "react-icons/io5";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="text-center max-w-md">
        {/* 404 */}
        <h1 className="text-8xl md:text-9xl font-extrabold text-indigo-600 tracking-tight">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl md:text-3xl font-bold text-slate-900">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-3 text-slate-500 leading-relaxed">
          Sorry, the page you're looking for doesn't exist or may have been
          moved.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-100 transition"
          >
            <IoArrowBack size={20} />
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            <IoHomeOutline size={20} />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;