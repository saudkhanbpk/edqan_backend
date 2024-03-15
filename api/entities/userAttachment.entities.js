import { isObjectId, isStringPath, isValidDate, isAlphaNumeric } from "../helper/validation.js";
import { trimAndRemoveSpaces, toBoolean } from "../helper/helper.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";
import userAttachmentTypeEnum from "../types/userAttachmentType.enum.js";
import userAttachmentStatusEnum from "../types/userAttachmentStatus.enum.js";

function makeUserAttachment({ name, attachmentType, attachment, dateUploaded, status, visibility, user }) {
  name = trimAndRemoveSpaces(name);
  if (!name) throw new RequiredParameterError("name");
  if (!isAlphaNumeric(name)) throw new InvalidPropertyError("name should only contain letters and numbers");

  //#region attachmentType validation
  attachmentType = trimAndRemoveSpaces(attachmentType);
  if (!attachmentType) throw new RequiredParameterError("attachmentType");
  if (!Object.values(userAttachmentTypeEnum).includes(attachmentType)) throw new InvalidPropertyError("enter a valid attachment type");
  //#endregion attachmentType validation

  //#region attachment validation
  attachment = trimAndRemoveSpaces(attachment);
  if (!attachment) throw new RequiredParameterError("attachment");
  if (!isStringPath(attachment)) throw new InvalidPropertyError("attachment should only contain path");
  //#endregion attachment validation

  //#region dateUploaded validation
  if (!dateUploaded) throw new RequiredParameterError("dateUploaded"); //TODO: check if I need to validate the date to be not earlier than the current date
  if (!isValidDate(dateUploaded)) throw new InvalidPropertyError("enter a valid date");
  //#endregion dateUploaded validation

  //#region status validation
  status = trimAndRemoveSpaces(status);
  if (!status) throw new RequiredParameterError("status");
  if (!Object.values(userAttachmentStatusEnum).includes(status)) throw new InvalidPropertyError("enter a valid status");
  //#endregion status validation

  //#region visibility validation
  visibility = toBoolean(visibility);
  //#endregion visibility validation

  //#region user validation
  user = trimAndRemoveSpaces(user);
  if (!user) throw new RequiredParameterError("user");
  if (!isObjectId(user)) throw new InvalidPropertyError("user should only contain user ID");
  //#endregion user validation

  return Object.freeze({
    name,
    attachmentType,
    attachment,
    dateUploaded,
    status,
    visibility,
    user,
  });
}
export default makeUserAttachment;
