import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../store/slices/chatSlice";
import { getSocket } from "../lib/socket";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import ChatHeader from "./ChatHeader";

const ChatContainer = () => {
  const { messages, isMessagesLoading, selectedUser } = useSelector(
    (state) => state.chat
  );
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const messageEndRef = useRef(null);

  // ✅ Get messages on user change
  useEffect(() => {
    if (!selectedUser?._id) return;
    dispatch(getMessages(selectedUser._id));
  }, [selectedUser?._id]);

  // ✅ Scroll to bottom when messages change
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ✅ Format time
  function formatMessageTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      <ChatHeader />

      {/* Message List */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {messages.length > 0 &&
          messages.map((message, index) => {
            const isSender = message.senderId === authUser._id;
            const isLast = index === messages.length - 1;

            return (
              <div
                key={message._id}
                className={`flex items-end ${
                  isSender ? "justify-end" : "justify-start"
                }`}
                ref={isLast ? messageEndRef : null}
              >
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full overflow-hidden border shrink-0 ${
                    isSender ? "order-2 ml-3" : "order-1 mr-3"
                  }`}
                >
                  <img
                    src={selectedUser?.avatar?.url || "/avatar-holder.avif"}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-2 rounded-xl text-sm ${
                    isSender
                      ? "bg-blue-400/20 text-black order-1"
                      : "bg-gray-200 text-black order-2"
                  }`}
                >
                  {/* If media exists and is a video */}
                  {message.media && (
                    <>
                      {/\.(mp4|webm|mov)$/i.test(message.media) && (
                        <video
                          src={message.media}
                          controls
                          className="w-full rounded-md mb-2"
                        />
                      )}
                    </>
                  )}

                  {/* If text exists */}
                  {message.text && <p>{message.text}</p>}

                  {/* Time */}
                  <span className="block text-[10px] mt-1 text-right text-gray-400">
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
        {/* Bottom ref for auto-scroll */}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
