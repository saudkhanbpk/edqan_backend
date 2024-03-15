import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { checkAuth } from "../security/index.js";

import { messageController } from "../controllers/index.js";

router.post("/", checkAuth, expressCallBack(messageController.createMessage));
// router.get('/:_id', expressCallBack(messageController.getMessageById));
router.get("/unread", checkAuth, expressCallBack(messageController.getUnreadMessagesCountByUser));
router.get("/:chatId",checkAuth,expressCallBack(messageController.getMessagesByChatId));
router.patch("/:_id", expressCallBack(messageController.updateMessageById));

export default router;
