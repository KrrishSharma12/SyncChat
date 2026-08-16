import Router from "express";
import { changePassword, findUsers, getUserById, updateProfile } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { changePasswordSchema, updateProfileSchema } from "../schemas/user.schema";
import upload from "../middleware/multer";

const router = Router();

router.get("/search", findUsers);
router.get("/:userId", getUserById);
router.patch("/password", authMiddleware, validate(changePasswordSchema), changePassword);
router.put("/profile",authMiddleware,upload.single("profilePic"),updateProfile);

export default router;