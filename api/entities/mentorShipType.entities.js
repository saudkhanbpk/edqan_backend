import { isAlphaNumeric, isNumeric } from "../helper/validation.js";
import { trimAndRemoveSpaces } from "../helper/helper.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";

function makeMentorShipType({ nameEn, nameAr, order }) {
  //#region nameEn validation
  nameEn = trimAndRemoveSpaces(nameEn);
  if (!nameEn) throw new RequiredParameterError("nameEn");
  if (!isAlphaNumeric(nameEn)) throw new InvalidPropertyError("nameEn should only contain letters and numbers");
  //#endregion nameEn validation

  //#region nameAr validation
  nameAr = trimAndRemoveSpaces(nameAr);
  if (!nameAr) throw new RequiredParameterError("nameAr");
  if (!isAlphaNumeric(nameAr)) throw new InvalidPropertyError("nameAr should only contain letters and numbers");
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
export default makeMentorShipType;
