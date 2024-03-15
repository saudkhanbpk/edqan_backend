import express from "express";
const router = express.Router();

import expressCallBack from "../helper/express-callback.js";

import { languageController } from "../controllers/index.js";

router.post("/", expressCallBack(languageController.createLanguage));
router.get("/:_id", expressCallBack(languageController.getLanguageById));
router.get("/", expressCallBack(languageController.getLanguages));
router.patch("/:_id", expressCallBack(languageController.updateLanguageById));
router.delete("/:_id", expressCallBack(languageController.removeLanguageById));

export default router;
