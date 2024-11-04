import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/custom-error.js";
import User from "../models/user-model.js";
import { getUriForFile } from "../utils/get-data-uri.js";
import cloudinary from "../utils/cloudinary.js";

// Get any user profile.
export const getUserProfile = async (req, res, next) => {
  const userId = req.params.id;
  let user = await User.findById(userId)
    .populate({ path: "posts", createdAt: -1 })
    .populate("bookmarks");

  if (!user) {
    throw new NotFoundError("User not found");
  }
  res.status(StatusCodes.OK).json({
    user,
    success: true,
  });
};

// Update profile controller.
export const editProfile = async (req, res, next) => {
  const userId = req.userId;
  const { bio, gender, name } = req.body;
  const profilePicture = req.file;
  let cloudResponse;

  if (profilePicture) {
    const fileUri = getUriForFile(profilePicture);
    cloudResponse = await cloudinary.uploader.upload(fileUri);
  }

  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new NotFoundError(`User not found with this ${userId} Id`);
  }
  if (bio) user.bio = bio;
  if (name) user.name = name;
  if (gender) user.gender = gender;
  if (profilePicture) user.avatar = cloudResponse.secure_url;

  await user.save();

  res.status(StatusCodes.OK).json({
    msg: "Profile updated.",
    success: true,
    user,
  });
};

// Getting suggested user.
export const getSuggestedUser = async (req, res, next) => {
  // getting all user execpt then the current user.
  const suggestedUsers = await User.find({
    _id: { $ne: req.userId },
  }).select("-password");
  if (!suggestedUsers) {
    throw new NotFoundError("Currently we don't have any user.");
  }
  res.status(StatusCodes.OK).json({
    success: true,
    users: suggestedUsers,
  });
};

// follow or unfollow user controller.
export const followOrUnfollowUser = async (req, res, next) => {
  const userToMakeFollowRequest = req.id; // patel
  const userToBeFollowed = req.params.id; // shivani

  if (userToMakeFollowRequest === userToBeFollowed) {
    throw new BadRequestError("You cannot follow/unfollow yourself");
  }

  const user = await User.findById(userToMakeFollowRequest);
  const targetUser = await User.findById(userToBeFollowed);

  if (!user || !targetUser) {
    throw new NotFoundError("User not found.");
  }
  // checking whether the user of be follow or unfollow.
  const isFollowing = user.following.includes(userToBeFollowed);
  if (isFollowing) {
    // unfollow logic
    await Promise.all([
      User.updateOne(
        { _id: userToMakeFollowRequest },
        { $pull: { following: userToBeFollowed } }
      ),
      User.updateOne(
        { _id: userToBeFollowed },
        { $pull: { followers: userToMakeFollowRequest } }
      ),
    ]);
    return res
      .status(StatusCodes.OK)
      .json({ msg: "User Unfollowed successfully", success: true });
  } else {
    // follow logic
    await Promise.all([
      User.updateOne(
        { _id: userToMakeFollowRequest },
        { $push: { following: userToBeFollowed } }
      ),
      User.updateOne(
        { _id: userToBeFollowed },
        { $push: { followers: userToMakeFollowRequest } }
      ),
    ]);
    res
      .status(StatusCodes.OK)
      .json({ msg: "User followed successfully", success: true });
  }
};
