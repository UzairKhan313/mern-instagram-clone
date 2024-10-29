import express from "express";

import { authenticateUser } from "../middleware/auth-middleware.js";
import {
  getMyMessages,
  sendMessage,
} from "../controllers/message-controller.js";

const router = express.Router();

router.route("/send/:receiverId").post(authenticateUser, sendMessage);
router.route("/chat-with/:receiverId").get(authenticateUser, getMyMessages);

export default router;
