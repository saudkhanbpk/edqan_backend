import { trimAndRemoveSpaces } from "../helper/helper.js";
import { isStringPath, isAlphaNumeric, isNumeric } from "../helper/validation.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";

function makeKeyWays({ nameEn, nameAr, order, icon }) {
  //#region name validation
  nameEn = trimAndRemoveSpaces(nameEn);
  if (!nameEn) {
    throw new RequiredParameterError("nameEn");
  }
  if (!isAlphaNumeric(nameEn)) {
    throw new InvalidPropertyError("nameEn must include only letters");
  }
  //#endregion nameEn validation

  //#region icon validation
  if (icon) {
    icon = trimAndRemoveSpaces(icon);
    if (!icon) {
      throw new RequiredParameterError("icon");
    }
    if (!isStringPath(icon)) {
      throw new InvalidPropertyError("icon must include only icon");
    }
  }
  icon = "https://via.placeholder.com/50x50";
  //to be removex on admin panel

  //#endregion icon validation

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
    icon,
  });
}
export default makeKeyWays;
