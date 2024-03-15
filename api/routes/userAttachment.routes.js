import express from "express";
const router = express.Router();
import { checkAuth } from "../security/index.js";

import expressCallBack from "../helper/express-callback.js";

import { userAttachmentController } from "../controllers/index.js";

router.post("/:userId", checkAuth, expressCallBack(userAttachmentController.createUserAttachment));
router.get("/user/:userId", checkAuth, expressCallBack(userAttachmentController.getUserAttachments));
router.get("/", checkAuth, expressCallBack(userAttachmentController.getAllFilteredUserAttachments));
router.get("/:_id", expressCallBack(userAttachmentController.getUserAttachmentById));
router.patch("/:_id", checkAuth, expressCallBack(userAttachmentController.updateUserAttachmentById));
router.delete("/:_id", expressCallBack(userAttachmentController.removeUserAttachmentById));

export default router;
