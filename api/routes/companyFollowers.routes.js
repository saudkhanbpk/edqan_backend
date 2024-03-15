import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { companyFollowersController } from "../controllers/index.js";

router.post("/", expressCallBack(companyFollowersController.createCompanyFollowers));
router.get("/:_id", expressCallBack(companyFollowersController.getCompanyFollowersById));
router.get("/", expressCallBack(companyFollowersController.getCompanyFollowerss));
router.patch("/:_id", expressCallBack(companyFollowersController.updateCompanyFollowersById));

export default router;
