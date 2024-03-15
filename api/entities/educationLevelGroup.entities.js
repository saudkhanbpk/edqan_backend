import { InvalidPropertyError, RequiredParameterError } from "../error/errors.js";
import { isAlphaNumeric, isObjectId } from "../helper/validation.js";
import { trimAndRemoveSpaces } from "../helper/helper.js";

function makeEducationLevelGroup({ name,  fieldsToValidate }) {
  //#region name validation
  name = trimAndRemoveSpaces(name);
  if (!name) {
    throw new RequiredParameterError("name");
  }
  if (!isAlphaNumeric(name)) {
    throw new InvalidPropertyError("name must include only letters");
  }
  //#endregion name validation


  //#region fieldsToValidate validation
  for (let i = 0; i < fieldsToValidate.length; i++) {
    fieldsToValidate[i] = trimAndRemoveSpaces(fieldsToValidate[i]);
    if (!fieldsToValidate[i]) throw new RequiredParameterError("first fieldsToValidate");
    if (!isAlphaNumeric(fieldsToValidate[i])) throw new InvalidPropertyError("first fieldsToValidate should only contain letters and numbers");
  }
  //#endregion fieldsToValidate validation

  return Object.freeze({
    name,
    
    fieldsToValidate,
  });
}
export default makeEducationLevelGroup;
