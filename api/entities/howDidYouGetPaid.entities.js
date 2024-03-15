import { trimAndRemoveSpaces } from "../helper/helper.js";
import { isAlphaNumeric, isNumeric } from "../helper/validation.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";

function makeHowDidYouGetPaid({ nameEn, nameAr, order }) {
  //#region name validation
  nameEn = trimAndRemoveSpaces(nameEn);
  if (!nameEn) {
    throw new RequiredParameterError("nameEn");
  }
  if (!isAlphaNumeric(nameEn)) {
    throw new InvalidPropertyError("nameEn must include only letters");
  }
  //#endregion nameEn validation

  //#region name validation
  nameAr = trimAndRemoveSpaces(nameAr);
  if (!nameAr) {
    throw new RequiredParameterError("nameAr");
  }
  if (!isAlphaNumeric(nameAr)) {
    throw new InvalidPropertyError("nameAr must include only letters");
  }

  //#endregion nameAr validation

  //#region order validation
  if (typeof order === "string") order = trimAndRemoveSpaces(order);
  if (!order && order !== 0) {
    throw new RequiredParameterError("order");
  }
  if (!isNumeric(order)) {
    throw new InvalidPropertyError("order must include only numbers");
  }
  //#endregion order validation

  return Object.freeze({
    nameEn,
    nameAr,
    order,
  });
}
export default makeHowDidYouGetPaid;
