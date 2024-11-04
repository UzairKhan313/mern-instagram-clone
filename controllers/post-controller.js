import sharp from "sharp";
import { StatusCodes } from "http-status-codes";

import { NotFoundError, UnauthorizedError } from "../errors/custom-error.js";
import cloudinary from "../utils/cloudinary.js";

import User from "../models/user-model.js";
import Post from "../models/post-model.js";
import Comment from "../models/comment-model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// Adding new Post.
export const addNewPost = async (req, res) => {
  const { caption } = req.body;
  const image = req.file;
  const authorId = req.userId;

  if (!image) throw new NotFoundError("Please provide a post image.");

  // image upload and optimizing image.
  const optimizedImageBuffer = await sharp(image.buffer)
    .resize({ width: 800, height: 800, fit: "inside" })
    .toFormat("jpeg", { quality: 80 })
    .toBuffer();

  // buffer to data uri
  const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
    "base64"
  )}`;

  const cloudResponse = await cloudinary.uploader.upload(fileUri);
  const post = await Post.create({
    caption,
    image: cloudResponse.secure_url,
    author: authorId,
  });
  const user = await User.findById(authorId);
  if (user) {
    user.posts.push(post._id);
    await user.save();
  }

  // Getting the created post with all the user information except then password.
  await post.populate({ path: "author", select: "-password" });

  res.status(StatusCodes.CREATED).json({
    msg: "New post added",
    post,
    success: true,
  });
};

// Getting all posts.
export const getAllPost = async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 }) // sorted on time, decreasing mean most recent posts.
    .populate({ path: "author", select: "username name avatar" })
    .populate({
      path: "comments",
      sort: { createdAt: -1 },
      populate: {
        path: "author",
        select: "username avatar",
      },
    });
  if (!posts.length) throw new NotFoundError("No posts avalaible yet.");
  res.status(StatusCodes.OK).json({
    posts,
    success: true,
  });
};

// Getting my post.
export const getMyPosts = async (req, res) => {
  const authorId = req.userId;
  const posts = await Post.find({ author: authorId })
    .sort({ createdAt: -1 })
    .populate({
      path: "author",
      select: "username,name, profilePicture",
    })
    .populate({
      path: "comments",
      sort: { createdAt: -1 },
      populate: {
        path: "author",
        select: "username,name, profilePicture",
      },
    });
  if (!posts.length) throw new NotFoundError(`No post created yet`);
  res.status(StatusCodes.OK).json({
    posts,
    success: true,
  });
};

// Like a post.
export const likePost = async (req, res) => {
  const userId = req.userId;
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (!post) throw new NotFoundError("Post not found.");

  // like once addToSet mean keeping the likes array in set which mean all unique values.
  await post.updateOne({ $addToSet: { likes: userId } });
  await post.save();

  //  implement socket io for real time notification

  const user = await User.findById(userId).select("username profilePicture");

  const postOwnerId = post.author.toString();
  if (postOwnerId !== userId) {
    // emit a notification event
    const notification = {
      type: "like",
      userId: userId,
      userDetails: user,
      postId,
      message: "Your post was liked",
    };
    const postOwnerSocketId = getReceiverSocketId(postOwnerId);
    io.to(postOwnerSocketId).emit("notification", notification);
  }

  res.status(StatusCodes.OK).json({ msg: "Post liked", success: true });
};

// dislike a post
export const dislikePost = async (req, res) => {
  const userId = req.userId;
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (!post) throw new NotFoundError("Post not found.");
  // dislike well pull out the userId from the like array which actually is a unique set.
  await post.updateOne({ $pull: { likes: userId } });
  await post.save();

  // implement socket io for real time notification
  const user = await User.findById(userId).select("username avatar");

  const postOwnerId = post.author.toString();
  if (postOwnerId !== userId) {
    // emit a notification event
    const notification = {
      type: "Dislike",
      userId: userId,
      userDetails: user,
      postId,
      message: "Your post was disliked",
    };
    const postOwnerSocketId = getReceiverSocketId(postOwnerId);
    io.to(postOwnerSocketId).emit("notification", notification);
  }

  res.status(StatusCodes.OK).json({ msg: "Post disliked", success: true });
};

// Delete your own post.
export const deletePost = async (req, res) => {
  const postId = req.params.id;
  const authorId = req.userId;

  const post = await Post.findById(postId);
  if (!post) throw new NotFoundError("Post not found.");

  // check if the logged-in user is the owner of the post
  if (post.author.toString() !== authorId)
    throw new UnauthorizedError("You can't delete this post.");

  // delete post
  await Post.findByIdAndDelete(postId);

  // remove the post id from the user's post
  let user = await User.findById(authorId);
  user.posts = user.posts.filter((id) => id.toString() !== postId);
  await user.save();

  // delete associated comments
  await Comment.deleteMany({ post: postId });

  return res.status(200).json({
    success: true,
    msg: "Post deleted",
  });
};

export const bookmarkPost = async (req, res) => {
  const postId = req.params.id;
  const authorId = req.userId;
  const post = await Post.findById(postId);

  if (!post) throw new NotFoundError("Post not found");

  const user = await User.findById(authorId);
  if (user.bookmarks.includes(post._id)) {
    // already bookmarked -> remove from the bookmark
    await user.updateOne({ $pull: { bookmarks: post._id } });
    await user.save();
    return res.status(StatusCodes.OK).json({
      type: "unsaved",
      msg: "Post removed from bookmark",
      success: true,
    });
  } else {
    // adding to bookmark
    await user.updateOne({ $addToSet: { bookmarks: post._id } });
    await user.save();
    res
      .status(StatusCodes.OK)
      .json({ type: "saved", msg: "Post bookmarked", success: true });
  }
};
