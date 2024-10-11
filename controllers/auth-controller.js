import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/custom-error.js";
import User from "../models/user-model.js";

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

  const newUser = await User.create({
    name,
    email,
    username,
    password,
    avatar: req.file.location,
  });

  const token = newUser.generateToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(StatusCodes.CREATED).cookie("token", token, options).json({
    success: true,
    user,
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

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    throw new BadRequestError("Inavlid login crendentials.");
  }

  const token = user.generateToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(StatusCodes.OK).cookie("token", token, options).json({
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
    message: "Logged Out",
  });
};
