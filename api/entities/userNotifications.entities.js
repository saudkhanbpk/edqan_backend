import { isAlphaNumeric, isValidUrl, isObjectId } from "../helper/validation.js";
import { trimAndRemoveSpaces } from "../helper/helper.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";
import notificationStatusEnum from "../types/notificationStatus.enum.js";

function makeUserNotification({ notifications, user }) {
  //#region notifications validation
  if (notifications) {
    for (let i = 0; i < notifications.length; i++) {
      //#region text validation
      notifications[i].text = trimAndRemoveSpaces(notifications[i].text);
      if (!notifications[i].text) throw new RequiredParameterError("notifications text");
      if (!isAlphaNumeric(notifications[i].text)) throw new InvalidPropertyError("notifications text should only contain letters and numbers");
      //#endregion text validation

      //#region notificationLink validation
      notifications[i].notificationLink = trimAndRemoveSpaces(notifications[i].notificationLink);
      if (!isValidUrl(notifications[i].notificationLink)) throw new InvalidPropertyError("notificationLink should only contain url");
      //#endregion notificationLink validation

      //#region status validation
      notifications[i].status = trimAndRemoveSpaces(notifications[i].status);
      if (!notifications[i].status) throw new RequiredParameterError("status");
      if (!Object.values(notificationStatusEnum).includes(notifications[i].status)) throw new InvalidPropertyError("enter a valid status");
      //#endregion status validation
    }
  }
  //#endregion notifications validation

  //#region user validation
  user = trimAndRemoveSpaces(user);
  if (!user) throw new RequiredParameterError("user");
  if (!isObjectId(user)) throw new InvalidPropertyError("user should only contain user ID");
  //#endregion user validation

  return Object.freeze({
    notifications,
    user,
  });
}
export default makeUserNotification;
