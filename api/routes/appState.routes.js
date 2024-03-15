import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { appStateController } from "../controllers/index.js";

// router.post('/', expressCallBack(appStateController.addAppState));
router.patch("/", expressCallBack(appStateController.updateAppState));
router.get("/:_id", expressCallBack(appStateController.getAppStateById));
router.get("/", expressCallBack(appStateController.getAppStates));

export default router;
