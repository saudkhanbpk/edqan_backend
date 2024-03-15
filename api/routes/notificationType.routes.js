import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { notificationTypeController } from "../controllers/index.js";

router.post("/", expressCallBack(notificationTypeController.createNotificationType));
router.get("/model/:userModel", expressCallBack(notificationTypeController.getNotificationTypeByModel));
router.get("/:_id", expressCallBack(notificationTypeController.getNotificationTypeById));
router.get("/", expressCallBack(notificationTypeController.getNotificationTypes));
router.patch("/:_id", expressCallBack(notificationTypeController.updateNotificationTypeById));
router.delete("/:_id", expressCallBack(notificationTypeController.deleteNotificationTypeById));

export default router;
