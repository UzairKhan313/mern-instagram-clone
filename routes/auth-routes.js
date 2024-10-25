import express from "express";
import {
  loginUser,
  logoutUser,
  signupUser,
} from "../controllers/auth-controller.js";

const router = express.Router();

router.route("/register").post(signupUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);

export default router;
