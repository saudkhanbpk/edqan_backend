import { isObjectId, isAlphaNumeric, isStringPath } from "../helper/validation.js";
import { trimAndRemoveSpaces } from "../helper/helper.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";
import messageStatusEnum from "../types/messageStatus.enum.js";

function makeMessage({ message, chat, attachment, job, sender, receiver, status }, creationMode) {
  //#region message validation
  message = trimAndRemoveSpaces(message);
  if (!message) throw new RequiredParameterError("message");
  if (!isAlphaNumeric(message)) throw new InvalidPropertyError("message should only contain letters and numbers");
  //#endregion message validation

  //#region chat validation
  chat = trimAndRemoveSpaces(chat);
  if (!chat) throw new RequiredParameterError("chat");
  if (chat && !isObjectId(chat)) throw new InvalidPropertyError("enter a valid chat ID");
  //#endregion chat validation

  //#region job validation
  if(job){
    for(let i = 0; i < job.length; i++){
      job[i] = trimAndRemoveSpaces(job[i]);
      if (!isObjectId(job[i])) throw new InvalidPropertyError("Enter valid job ID");
    }
  }
  // if (!job) throw new RequiredParameterError('job');
  //#endregion job validation

  //#region sender validation
  if (typeof sender === "string") sender = trimAndRemoveSpaces(sender);
  if (!sender) {
    throw new RequiredParameterError("sender");
  }
  if (!isObjectId(sender)) {
    throw new InvalidPropertyError("sender must include a sender ID");
  }
  //#endregion sender validation

  //#region receiver validation
  if (typeof receiver === "string") receiver = trimAndRemoveSpaces(receiver);
  if (!receiver) {
    throw new RequiredParameterError("receiver");
  }
  if (!isObjectId(receiver)) {
    throw new InvalidPropertyError("receiver must include a receiver ID");
  }
  //#endregion receiver validation

  //#region attachment validation
  if (attachment) {
    for (let i = 0; i < attachment.length; i++) {
      attachment[i] = trimAndRemoveSpaces(attachment[i]);
      // if (!attachment[i]) throw new RequiredParameterError("first attachment");
      if (!isStringPath(attachment[i])) throw new InvalidPropertyError("attachment should only contain valid path");
      attachment[i] = attachment[i].toLowerCase();
    }
  }
  //#endregion attachment validation

  //#region status validation
  if (creationMode) status = messageStatusEnum.DELIVERED;
  status = trimAndRemoveSpaces(status);
  // if (!status) throw new RequiredParameterError('message status');
  if (!Object.values(messageStatusEnum).includes(status)) throw new InvalidPropertyError("enter a valid message status");
  //#endregion status validation

  return Object.freeze({
    message,
    chat,
    attachment,
    job,
    sender,
    receiver,
    status,
  });
}
export default makeMessage;
