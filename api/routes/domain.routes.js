import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { domainController } from "../controllers/index.js";

router.post("/", expressCallBack(domainController.createDomain));
router.get("/:_id", expressCallBack(domainController.getDomainById));
router.get("/", expressCallBack(domainController.getDomains));
router.patch("/:_id", expressCallBack(domainController.updateDomainById));
router.delete("/:_id", expressCallBack(domainController.deleteDomainById));

export default router;
