import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, setSelectedUser } from "../store/slices/chatSlice";
import { Users, Contact } from "lucide-react";

const Sidebar = () => {
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const dispatch = useDispatch();

  
  const { users, selectedUser, isUserLoading } = useSelector(
    (state) => state.chat
  );

  const { onlineUsers, user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  
  const filteredUsers = showOnlineOnly
    ? users.filter(
        (user) =>
          onlineUsers.includes(user._id) && user._id !== currentUser?._id
      )
    : users.filter((user) => user._id !== currentUser?._id);

  return (
    <>
      <aside className="h-full w-20 lg:w-72 border-r border-gray-200 flex-col transition-all duration-200 bg-white">
        {/* HEADER */}
        <div className="border-b border-gray-200 w-full p-5">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-700" />
            <span className="font-medium hidden lg:block text-gray-800">
              Contact
            </span>
          </div>

          {/* Online Only Filter */}
          <div className="mt-3 hidden lg:flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="w-4 h-4 border-gray-700 text-blue-600 focus:ring-blue-500"
              />
              Show Online Only
            </label>
            <span className="text-xs text-gray-500">
              ({onlineUsers.filter((id) => id !== currentUser?._id).length}{" "}
              online)
            </span>
          </div>
        </div>

        {/*USER LIST */}
        <div className="overflow-y-auto w-full py-3">
          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => dispatch(setSelectedUser(user))}
              className={`w-full p-3 flex items-center gap-3 transition-colors rounded-none ${
                selectedUser?._id === user._id
                  ? "bg-gray-200 ring-gray-200"
                  : "hover:bg-gray-200"
              }`}
            >
              {/* Avatar */}
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user?.url || "/avatar-holder.avif"}
                  alt="avatar"
                  className="w-12 h-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
                )}
              </div>

              {/* User info */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium text-gray-800 truncate">
                  {user.fullName}
                </div>
                <div className="text-sm text-gray-500">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
