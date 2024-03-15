import { isAlphaNumeric, isObjectId } from "../helper/validation.js";
import { trimAndRemoveSpaces } from "../helper/helper.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";

function makeSubIndustry({ nameEn, nameAr, industry, order }) {
  //#region nameEn validation
  nameEn = trimAndRemoveSpaces(nameEn);
  if (!nameEn) throw new RequiredParameterError("nameEn");
  if (!isAlphaNumeric(nameEn)) throw new InvalidPropertyError("nameEn should only contain letters and numbers");
  //#endregion nameEn validation

  //validate order
  if (order) {
    if (isNaN(order)) throw new InvalidPropertyError("order should be a number");
    order = Number(order);
  }

  //#region nameAr validation
  nameAr = trimAndRemoveSpaces(nameAr);
  if (!nameAr) throw new RequiredParameterError("nameAr");
  if (!isAlphaNumeric(nameAr)) throw new InvalidPropertyError("nameAr should only contain letters and numbers");
  //#endregion nameAr validation

  //#region industry validation
  industry = trimAndRemoveSpaces(industry);
  if (!industry) throw new RequiredParameterError("industry");
  if (!isObjectId(industry)) throw new InvalidPropertyError("industry should only contain industry ID");
  //#endregion industry validation

  return Object.freeze({
    nameEn,
    nameAr,
    industry,
    order,
  });
}
export default makeSubIndustry;
