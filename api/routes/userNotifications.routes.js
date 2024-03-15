import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { userNotificationsController } from "../controllers/index.js";

router.get("/", expressCallBack(userNotificationsController.getUserNotificationss));
router.patch("/read/:userId", expressCallBack(userNotificationsController.updateUserNotificationsStatus));

export default router;
