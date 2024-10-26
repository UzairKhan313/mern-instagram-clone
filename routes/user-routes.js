import express from "express";
import {
  editProfile,
  followOrUnfollowUser,
  getSuggestedUser,
  getUserProfile,
} from "../controllers/user-controller.js";
import { authenticateUser } from "../middleware/auth-middleware.js";

import upload from "../middleware/File-upload.js";

const router = express.Router();

router.route("/:id/profile").get(authenticateUser, getUserProfile);

router
  .route("/profile/edit")
  .post(authenticateUser, upload.single("profilePhoto"), editProfile);
router.route("/suggested").get(authenticateUser, getSuggestedUser);
router
  .route("/follow-or-unfollow/:id")
  .post(authenticateUser, followOrUnfollowUser);

export default router;
