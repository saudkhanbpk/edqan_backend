import { trimAndRemoveSpaces } from "../helper/helper.js";
import { isAlphaNumeric, isNumeric, isStringPath, isObjectId, isEmail } from "../helper/validation.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";
import InstitutionPrivacyEnum from "../types/institutionPrivacy.enum.js";

function makeInstitution({
  _id,
  name,
  logo,
  banner,
  background,
  schoolUrl,
  user,
  accountVisibility = InstitutionPrivacyEnum.COMMUNITY,
  careerAdvisingPhone,
  careerAdvisingLocation,
  careerAdvisingEmail,
  addresses,
}) {
  //#region _id validation
  if (typeof _id === "string") {
    _id = trimAndRemoveSpaces(_id);
  }
  if (!_id) throw new RequiredParameterError("_id");
  if (!isObjectId(_id)) throw new InvalidPropertyError("enter a valid student ID");
  //#endregion _id validation

  //#region name validation
  name = trimAndRemoveSpaces(name);
  if (!name) throw new RequiredParameterError("name");
  if (!isAlphaNumeric(name)) throw new InvalidPropertyError("name should only contain letters and numbers");
  //#endregion name validation

  //#region background validation
  background = trimAndRemoveSpaces(background);
  if (!background) {
    throw new RequiredParameterError("background");
  }
  if (!isAlphaNumeric(background)) throw new InvalidPropertyError("background should only contain letters and numbers");
  //#endregion background validation

  //#region addresses validation
  if (addresses) {
    for (let i = 0; i < addresses.length; i++) {
      addresses[i] = addresses[i];
      if (!addresses[i]) throw new RequiredParameterError("addresses");
    }
  }
  //#endregion addresses validation

  //#region logo validation
  logo = trimAndRemoveSpaces(logo);
  if (!logo) {
    throw new RequiredParameterError("logo");
  }
  if (!isStringPath(logo)) {
    throw new InvalidPropertyError("logo must include only logo");
  }
  //#endregion logo validation

  //#region banner validation
  banner = trimAndRemoveSpaces(banner);
  if (!banner) {
    throw new RequiredParameterError("banner");
  }
  if (!isStringPath(banner)) {
    throw new InvalidPropertyError("banner must include only banner");
  }
  //#endregion banner validation

  //#region schoolUrl validation
  if (schoolUrl) {
    schoolUrl = trimAndRemoveSpaces(schoolUrl);
  }
  //#endregion schoolUrl validation

  // //#region city validation
  // if (typeof city === 'string') city = trimAndRemoveSpaces(city);
  // if (!city) {
  //     throw new RequiredParameterError('city');
  // }
  // if (!isObjectId(city)) {
  //     throw new InvalidPropertyError('city must include a city ID');
  // }
  // //#endregion city validation

  // //#region phoneNumber validation
  // phoneNumber = trimAndRemoveSpaces(phoneNumber);
  // if (!phoneNumber) {
  //   throw new RequiredParameterError("phone number");
  // }
  // if (!isNumeric(phoneNumber)) {
  //   throw new InvalidPropertyError("phone number must be a number");
  // }
  // //#endregion phoneNumber validation

  //#region careerAdvisingPhone validation
  careerAdvisingPhone = trimAndRemoveSpaces(careerAdvisingPhone);
  if (!careerAdvisingPhone) {
    throw new RequiredParameterError("career advising phone number");
  }
 
  //#endregion careerAdvisingPhone validation

  //#region careerAdvisingLocation validation

  //country
  careerAdvisingLocation.country = trimAndRemoveSpaces(careerAdvisingLocation.country);
  if (!careerAdvisingLocation.country) {
    throw new RequiredParameterError("career advising location");
  }
  if (!isAlphaNumeric(careerAdvisingLocation.country)) {
    throw new InvalidPropertyError("career advising  location");
  }

  //city
  careerAdvisingLocation.city = trimAndRemoveSpaces(careerAdvisingLocation.city);
  if(careerAdvisingLocation.city==null)throw new RequiredParameterError("career advising location");

  if (!careerAdvisingLocation.city) {
    throw new RequiredParameterError("career advising location");
  }
  if (!isAlphaNumeric(careerAdvisingLocation.city)) {
    throw new InvalidPropertyError("career advising  location");
  }
  //#endregion careerAdvisingLocation validation

  //#region careerAdvisingEmail validation
  if (careerAdvisingEmail) {
    careerAdvisingEmail = trimAndRemoveSpaces(careerAdvisingEmail);
    if (!isEmail(careerAdvisingEmail)) throw new InvalidPropertyError("enter a valid careerAdvisingEmail");
  }
  //#endregion email validation

  //  /**
  //  *
  //  * !help tawfik nofitication
  //  */
  // //#region notification validation
  // if (typeof notification === 'string') notification = trimAndRemoveSpaces(notification);
  // if (!notification) {
  //     throw new RequiredParameterError('notification');
  // }
  // if (!isObjectId(notification)) {
  //     throw new InvalidPropertyError('notification must include a notification ID');
  // }
  //#endregion notification validation

  //#region user validation
  if (typeof user === "string") user = trimAndRemoveSpaces(user);
  if (!user) {
    throw new RequiredParameterError("user");
  }
  if (!isObjectId(user)) {
    throw new InvalidPropertyError("user must include a user ID");
  } //#endregion headQuarters validation

  //#region privacy validation
  accountVisibility = trimAndRemoveSpaces(accountVisibility);
  if (!accountVisibility) throw new RequiredParameterError("account visibility");
  if (!Object.values(InstitutionPrivacyEnum).includes(accountVisibility)) throw new InvalidPropertyError("enter a valid account visibility");
  //#endregion accountVisibility validation

  return Object.freeze({
    _id,
    name,
    logo,
    banner,
    background,
    schoolUrl,
    // city,
    // notification,
    addresses,
    user,
    accountVisibility,
    careerAdvisingPhone,
    careerAdvisingLocation,
    careerAdvisingEmail,
  });
}
export default makeInstitution;
