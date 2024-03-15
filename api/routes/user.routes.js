import express from "express";
const router = express.Router();
import { checkAuth, adminAuth } from "../security/index.js";

import expressCallBack from "../helper/express-callback.js";

import { userController } from "../controllers/index.js";

router.get("/completed/profile/_:id", expressCallBack(userController.areAllFieldsFilled));
router.get("/new-version/:_id", expressCallBack(userController.getUserVersionById));
router.post("/", adminAuth, expressCallBack(userController.createUser));
router.post("/login", expressCallBack(userController.userLogin));
router.post("/reset-password/:_id", expressCallBack(userController.resetUserPassword));
router.get("/verify/:_id/:verificationToken", expressCallBack(userController.verifyUser));
// router.get("/new-data", checkAuth, expressCallBack(userController.getUsersWithNewData));
router.get("/verify-request/:_id", expressCallBack(userController.generateAndSendUserVerification));
router.get("/notifications/:_id", expressCallBack(userController.getUserNotificationPreferences));
router.get("/reset-password/:userEmail", expressCallBack(userController.generateAndSendUserPasswordReset));
router.get("/:_id", expressCallBack(userController.getUserById));
router.get("/", expressCallBack(userController.getUsers));
router.patch("/change-password", checkAuth, expressCallBack(userController.updatePassword));
router.patch("/notifications/:_id", checkAuth, expressCallBack(userController.updateUserNotificationPreferences));
router.patch("/:_id", checkAuth, expressCallBack(userController.updateUserById));
router.patch("/approve-update/:_id", checkAuth, expressCallBack(userController.approveOrDeclineNewDataUpdate));
router.delete("/:_id", checkAuth, expressCallBack(userController.removeUser));

export default router;
