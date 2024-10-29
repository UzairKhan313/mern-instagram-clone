import express from "express";

import { authenticateUser } from "../middleware/auth-middleware.js";

import {
  addCommentToPost,
  getCommentsOfPost,
} from "../controllers/comment-controller.js";

const router = express.Router();

router.route("/:id").post(authenticateUser, addCommentToPost);
router.route("/:id/all").get(authenticateUser, getCommentsOfPost);

export default router;
