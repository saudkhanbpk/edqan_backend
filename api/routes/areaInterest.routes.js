import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { areaInterestController } from "../controllers/index.js";

router.post("/", expressCallBack(areaInterestController.createAreaInterest));
router.get("/:_id", expressCallBack(areaInterestController.getAreaInterestById));
router.get("/", expressCallBack(areaInterestController.getAreaInterests));
router.patch("/:_id", expressCallBack(areaInterestController.updateAreaInterestById));
router.delete("/:_id", expressCallBack(areaInterestController.removeAreaInterestById));

export default router;
