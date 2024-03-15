import { isObjectId, isValidDate, isNumeric } from "../helper/validation.js";
import { trimAndRemoveSpaces, compareDates, toBoolean } from "../helper/helper.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";

function makeReview({
  jobTitle,
  // review,
  resourcesFindingJob,
  advicesForOthers,
  whatYouLikedAndLearned,
  typeOfWork,
  keyWays,
  user,
  company,
  startDate,
  endDate,
  currency,
  addToProfile,
  didYouGetOffer,
  howOftenDidYouGetPaid,
  agreeToTerms,
  salary,
  approved,
}) {

  if (approved) {
    approved = approved.toLowerCase();
  }
  //#region jobTitle validation
  jobTitle = trimAndRemoveSpaces(jobTitle);
  if (!jobTitle) throw new RequiredParameterError("job title");
  // if (!isAlpha(jobTitle))
  //   throw new InvalidPropertyError(
  //     "job title should only contain letters and numbers"
  //   );
  //#endregion jobTitle validation

  // //#region review validation
  // review = trimAndRemoveSpaces(review);
  // if (!review) throw new RequiredParameterError("review");
  // if (!isAlphaNumeric(review))
  //   throw new InvalidPropertyError(
  //     "review should only contain letters and numbers"
  //   );
  // //#endregion review validation

  //#region resourcesFindingJob validation
  resourcesFindingJob = trimAndRemoveSpaces(resourcesFindingJob);
  if (!resourcesFindingJob) throw new RequiredParameterError("resourcesFindingJob");
  // if (!isAlphaNumeric(resourcesFindingJob))
  //   throw new InvalidPropertyError(
  //     "resourcesFindingJob should only contain letters and numbers"
  //   );
  //#endregion resourcesFindingJob validation

  //#region advicesForOthers validation
  advicesForOthers = trimAndRemoveSpaces(advicesForOthers);
  // if (!isAlphaNumeric(advicesForOthers))
  //   throw new InvalidPropertyError(
  //     "advices for others should only contain letters and numbers"
  //   );
  //#endregion advicesForOthers validation

  //#region whatYouLikedAndLearned validation
  whatYouLikedAndLearned = trimAndRemoveSpaces(whatYouLikedAndLearned);
  if (!whatYouLikedAndLearned) throw new RequiredParameterError("what you liked and learned");
  // if (!isAlphaNumeric(whatYouLikedAndLearned))
  //   throw new InvalidPropertyError(
  //     "what you liked and learned should only contain letters and numbers"
  //   );
  //#endregion whatYouLikedAndLearned validation

  //#region typeOfWork validation
  typeOfWork = trimAndRemoveSpaces(typeOfWork);
  if (!typeOfWork) throw new RequiredParameterError("typeOfWork");
  // if (!isAlphaNumeric(typeOfWork))
  //   throw new InvalidPropertyError(
  //     "typeOfWork should only contain letters and numbers"
  //   );
  //#endregion typeOfWork validation

  //#region keyWays validation
  if (!Array.isArray(keyWays) || keyWays?.length === 0) throw new RequiredParameterError("key ways");
  for (let i = 0; i < keyWays?.length; i++) {
    keyWays[i] = trimAndRemoveSpaces(keyWays[i]);
    if (!keyWays[i]) throw new RequiredParameterError("key ways");
    if (!isObjectId(keyWays[i])) throw new InvalidPropertyError("keyWays should only contain letters and numbers");
  }
  //#endregion keyWays validation

  //#region user validation
  user = trimAndRemoveSpaces(user);
  if (!user) throw new RequiredParameterError("user");
  if (!isObjectId(user)) throw new InvalidPropertyError("please enter a valid user object Id");
  //#endregion user validation

  //#region howOftenDidYouGetPaid validation
  if (howOftenDidYouGetPaid) {
    howOftenDidYouGetPaid = trimAndRemoveSpaces(howOftenDidYouGetPaid);
    if (!howOftenDidYouGetPaid) throw new RequiredParameterError("howOftenDidYouGetPaid");
    // if (!isAlphaNumeric(howOftenDidYouGetPaid))
    //   throw new InvalidPropertyError(
    //     "howOftenDidYouGetPaid should only contain letters and numbers"
    //   );
  }
  //#endregion howOftenDidYouGetPaid validation

  // //#region didYouGetOffer validation
  // didYouGetOffer = trimAndRemoveSpaces(didYouGetOffer);
  // if (!didYouGetOffer) throw new RequiredParameterError("didYouGetOffer");
  // if (!isAlphaNumeric(didYouGetOffer))
  //   throw new InvalidPropertyError(
  //     "didYouGetOffer should only contain letters and numbers"
  //   );
  // //#endregion didYouGetOffer validation

  //#region didYouGetOffer validation
  if (didYouGetOffer) {
    //#region didYouGetOffer.answer validation
    didYouGetOffer.answer = trimAndRemoveSpaces(didYouGetOffer.answer);
    if (!didYouGetOffer.answer) throw new RequiredParameterError("please answer the did you get an offer question");
    // if (!isAlphaNumeric(didYouGetOffer.answer))
    //   throw new InvalidPropertyError("did you get an offer answer");
    // //#endregion didYouGetOffer.answer validation
    //#region didYouGetOffer.answer validation
    new Boolean(didYouGetOffer.visibility);
    if (typeof didYouGetOffer.visibility !== "boolean")
      throw new InvalidPropertyError("please enter a valid visibility value for did you get an offer answer");
    //#endregion didYouGetOffer.visibility validation
  }
  //#endregion didYouGetOffer validation

  //#region company validation
  company = trimAndRemoveSpaces(company);
  if (!company) throw new RequiredParameterError("company");
  if (!isObjectId(company)) throw new InvalidPropertyError("enter a valid company ID");
  //#endregion company validation

  //#region startDate validation
  if (!startDate) throw new RequiredParameterError("start date");
  startDate = new Date(startDate);
  if (!isValidDate(startDate)) throw new InvalidPropertyError("enter a valid start date");
  //#endregion startDate validation

  //#region endDate validation
  if (endDate) {
    if (!endDate) throw new RequiredParameterError("end date");
    endDate = new Date(endDate);

    if (!isValidDate(endDate)) throw new InvalidPropertyError("enter a valid end date");
    if (!compareDates(endDate, startDate)) throw new InvalidPropertyError("education ending date should be a date after starting date");
  }
  //#endregion endDate validation

  //#region addToProfile validation
  if (typeof addToProfile !== "boolean") throw new InvalidPropertyError("enter a valid value for add to profile status");
  //#endregion addToProfile validation

  //#region agreeToTerms validation
  if (typeof agreeToTerms !== "boolean") throw new InvalidPropertyError("enter a valid agree to terms");
  //#endregion agreeToTerms validation

  //#region salary validation
  if (salary) {
    if (typeof salary === "string") salary = trimAndRemoveSpaces(salary);
    if (!isNumeric(salary)) {
      throw new InvalidPropertyError("salary must include only numbers");
    }
    //currency
    if (!currency) throw new RequiredParameterError("currency");
    currency = trimAndRemoveSpaces(currency);
  }
  //#endregion salary validation
  return Object.freeze({
    jobTitle,
    // review,
    resourcesFindingJob,
    advicesForOthers,
    whatYouLikedAndLearned,
    typeOfWork,
    keyWays,
    user,
    company,
    startDate,
    endDate,
    addToProfile,
    didYouGetOffer,
    currency,
    howOftenDidYouGetPaid,
    approved,
    agreeToTerms,
    salary,
  });
}
export default makeReview;
