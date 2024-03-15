import { trimAndRemoveSpaces } from "../helper/helper.js";
import { isNumeric } from "../helper/validation.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";

function makeMeetingDuration({ durationMinutes }) {
  //#region durationMinutes validation
  if (typeof durationMinutes === "string") durationMinutes = trimAndRemoveSpaces(durationMinutes);
  if (!durationMinutes) {
    throw new RequiredParameterError("durationMinutes");
  }
  if (!isNumeric(durationMinutes)) {
    throw new InvalidPropertyError("durationMinutes must include only numbers");
  }
  //#end region durationMinutes validation

  return Object.freeze({
    durationMinutes,
  });
}
export default makeMeetingDuration;
