import { trimAndRemoveSpaces } from "../helper/helper.js";
import { isNumeric } from "../helper/validation.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";

function makeNotificationMethod({ kind, name }) {
  //#region kind validation
  kind = trimAndRemoveSpaces(kind);
  if (!kind) throw new RequiredParameterError("kind");
  if (!isNumeric(kind)) throw new InvalidPropertyError("kind must include only letters");
  //#end region kind validation

  //#region kind validation
  name = trimAndRemoveSpaces(name);
  if (!name) throw new RequiredParameterError("name");
  // if (!isNumeric(name)) throw new InvalidPropertyError('name must include only letters');
  //#end region name validation

  return Object.freeze({
    kind,
    name,
  });
}
export default makeNotificationMethod;
