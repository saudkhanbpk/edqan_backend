import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { notificationMethodController } from "../controllers/index.js";

router.post("/", expressCallBack(notificationMethodController.createNotificationMethod));
router.get("/:_id", expressCallBack(notificationMethodController.getNotificationMethodById));
router.get("/", expressCallBack(notificationMethodController.getNotificationMethods));
router.patch("/:_id", expressCallBack(notificationMethodController.updateNotificationMethodById));
router.delete("/:_id", expressCallBack(notificationMethodController.deleteNotificationMethodById));

export default router;
