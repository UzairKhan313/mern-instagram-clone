import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name."],
    },
    username: {
      type: String,
      required: [true, "Please enter your name."],
      unique: [true, "Username must be uinqe"],
    },
    email: {
      type: String,
      required: [true, "Email address is required."],
      unique: [true, "Email already register please pick another one."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      select: false,
    },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "Hi👋, There Welcome To My Profile." },
    gender: { type: String, enum: ["male", "female"] },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
