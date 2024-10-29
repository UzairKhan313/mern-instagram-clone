import express from "express";

import {
  addNewPost,
  bookmarkPost,
  deletePost,
  dislikePost,
  getAllPost,
  getMyPosts,
  likePost,
} from "../controllers/post-controller.js";

import { authenticateUser } from "../middleware/auth-middleware.js";
import upload from "../middleware/File-upload.js";

const router = express.Router();

router.route("/new").post(authenticateUser, upload.single("image"), addNewPost);

router.route("/all").get(authenticateUser, getAllPost);

router.route("/my-post/all").get(authenticateUser, getMyPosts);
router.route("/:id/like").get(authenticateUser, likePost);
router.route("/:id/dislike").get(authenticateUser, dislikePost);
router.route("/delete/:id").delete(authenticateUser, deletePost);
router.route("/:id/bookmark").get(authenticateUser, bookmarkPost);

export default router;
