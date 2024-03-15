import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { workTypeController } from "../controllers/index.js";

router.post("/", expressCallBack(workTypeController.createWorkType));
router.get("/:_id", expressCallBack(workTypeController.getWorkTypeById));
router.get("/", expressCallBack(workTypeController.getWorkTypes));
router.patch("/:_id", expressCallBack(workTypeController.updateWorkTypeById));
router.delete("/:_id", expressCallBack(workTypeController.removeWorkTypeById));

export default router;
