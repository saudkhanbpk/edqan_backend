import { isAlphaNumeric, isNumeric, isObjectId, isStringPath, isValidUrl, isValidDate, nullify } from "../helper/validation.js";
import { trimAndRemoveSpaces, toBoolean } from "../helper/helper.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";
import genderEnum from "../types/gender.enum.js";
import accountVisibilityEnum from "../types/accountVisibility.enum.js";

function makeMentor({
  firstName = undefined,
  middleName = undefined,
  lastName = undefined,
  majors = undefined,
  profileImage = undefined,
  almaMater = null,
  coverImage = undefined,
  linkedInUrl = undefined,
  company = undefined,
  mentorShipTypes = undefined,
  mentoringLanguages = undefined,
  industries = undefined,
  phoneNumber = undefined,
  addresses = undefined,
  featuredAsPublic = undefined,
  gender = undefined,
  mentoringProgramPart = undefined,
  agreeToTerms = undefined,
  user = undefined,
  guideLines = undefined,
  // availabilityTime=undefined,
  currentTitle = undefined,
  about = undefined,
  _id = undefined,
  countries = undefined,
  // enrolledInHighSchool=undefined,
  educationLevel = null,
  graduationDate = undefined,
  areaOfInterest = undefined,
  rating = undefined,
  video = undefined,
  // major,
  accountVisibility = accountVisibilityEnum.COMMUNITY,
}) {
  //#region _id validation
  if (_id) {
    if (typeof _id === "string") {
      _id = trimAndRemoveSpaces(_id);
    }
    if (!_id) throw new RequiredParameterError("_id");
    if (!isObjectId(_id)) throw new InvalidPropertyError("enter a valid student ID");
  }
  //#endregion _id validation

  //#region firstName validation
  firstName = trimAndRemoveSpaces(firstName);
  if (!firstName) throw new RequiredParameterError("first name");

  //#endregion firstName validation

  //#region currentTitle validation
  currentTitle = trimAndRemoveSpaces(currentTitle);
  if (!currentTitle) throw new RequiredParameterError("current title");

  //#endregion firstName validation

  //#region about validation
  about = trimAndRemoveSpaces(about);
  if (!about) throw new RequiredParameterError("about");
  if (!isAlphaNumeric(about)) throw new InvalidPropertyError("about should only contain letters and numbers");
  //#endregion firstName validation

  //#region middleName validation
  if (middleName) {
    if (middleName == "undefined") middleName = undefined; // when it's first created it has the 'undefined' string as a value
    else middleName = trimAndRemoveSpaces(middleName);
  }
  //#endregion middleName validation

  //#region lastName validation
  lastName = trimAndRemoveSpaces(lastName);
  if (!lastName) throw new RequiredParameterError("last name");

  //#endregion lastName validation

  // //#region profileImage validation
  // if (profileImage) {
  //   profileImage = trimAndRemoveSpaces(profileImage);
  //   if (!isStringPath(profileImage))
  //     throw new InvalidPropertyError(
  //       "profile image should only contain path"
  //     );
  // }
  // //#endregion profileImage validation

  //#region almaMater validation
  almaMater = nullify(almaMater);
  if (almaMater) {
    almaMater = trimAndRemoveSpaces(almaMater);
    if (!isObjectId(almaMater)) throw new InvalidPropertyError("almaMater should only contain letters and numbers");
  }
  //#endregion almaMater validation

  //#region coverImage validation
  if (coverImage) {
    coverImage = trimAndRemoveSpaces(coverImage);
    if (!isStringPath(coverImage)) throw new InvalidPropertyError("cover image should only contain path");
  }
  //#endregion profileImage validation

  //#region linkedInUrl validation
  linkedInUrl = trimAndRemoveSpaces(linkedInUrl);
  //to lower case
  linkedInUrl = linkedInUrl.toLowerCase();
  if (!linkedInUrl) throw new RequiredParameterError("linkedIn url");
  if (!isValidUrl(linkedInUrl))
    throw new InvalidPropertyError("Please provide the URL in correct format with 'http://' or 'https://' and no spaces or special characters");
  //#endregion linkedInUrl validation

  //#region video validation
  if (video) {
    if (video == "undefined") video = undefined; // when it's first created it has the 'undefined' string as a value
    else {
      video = trimAndRemoveSpaces(video);
      if (!video) throw new RequiredParameterError("video url");
      if (!isValidUrl(video))
        throw new InvalidPropertyError(
          "Please provide the video URL in correct format with 'http://' or 'https://' and no spaces or special characters"
        );
    }
  }
  //#endregion video validation

  //#region countries validation
  if (countries) {
    for (let i = 0; i < countries.length; i++) {
      countries[i] = trimAndRemoveSpaces(countries[i]);
      if (!countries[i]) throw new RequiredParameterError("countries is required");
      if (!isObjectId(countries[i])) throw new InvalidPropertyError("enter a valid countries");
    }
  }
  //#endregion countries validation
  //#region company validation
  if (company) {
    company = trimAndRemoveSpaces(company);
  }
  //#endregion company validation
  //#region availabilityTime validation
  // if (availabilityTime) {
  //   for (let i = 0; i < availabilityTime.length; i++) {
  //     availabilityTime[i].date = trimAndRemoveSpaces(availabilityTime[i].date);
  //     if (!availabilityTime[i].date) throw new RequiredParameterError("mentor availabilityTime date");
  //     availabilityTime[i].date = new Date(availabilityTime[i].date).toISOString();
  //     if (!isValidDate(availabilityTime[i].date)) throw new InvalidPropertyError("enter a valid availabilityTime date");
  //   }
  // }
  //#endregion availabilityTime validation

  //#region rate validation
  if (rating) {
    rating = trimAndRemoveSpaces(rating);
    // if (!rating) throw new RequiredParameterError('mentor rating rate');
    if (!isNumeric(rating)) throw new InvalidPropertyError("mentor rating rate should only contain numbers");
  }
  //#endregion rate validation
  //#region mentorShipTypes validation
  if (mentorShipTypes) {
    for (let i = 0; i < mentorShipTypes.length; i++) {
      mentorShipTypes[i] = trimAndRemoveSpaces(mentorShipTypes[i]);
      if (!mentorShipTypes[i]) throw new RequiredParameterError(" mentor ship type");
      if (!isObjectId(mentorShipTypes[i])) throw new InvalidPropertyError("mentorShipTypes should only contain letters and numbers");
    }
  }
  //#endregion mentorShipTypes validation

  //#region mentoringLanguages validation
  if (mentoringLanguages) {
    for (let i = 0; i < mentoringLanguages.length; i++) {
      mentoringLanguages[i] = trimAndRemoveSpaces(mentoringLanguages[i]);
      if (!mentoringLanguages[i]) throw new RequiredParameterError("mentoring language");
      if (!isObjectId(mentoringLanguages[i])) throw new InvalidPropertyError("enter a valid language ");
    }
  }
  //#endregion mentoringLanguages validation

  //#region industries validation
  for (let i = 0; i < industries.length; i++) {
    industries[i] = trimAndRemoveSpaces(industries[i]);
    if (!industries[i]) throw new RequiredParameterError("industries");
    if (!isObjectId(industries[i])) throw new InvalidPropertyError("enter a valid industry");
  }
  //#endregion industries validation

  //#region phoneNumber validation
  if (phoneNumber) {
    phoneNumber = trimAndRemoveSpaces(phoneNumber);
    if (!phoneNumber) throw new RequiredParameterError("mentor phone number");
    if (!isNumeric(phoneNumber)) throw new InvalidPropertyError("mentor phone number should only contain numbers");
  }
  //#endregion phoneNumber validation

  //#region addresses validation
  if (addresses) {
    for (let i = 0; i < addresses.length; i++) {
      addresses[i] = trimAndRemoveSpaces(addresses[i]);
      if (!addresses[i]) throw new RequiredParameterError("address");
      if (!isAlphaNumeric(addresses[i])) throw new InvalidPropertyError("address should only contain letters and numbers");
    }
  }
  //#endregion addresses validation

  for (let i = 0; i < majors?.length; i++) {
    if (!majors[i]) throw new RequiredParameterError("major");

    majors[i] = trimAndRemoveSpaces(majors[i]);
    if (!majors[i]) throw new RequiredParameterError("mentor ship type");
    if (!isObjectId(majors[i])) throw new InvalidPropertyError("enter a valid major");
  }
  //#region enrolledInHighSchool validation
  // if (enrolledInHighSchool) {
  //   enrolledInHighSchool = toBoolean(enrolledInHighSchool);
  //   if (typeof enrolledInHighSchool !== "boolean") throw new InvalidPropertyError("enter a valid enrolled in high school");
  // }
  //#endregion enrolledInHighSchool validation

  //#region educationLevel validation

  //#endregion educationLevel validation

  //#region majors validation
  // major = trimAndRemoveSpaces(major);
  // if (!isObjectId(major)) throw new InvalidPropertyError("major should only contain major ID");

  //#endregion majors validation

  if (educationLevel) {
    educationLevel = trimAndRemoveSpaces(educationLevel);
    if (!isObjectId(educationLevel)) throw new InvalidPropertyError("enter a valid education level");
  }

  /////////
  // area of interest is shown as tell us how you want to mentor in the front end
  ////////
  if (!areaOfInterest) throw new RequiredParameterError("Tell us how you want to mentor");
  //#region areaOfInterest validation
  for (let i = 0; i < areaOfInterest.length; i++) {
    areaOfInterest[i] = trimAndRemoveSpaces(areaOfInterest[i]);
    if (!areaOfInterest[i]) throw new RequiredParameterError("Tell us how you want to mentor");
    if (!isObjectId(areaOfInterest[i]))
      throw new InvalidPropertyError("Tell us how you want to mentor should only contain Tell us how you want to mentor ID");
  }

  //#endregion areaOfInterest validation

  //#region graduationDate validation
  //TODO: check if we need to make a validation about the duration of the graduation

  if (graduationDate == undefined) {
    graduationDate = null;
  }

  if (graduationDate) {
    graduationDate = new Date(graduationDate);
    if (!isValidDate(graduationDate)) throw new InvalidPropertyError("enter a valid date");
  }
  //#endregion graduationDate validation

  //#region featuredAsPublic validation
  if (featuredAsPublic) {
    featuredAsPublic = toBoolean(featuredAsPublic);
    if (typeof featuredAsPublic !== "boolean") throw new InvalidPropertyError("enter a valid featured as public");
  }
  //#endregion featuredAsPublic validation

  //#region gender validation
  gender = trimAndRemoveSpaces(gender);
  if (!gender) throw new RequiredParameterError("gender");
  gender = gender.toLowerCase();
  if (!Object.values(genderEnum).includes(gender)) throw new InvalidPropertyError("enter a valid gender");
  //#endregion gender validation

  //#region agreeToTerms validation
  agreeToTerms = toBoolean(agreeToTerms);
  if (typeof agreeToTerms !== "boolean") throw new InvalidPropertyError("enter a valid agree to terms");
  //#endregion agreeToTerms validation

  //#region guideLines validation
  if (guideLines) {
    guideLines = toBoolean(guideLines);
    if (typeof guideLines !== "boolean") throw new InvalidPropertyError("enter a valid agree to guideLines");
  }
  //#endregion guideLines validation

  //#region user validation
  user = trimAndRemoveSpaces(user);
  if (!user) throw new RequiredParameterError("mentor user ID");
  if (!isObjectId(user)) throw new InvalidPropertyError("enter a valid user ID");
  //#endregion user validation

  //#region accountVisibility validation
  if (accountVisibility) {
    accountVisibility = trimAndRemoveSpaces(accountVisibility);
    //to lowercase
    accountVisibility = accountVisibility.toLowerCase();
    if (!accountVisibility) throw new RequiredParameterError("account visibility");
    if (!Object.values(accountVisibilityEnum).includes(accountVisibility)) throw new InvalidPropertyError("enter a valid account visibility");
  }
  //#endregion accountVisibility validation

  //#region mentoringProgramPart validation
  //table mentoringProgramOption
  if (mentoringProgramPart) {
    mentoringProgramPart = trimAndRemoveSpaces(mentoringProgramPart);
    if (!mentoringProgramPart) throw new RequiredParameterError("mentor mentoringProgramPart ID");
    if (!isAlphaNumeric(mentoringProgramPart)) throw new InvalidPropertyError("mentoringProgramPart should only contain letters and numbers");
  }
  //#endregion mentoringProgramPart validation

  return Object.freeze({
    firstName,
    middleName,
    lastName,
    profileImage,
    coverImage,
    linkedInUrl,
    company,
    mentorShipTypes,
    mentoringLanguages,
    industries,
    phoneNumber,
    addresses,
    featuredAsPublic,
    gender,
    mentoringProgramPart,
    agreeToTerms,
    user,
    guideLines,
    _id,
    currentTitle,
    about,
    almaMater,
    // availabilityTime,
    countries,
    // enrolledInHighSchool,
    educationLevel,
    majors,
    graduationDate,
    areaOfInterest,
    rating,
    video,
    // major,
    accountVisibility,
  });
}
export default makeMentor;
