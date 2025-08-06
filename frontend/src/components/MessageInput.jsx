import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image, Video, Send, Smile, X } from "lucide-react";
import { getSocket } from "../lib/socket";
import { toast } from "react-toastify";
import { sendMessage } from "../store/slices/chatSlice";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.chat.selectedUser);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMedia(file);
    const type = file.type;

    if (type.startsWith("image/")) {
      setMediaType("image");
      const reader = new FileReader();
      reader.onload = () => setMediaPreview(reader.result);
      reader.readAsDataURL(file);
    } else if (type.startsWith("video/")) {
      setMediaType("video");
      const videoUrl = URL.createObjectURL(file);
      setMediaPreview(videoUrl);
    } else {
      toast.error("Please select an image or video file.");
      setMedia(null);
      setMediaPreview(null);
      setMediaType("");
    }
  };

  const removeMedia = () => {
    setMedia(null);
    setMediaPreview(null);
    setMediaType("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !media) return;

    const data = new FormData();
    data.append("text", text.trim());
    if (media) data.append("media", media);

    dispatch(sendMessage(data));

    // Reset state
    setText("");
    removeMedia();
  };


  useEffect(() => {
    if (!selectedUser) return;

    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (
        newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id
      ) {
        dispatch(PushMessage(newMessage)); 
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [selectedUser?._id]);

  return (
    <form
      onSubmit={handleSendMessage}
      className="flex items-center gap-3 border-t border-gray-200 px-4 py-3 bg-white"
    >
      {/* Emoji Button */}
      <button
        type="button"
        onClick={() => console.log("Emoji picker clicked")}
        className="text-gray-500 hover:text-blue-500"
      >
        <Smile size={22} />
      </button>

      {/* Image Upload */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="text-gray-500 hover:text-blue-500"
      >
        <Image size={22} />
      </button>

      {/* Video Upload */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="text-gray-500 hover:text-blue-500"
      >
        <Video size={22} />
      </button>

      {/* Media Preview */}
      {mediaPreview && (
        <div className="relative">
          {mediaType === "image" ? (
            <img
              src={mediaPreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-gray-700"
            />
          ) : (
            <video
              src={mediaPreview}
              controls
              className="w-32 h-20 object-cover rounded-lg border border-gray-700"
            />
          )}
          <button
            onClick={removeMedia}
            type="button"
            className="absolute -top-2 right-2 w-5 h-5 bg-zinc-800 text-white rounded-full flex items-center justify-center"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Input Text */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* File Input (Hidden) */}
      <input
        type="file"
        accept="image/*,video/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleMediaChange}
      />

      {/* Send Button */}
      <button
        type="submit"
        disabled={!text.trim() && !media}
        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
      >
        <Send size={20} />
      </button>
    </form>
  );
};

export default MessageInput;
