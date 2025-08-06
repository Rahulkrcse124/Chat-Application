import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern";
import { login } from "../store/slices/authSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { isLoggingIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* LEFT SIDE */}
      <div className="flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* LOGO & HEADING */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="bg-blue-100 p-3 rounded-lg shadow-sm">
              <MessageSquare className="text-blue-600 w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold mt-4 text-gray-800">
              Welcome Back
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Sign in to your account
            </p>
          </div>

          {/* LOGIN FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="********"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200 flex justify-center items-center gap-2 shadow-sm"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE PATTERN */}
      <AuthImagePattern
        title={"Welcome Back"}
        subtitle={
          "Sign in to continue your conversations and stay connected with your friends."
        }
      />
    </div>
  );
};

export default Login;
