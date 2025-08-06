import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
    media: String,
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);

// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema(
//   {
//     senderId: {
//       type: mongoose.Schema.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     receiverId: {
//       type: mongoose.Schema.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     text: String,
//     media: String,
//   },
//   { timeseries: true }
// );

// export default mongoose.model("Message", messageSchema);
