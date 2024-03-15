import userTypesModelNamesEnum from "../types/userTypesModelNames.enum.js";
import { isValidUrl, isStrongPassword, isObjectId, isEmail, isStringPath } from "../helper/validation.js";
import { hashPassword } from "../helper/password-hash.js";
import { trimAndRemoveSpaces, toBoolean } from "../helper/helper.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";
import notificationTypeEnum from "../types/notificationType.enum.js";
import notificationMethodEnum from "../types/notificationMethod.enum.js";

async function makeUser({
  _id,
  email,
  password,
  subModel,
  socialMediaLinks,
  notificationSettings,
  model,
  country,
  province,
  city,
  verified = false,
  profileImage,
  approved = false,
  isUpdate,
  passwordResetToken,
  verificationToken,
  newUpdate = false,
  completed = false,
}) {
  //#region _id validation
  if (typeof _id === "string") {
    _id = trimAndRemoveSpaces(_id);
  }
  if (!_id) throw new RequiredParameterError("_id");
  if (!isObjectId(_id)) throw new InvalidPropertyError("enter a valid student ID");
  //#endregion _id validation

  //#region model validation
  model = trimAndRemoveSpaces(model);
  if (!model) throw new RequiredParameterError("model");
  if (!Object.values(userTypesModelNamesEnum).includes(model)) throw new InvalidPropertyError("enter a valid user type model");
  //#endregion model validation

  //#region subModel validation
  subModel = trimAndRemoveSpaces(subModel);
  if (!subModel) throw new RequiredParameterError("sub model");
  if (!isObjectId(subModel)) throw new InvalidPropertyError("sub model should only contain sub model ID");
  //#endregion subModel validation

  //#region email validation
  email = trimAndRemoveSpaces(email);
  email = email.toLowerCase();
  if (!email) throw new RequiredParameterError("email");
  if (!isEmail(email)) throw new InvalidPropertyError("enter a valid email");
  //#endregion email validation

  //#region verified validation
  if (verified) {
    verified = toBoolean(verified);
    if (typeof verified !== "boolean") throw new InvalidPropertyError("enter a valid verified");
  }
  //#endregion verified validation

  //#region approved validation
  if (approved) {
    approved = toBoolean(approved);
    if (typeof approved !== "boolean") throw new InvalidPropertyError("enter a valid approved");
  }
  //#endregion approved validation

  //#region password validation
  if (!isUpdate) {
    password = trimAndRemoveSpaces(password);
    if (!password) throw new RequiredParameterError("password");
    if (!isStrongPassword(password)) throw new InvalidPropertyError("enter a valid password");
    password = await hashPassword(password);
  }
  //#endregion password validation

  //#region profileImage validation
  if (profileImage) {
    profileImage = trimAndRemoveSpaces(profileImage);
    if (!isStringPath(profileImage)) throw new InvalidPropertyError("profile image should only contain path");
  }
  //#endregion profileImage validation

  //#region country validation
  country = trimAndRemoveSpaces(country);
  if (!country) throw new RequiredParameterError("country");
  if (!isObjectId(country)) throw new InvalidPropertyError("enter a valid country ID");
  //#province validation
  province = trimAndRemoveSpaces(province);
  if (!province) throw new RequiredParameterError("province");
  if (!isObjectId(province)) throw new InvalidPropertyError("enter a valid province ID");

  //#region city validation
  city = trimAndRemoveSpaces(city);
  if (!city) throw new RequiredParameterError("city");
  if (!isObjectId(city)) throw new InvalidPropertyError("enter a valid city ID");
  //#endregion city validation

  //#region socialMedia links
  if (socialMediaLinks) {
    for (let i = 0; i < socialMediaLinks?.length; i++) {
      socialMediaLinks[i].socialMedia = trimAndRemoveSpaces(socialMediaLinks[i].socialMedia);
      if (!socialMediaLinks[i].socialMedia) throw new RequiredParameterError("social media is required");
      if (!isObjectId(socialMediaLinks[i].socialMedia)) throw new InvalidPropertyError("social media link must enter a valid social media");

      for (let j = 0; j < socialMediaLinks[i].url.length; j++) {
        if (typeof socialMediaLinks[i].url[j] === "string") socialMediaLinks[i].url[j] = trimAndRemoveSpaces(socialMediaLinks[i].url[j]);
        socialMediaLinks[i].url[j] = socialMediaLinks[i].url[j].toLowerCase();
        if (!socialMediaLinks[i].url[j]) throw new RequiredParameterError("social media url");
        if (!isValidUrl(socialMediaLinks[i].url[j])) throw new InvalidPropertyError("Social media is invalid, please enter valid URLs starting with 'http://' or 'https://.  For example: 'http://www.example.com'");
      }
    }
  }
  //#endregion socialMedia links

  //#region notificationSettings validation

  // validates that the notification settings doesn't have duplicates and are included in there enums(both types and methods)

  if (notificationSettings && notificationSettings.length > 0) {
    let notificationTypesAcc = [];

    for (let i = 0; i < notificationSettings.length; i++) {
      let notificationMethodsAcc = [];

      // validate that the value is included in it's enum
      if (!Object.values(notificationTypeEnum).includes(notificationSettings[i].notificationType))
        throw new Error("enter a valid notification type value");

      // making sure that the value is not duplicated because the value I check I add it in the notificationTypesAcc array
      if (notificationTypesAcc.includes(notificationSettings[i].notificationType))
        throw new Error("notification settings can't have duplicate values");

      //pushes the value to the accumulation array to check for data redundancy
      notificationTypesAcc.push(notificationSettings[i].notificationType);

      //validate the notification methods same as the notification type
      for (let j = 0; j < notificationSettings[i].notificationMethod.length; j++) {
        // validate that the value is included in it's enum
        if (!Object.values(notificationMethodEnum).includes(notificationSettings[i].notificationMethod[j]))
          throw new Error("enter a valid notification type value");

        // making sure that the value is not duplicated because the value I check I add it in the notificationMethodsAcc array
        if (notificationMethodsAcc.includes(notificationSettings[i].notificationMethod[j]))
          throw new Error("notification settings can't have duplicate values");

        //pushes the value to the accumulation array to check for data redundancy
        notificationMethodsAcc.push(notificationSettings[i].notificationMethod[j]);
      }
    }
  }


  if (completed) {
    completed = toBoolean(completed);
  }

  //#endregion notificationSettings validation


if(newUpdate){
  newUpdate = toBoolean(newUpdate);
}

  return Object.freeze({
    _id,
    email,
    password,
    model,
    subModel,
    socialMediaLinks,
    country,
    province,
    city,
    verified,
    notificationSettings,
    profileImage,
    approved,
    passwordResetToken,
    verificationToken,
    newUpdate,
    completed,
  });
}

export default makeUser;
