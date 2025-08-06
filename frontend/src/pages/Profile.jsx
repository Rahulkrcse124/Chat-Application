import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Camera, Loader2, Mail, User } from "lucide-react";
import { updateProfile } from "../store/slices/authSlice"; // adjust path as needed

const Profile = () => {
  const dispatch = useDispatch();
  const { authUser, isUpdatingProfile } = useSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    email: authUser?.email || "",
    avatar: authUser?.avatar?.url || null,
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSelectedImage(reader.result);
      setFormData({ ...formData, avatar: file });
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = () => {
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    if (formData.avatar instanceof File) {
      data.append("avatar", formData.avatar);
    }

    dispatch(updateProfile(data));
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-xl rounded-xl p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
        <p className="mt-2 text-gray-500">Your profile information</p>
      </div>

      {/* Avatar Upload */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-32 h-32">
          <img
            src={
              selectedImage ||
              (formData.avatar instanceof File
                ? URL.createObjectURL(formData.avatar)
                : formData.avatar) ||
              "/avatar-holder.avif"
            }
            alt="Avatar"
            className="w-full h-full object-cover rounded-full border-4 border-gray-200"
          />
          <label
            htmlFor="avatar-upload"
            className={`absolute bottom-0 right-0 bg-gray-800 hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
              isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
            }`}
          >
            <Camera className="w-5 h-5 text-white" />
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUpdatingProfile}
            />
          </label>
        </div>
        <p className="text-sm text-gray-400">
          {isUpdatingProfile
            ? "Uploading..."
            : "Click the camera icon to upload your photo."}
        </p>
      </div>

      {/* User Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-800 focus:outline-none"
            placeholder="Full Name"
          />
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-500" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-100 rounded-lg border border-gray-300 text-gray-800 focus:outline-none"
            placeholder="Email Address"
          />
        </div>
      </div>

      {/* Update Profile Button */}
      <button
        onClick={handleUpdateProfile}
        disabled={isUpdatingProfile}
        className="w-full bg-blue-600 text-white font-medium py-2 rounded-md flex justify-center items-center gap-2 hover:bg-blue-700 transition"
      >
        {isUpdatingProfile ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Loading...
          </>
        ) : (
          "Update Profile"
        )}
      </button>

      {/* Account Info */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">
          Account Information
        </h2>
        <div className="text-sm text-gray-600 space-y-3">
          <div className="flex justify-between border-b border-gray-200 py-2">
            <span>Member Since</span>
            <span>{authUser?.createdAt?.split("T")[0]}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Account Status</span>
            <span className="text-green-600 font-medium">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
