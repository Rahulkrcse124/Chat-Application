import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import fileUpload from "express-fileupload";
import userRouter from "./routes/userRouter.js";
import messageRouter from "./routes/messageRouter.js";
import http from "http";
import { initSocket } from "./utils/socket.js";
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// setup for socket server
const server = http.createServer(app);
initSocket(server);

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(cookieParser()); // parse token on every request
app.use(express.json());
app.use(bodyParser.json()); // parse json on every request
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./upload",
  })
);

// Routes
app.use("/api/v1/user", userRouter); // user
app.use("/api/v1/message", messageRouter); // message

// Server Port
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is listening on Port :${PORT}`);
});
