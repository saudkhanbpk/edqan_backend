import { trimAndRemoveSpaces } from "../helper/helper.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";
import { isAlphaNumeric, isNumeric, isObjectId } from "../helper/validation.js";
import educationTypeEnum from "../types/educationType.enum.js";
import e from "cors";

function makeEducationalLevel({ nameEn, nameAr, enrolledHighSchool, educationLevelGroup, order }) {
  //#region educationLevelGroup validation
  if(!educationLevelGroup) throw new RequiredParameterError("educationLevelGroup");
  educationLevelGroup = trimAndRemoveSpaces(educationLevelGroup);
  if (!isObjectId(educationLevelGroup)) throw new InvalidPropertyError("enter a valid educatinal level group");
  //#endregion educationLevelGroup validation

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

  //#region enrolledHighSchool validation
  if (typeof enrolledHighSchool !== "boolean") throw new InvalidPropertyError("enter a valid enrolled High School");
  //#endregion enrolledHighSchool validation

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
    enrolledHighSchool,
    educationLevelGroup,
    order,
  });
}
export default makeEducationalLevel;
