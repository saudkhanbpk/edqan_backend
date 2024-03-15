import { trimAndRemoveSpaces } from "../helper/helper.js";
import { isAlphaNumeric } from "../helper/validation.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";

function makeCompanyGuideLine({ nameEn, nameAr }) {
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

  return Object.freeze({
    nameEn,
    nameAr,
  });
}
export default makeCompanyGuideLine;
