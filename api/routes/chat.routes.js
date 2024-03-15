import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";
import { checkAuth } from "../security/index.js";
import { chatController } from "../controllers/index.js";

router.post("/", expressCallBack(chatController.createChat));
router.get("/user/:userId", /* checkAuth, */ expressCallBack(chatController.getChatsByUserId));
router.get("/:_id", checkAuth, expressCallBack(chatController.getChatById));
router.patch("/:_id", expressCallBack(chatController.updateChatById));

export default router;
