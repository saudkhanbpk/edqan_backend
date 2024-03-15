import { InvalidPropertyError, RequiredParameterError } from "../error/errors.js";
import { isAlphaNumeric } from "../helper/validation.js";
import { trimAndRemoveSpaces } from "../helper/helper.js";

function makeDomain({ name }) {
  //#region name validation
  name = trimAndRemoveSpaces(name);
  if (!name) {
    throw new RequiredParameterError("name");
  }
  if (!isAlphaNumeric(name)) {
    throw new InvalidPropertyError("name must include only letters");
  }
  //#endregion name validation

  return Object.freeze({
    name,
  });
}
export default makeDomain;
