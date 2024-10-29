import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import errorHandlerMiddleware from "./middleware/error-middleware.js";

import authRouter from "./routes/auth-routes.js";
import userRouter from "./routes/user-routes.js";
import postRouter from "./routes/post-routes.js";
import commentRouter from "./routes/comment-routes.js";
import messageRouter from "./routes/messages-routes.js";

const app = express();
dotenv.config();
const port = process.env.PORT || 3003;

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

//middlewares
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/messaage", messageRouter);

// Not found Routes Error.
app.use("*", (req, res) => {
  res.status(404).json({ msg: "Route Not found" });
});

//Error Handler Middlewar.
app.use(errorHandlerMiddleware);

app.listen(port, async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `server running, ( connected to Database successfully ) on http://localhost:${port}`
    );
  } catch (error) {
    console.log(error);
    console.log("failed to connect to the data base.");
    process.exit(1);
  }
});
