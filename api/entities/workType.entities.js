import { isAlphaNumeric } from "../helper/validation.js";
import { trimAndRemoveSpaces } from "../helper/helper.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";

function makeWorkType({ nameEn, nameAr }) {
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

  return Object.freeze({
    nameEn,
    nameAr,
  });
}
export default makeWorkType;
