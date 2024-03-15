import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { provinceController } from "../controllers/index.js";

router.post("/", expressCallBack(provinceController.createProvince));
router.get("/:_id", expressCallBack(provinceController.getProvinceById));
router.get("/country/:countryId", expressCallBack(provinceController.getProvinceByCountry));
router.get("/", expressCallBack(provinceController.getProvinces));
router.patch("/:_id", expressCallBack(provinceController.updateProvinceById));
router.delete("/:_id", expressCallBack(provinceController.removeProvinceById));

export default router;
