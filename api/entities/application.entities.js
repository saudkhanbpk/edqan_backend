import { trimAndRemoveSpaces, toBoolean } from "../helper/helper.js";
import { isAlphaNumeric, isStringPath, isObjectId } from "../helper/validation.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";

function makeApplication({
  questionsAnswers,
  dateApplied,
  status,
  company,
  visibility,
  cv,
  user,
  job,
  cvPath,
  coverLetterPath,
  existingCv,
  existingCoverLetter,
}) {
  //#region questionsAnswers validation
  if (questionsAnswers) {
    for (let i = 0; i < questionsAnswers?.length; i++) {
      questionsAnswers[i].question = trimAndRemoveSpaces(questionsAnswers[i].question);
      if (!questionsAnswers[i].question) throw new RequiredParameterError("question");
      if (!isAlphaNumeric(questionsAnswers[i].question)) throw new InvalidPropertyError("question should only contain letters");
      //#endregion questionsAnswers.question validation

      //! enums must be implmented
      //#region questionsAnswers.company validation
      questionsAnswers[i].answer = trimAndRemoveSpaces(questionsAnswers[i].answer);
      if (!questionsAnswers[i].answer) throw new RequiredParameterError("answer");
      if (!isAlphaNumeric(questionsAnswers[i].answer)) throw new InvalidPropertyError("question Id should only contain letters and numbers");
      //#endregion questionsAnswers.answer validation
    }
  }

  //#region visibility validation
  visibility = toBoolean(visibility);
  //#endregion visibility validation

  //#region coverLetterPath validation
  if (coverLetterPath) {
    if (typeof coverLetterPath === "string") coverLetterPath = trimAndRemoveSpaces(coverLetterPath);
    if (!isStringPath(coverLetterPath)) throw new InvalidPropertyError("coverLetterPath should only contain path");
  }
  //#endregion coverLetterPath validation

  //#region cvPath validation
  if (cvPath) {
    if (typeof cvPath === "string") cvPath = trimAndRemoveSpaces(cvPath);

    if (!isStringPath(cvPath)) throw new InvalidPropertyError("cvPath should only contain path");
  }
  //#endregion cvPath validation

  if (existingCoverLetter) {
    //#region existingCoverLetter validation
    if (typeof existingCoverLetter === "string") existingCoverLetter = trimAndRemoveSpaces(existingCoverLetter);

    if (!isObjectId(existingCoverLetter)) {
      throw new InvalidPropertyError("existingCoverLetter must include a existingCoverLetter ID");
    }
  }
  //#endregion existingCoverLetter validation

  //#region existingCv validation
  if (existingCv) {
    if (typeof existingCv === "string") existingCv = trimAndRemoveSpaces(existingCv);

    if (!isObjectId(existingCv)) {
      throw new InvalidPropertyError("existingCv must include a existingCv ID");
    }
  }
  //#endregion existingCv validation
  //#region user validation
  if (typeof user === "string") user = trimAndRemoveSpaces(user);
  if (!user) {
    throw new RequiredParameterError("user");
  }
  if (!isObjectId(user)) {
    throw new InvalidPropertyError("user must include a user ID");
  }
  //#endregion user validation
  //#region company validation
  if (typeof company === "string") company = trimAndRemoveSpaces(company);
  if (!company) {
    throw new RequiredParameterError("company");
  }
  if (!isObjectId(company)) {
    throw new InvalidPropertyError("company must include a company ID");
  }
  //#endregion company validation

  //#region job validation
  if (typeof job === "string") job = trimAndRemoveSpaces(job);
  if (!job) {
    throw new RequiredParameterError("job");
  }
  if (!isObjectId(job)) {
    throw new InvalidPropertyError("job must include a job ID");
  } //#endregion user validation

  return Object.freeze({
    questionsAnswers,
    dateApplied,
    status,
    visibility,
    cv,
    user,
    company,
    job,
    cvPath,
    coverLetterPath,
    existingCv,
    existingCoverLetter,
  });
}

export default makeApplication;
