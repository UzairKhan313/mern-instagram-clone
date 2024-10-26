import { StatusCodes } from "http-status-codes";

import { BadRequestError, NotFoundError } from "../errors/custom-error.js";
import { comparePassword, hashPassword } from "../utils/password-utility.js";
import { createJWT } from "../utils/token-utility.js";

import User from "../models/user-model.js";
import Post from "../models/post-model.js";

// Signup User
export const signupUser = async (req, res, next) => {
  const { name, email, username, password } = req.body;

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (user) {
    if (user.username === username) {
      throw new BadRequestError("Username already exists");
    }
    throw new BadRequestError("Email already exists");
  }

  const hashedPassword = await hashPassword(password);
  await User.create({
    name,
    email,
    username,
    password: hashedPassword,
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    msg: "Account created successfully.",
  });
};

// Login User
export const loginUser = async (req, res, next) => {
  const { userId, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: userId }, { username: userId }],
  }).select("+password");

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  const isPasswordMatched = await comparePassword(user.password);

  if (!isPasswordMatched) {
    throw new BadRequestError("Invalid user crendentials.");
  }

  const token = createJWT({ userId: user._id });
  // populate each post if in the posts array
  const populatedPosts = await Promise.all(
    user.posts.map(async (postId) => {
      const post = await Post.findById(postId);
      if (post.author.equals(user._id)) {
        return post;
      }
      return null;
    })
  );
  user = {
    _id: user._id,
    username: user.username,
    email: user.email,
    profilePicture: user.profilePicture,
    bio: user.bio,
    followers: user.followers,
    following: user.following,
    posts: populatedPosts,
  };

  res
    .status(StatusCodes.OK)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    })
    .json({
      msg: `Welcome back ${user.name}`,
      success: true,
      user,
    });
};

// Logout User
export const logoutUser = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Logged Out",
  });
};
