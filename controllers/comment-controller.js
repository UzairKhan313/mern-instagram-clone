import { StatusCodes } from "http-status-codes";

import { BadRequestError, NotFoundError } from "../errors/custom-error.js";

import Comment from "../models/comment-model.js";
import Post from "../models/post-model.js";

// Adding comment to a post
export const addCommentToPost = async (req, res) => {
  const postId = req.params.id;
  const userIdWhoMakeComment = req.userId;

  const { text } = req.body;
  if (!text) throw BadRequestError("You can't make an empty comment.");

  const post = await Post.findById(postId);

  if (!post) throw NotFoundError(`Post not found with this ${postId}`);

  const comment = await Comment.create({
    text,
    author: userIdWhoMakeComment,
    post: postId,
  });

  await comment.populate({
    path: "author",
    select: "username, name, profilePicture",
  });

  post.comments.push(comment._id);
  await post.save();

  res.status(StatusCodes.CREATED).json({
    msg: "Comment Added",
    comment,
    success: true,
  });
};

// get comments of a speciffic post.
export const getCommentsOfPost = async (req, res) => {
  const postId = req.params.id;

  const comments = await Comment.find({ post: postId }).populate(
    "author",
    "username name profilePicture"
  );
  if (!comments) throw new NotFoundError("No comments found for this post");
  res.status(StatusCodes.OK).json({ success: true, comments });
};
