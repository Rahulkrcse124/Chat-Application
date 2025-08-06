import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      public_id: String,
      url: String,
    },
  },
  { timestamps: true } 
);

export default mongoose.model("User", userSchema);

// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     fullName: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },

//     avatar: {
//       public_id: String,
//       url: String,
//     },
//   },
//   { timeseries: true }
// );

// export default mongoose.model("User", userSchema);
