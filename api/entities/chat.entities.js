import { trimAndRemoveSpaces } from "../helper/helper.js";
import { isObjectId } from "../helper/validation.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";

function makeChat({ user1, user2 }) {
  //#region user1 validation
  if (typeof user1 === "string") user1 = trimAndRemoveSpaces(user1);
  if (!user1) {
    throw new RequiredParameterError("User");
  }
  if (!isObjectId(user1)) {
    throw new InvalidPropertyError("user1 must include a user1 ID");
  }
  //#endregion user1 validation
  //#region user2 validation
  if (typeof user2 === "string") user2 = trimAndRemoveSpaces(user2);
  if (!user2) {
    throw new RequiredParameterError("User");
  }
  if (!isObjectId(user2)) {
    throw new InvalidPropertyError("user2 must include a user2 ID");
  }
  //#endregion user2 validation

  return Object.freeze({
    user1,
    user2,
  });
}
export default makeChat;
