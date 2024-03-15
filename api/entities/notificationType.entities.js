import { isNumeric } from "../helper/validation.js";
import { trimAndRemoveSpaces, toBoolean } from "../helper/helper.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";
import userTypesModelNamesEnum from "../types/userTypesModelNames.enum.js";

function makeNotificationType({ kind, name, message, isMandatory, models }) {
  //#region kind validation
  kind = trimAndRemoveSpaces(kind);
  if (!kind) throw new RequiredParameterError("kind");
  if (!isNumeric(kind)) throw new InvalidPropertyError("kind must include only letters");
  //#end region kind validation

  //#region name validation
  name = trimAndRemoveSpaces(name);
  if (!name) throw new RequiredParameterError("name");
  // if (!isNumeric(name)) throw new InvalidPropertyError('name must include only letters');
  //#end region name validation

  //#region message validation
  message = trimAndRemoveSpaces(message);
  if (!message) throw new RequiredParameterError("message");
  // if (!isNumeric(message)) throw new InvalidPropertyError('message must include only letters');
  //#end region message validation

  //#region isMandatory validation
  isMandatory = toBoolean(isMandatory);
  //#end region isMandatory validation

  //#region models validation
  if (!Array.isArray(models)) throw new RequiredParameterError("models");
  if (!models.every((v) => Object.values(userTypesModelNamesEnum).includes(v))) throw new InvalidPropertyError("enter a valid models");
  //#end region models validation

  return Object.freeze({
    kind,
    name,
    message,
    isMandatory,
    models,
  });
}
export default makeNotificationType;
