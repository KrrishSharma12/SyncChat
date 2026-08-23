import Router from "express";
import multer from "multer";
import upload from "../middleware/multer";
import { getMe, googleLogin, loginUser, logoutUser, signupUser, verifyEmail } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { refreshAccessToken } from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { loginSchema, signupSchema, verifyEmailSchema } from "../schemas/auth.schema";
const router = Router();
router.post("/google",googleLogin);
router.post("/signup",upload.single("profile"), validate(signupSchema), signupUser)
router.post("/verify", validate(verifyEmailSchema), verifyEmail)
router.post("/login", validate(loginSchema), loginUser)
router.get("/getme", authMiddleware, getMe)
router.post("/logout", authMiddleware, logoutUser)
router.post("/refresh", refreshAccessToken);


export default router;