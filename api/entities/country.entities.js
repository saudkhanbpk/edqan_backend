import { trimAndRemoveSpaces } from "../helper/helper.js";
import { isNumeric } from "../helper/validation.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";

function makeCountry({ name, native, id }) {
  //#region name validation
  name = trimAndRemoveSpaces(name);
  if (!name) {
    throw new RequiredParameterError("name");
  }
  // if (!isAlphaNumeric(name)) {
  //     throw new InvalidPropertyError('name must include only letters');
  // }
  //#endregion name validation

  //#region name validation
  native = trimAndRemoveSpaces(native);
  if (!native) {
    throw new RequiredParameterError("native");
  }
  // if (!isAlphaNumeric(native)) {
  //     throw new InvalidPropertyError('native must include only letters');
  // }

  //#endregion native validation

  //#region id validation
  if (typeof id === "string") id = trimAndRemoveSpaces(id);
  if (!id && id !== 0) {
    throw new RequiredParameterError("id");
  }
  if (!isNumeric(id)) {
    throw new InvalidPropertyError("id must include only numbers");
  }
  //#endregion id validation

  return Object.freeze({
    name,
    native,
    id,
  });
}
export default makeCountry;
