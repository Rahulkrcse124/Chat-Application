import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../store/slices/authSlice"; // ✅ make sure this exists
import { Link } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const { isSigninUp } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signup(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <MessageSquare className="w-6 h-6" /> Sign Up
        </h2>

        {/* Full Name */}
        <div className="mb-4 relative">
          <User className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="pl-10 pr-4 py-2 w-full border rounded focus:outline-none focus:ring"
          />
        </div>

        {/* Email */}
        <div className="mb-4 relative">
          <Mail className="absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="pl-10 pr-4 py-2 w-full border rounded focus:outline-none focus:ring"
          />
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <Lock className="absolute left-3 top-3 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="pl-10 pr-10 py-2 w-full border rounded focus:outline-none focus:ring"
          />
          <span
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSigninUp}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isSigninUp ? (
            <span className="flex justify-center items-center gap-2">
              <Loader2 className="animate-spin" size={18} /> Signing Up...
            </span>
          ) : (
            "Register"
          )}
        </button>

        {/* Login Redirect */}
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
