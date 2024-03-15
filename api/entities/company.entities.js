import { trimAndRemoveSpaces, toBoolean } from "../helper/helper.js";
import { isAlphaNumeric, isNumeric, isStringPath, isObjectId, isValidUrl } from "../helper/validation.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";
import CompanyAccountVisibilityEnum from "../types/companyAccountVisibility.enum.js";

function makeCompany({
  _id,
  name,
  logo,
  coverPhoto,
  webSite,
  industries,
  phoneNumber,
  headQuarters,
  user,
  addresses,
  accountVisibility = CompanyAccountVisibilityEnum.PUBLIC,
  companyMedia,
  receiveMessage=true,
  guideLines=true,
  agreeToTerms=null,
  background,
  jobApplicationMessages,
  companySize,
}) {
  //#region _id validation
  if (typeof _id === "string") {
    _id = trimAndRemoveSpaces(_id);
  }
  if (!_id) throw new RequiredParameterError("_id");
  if (!isObjectId(_id)) throw new InvalidPropertyError("enter a valid student ID");
  //#endregion _id validation

  //#region jobApplicationMessages validation

  if (jobApplicationMessages) {
    //#region jobApplicationMessages.received
    jobApplicationMessages.received = trimAndRemoveSpaces(jobApplicationMessages?.received);
    //#endregion jobApplicationMessages.received

    //#region jobApplicationMessages.hired
    jobApplicationMessages.hired = trimAndRemoveSpaces(jobApplicationMessages?.hired);
    //#endregion jobApplicationMessages.hired

    //#region jobApplicationMessages.notSelected
    jobApplicationMessages.notSelected = trimAndRemoveSpaces(jobApplicationMessages?.notSelected);
    //#endregion jobApplicationMessages.notSelected
  }

  //#endregion jobApplicationMessages validation

  //#region name validation
  name = trimAndRemoveSpaces(name);
  if (!name) throw new RequiredParameterError("first name");
  if (!isAlphaNumeric(name)) throw new InvalidPropertyError("Company/organization name field is required");
  //#endregion name validation

  //#region logo validation
  if (logo) {
    logo = trimAndRemoveSpaces(logo);
    if (!logo) {
      throw new RequiredParameterError("logo");
    }
    if (!isStringPath(logo)) {
      throw new InvalidPropertyError("logo must include only image");
    }
  }
  //#endregion logo validation

  //#region coverPhoto validation
  if (coverPhoto) {
    coverPhoto = trimAndRemoveSpaces(coverPhoto);
    if (!coverPhoto) {
      throw new RequiredParameterError("coverPhoto");
    }
    if (!isStringPath(coverPhoto)) {
      throw new InvalidPropertyError("coverPhoto must include only image");
    }
  } //#endregion coverPhoto validation

  //#region webSite validation
  webSite = trimAndRemoveSpaces(webSite);
  webSite = webSite.toLowerCase();
  if (!webSite) throw new RequiredParameterError("website url");
  if (!isValidUrl(webSite)){
    throw new InvalidPropertyError(
      "Please provide the website URL in correct format with 'http://' or 'https://' and no spaces or special characters"
    );
}
  //#endregion webSite validation

  //#region phoneNumber validation
  phoneNumber = trimAndRemoveSpaces(phoneNumber);
  if (!phoneNumber) {
    throw new RequiredParameterError("phone number");
  }
  //#endregion phoneNumber validation

  //#region companySize validation
  companySize = trimAndRemoveSpaces(companySize);
  if (!companySize) {
    throw new RequiredParameterError("employers number");
  }
  if (!isNumeric(companySize)) {
    throw new InvalidPropertyError("employers number must be a number");
  }
  //#endregion companySize validation

  //#region headQuarters validation
  if (headQuarters) {
    headQuarters.country = trimAndRemoveSpaces(headQuarters.country);
    if (!headQuarters.country) throw new RequiredParameterError("head quarters country");
    if (!isObjectId(headQuarters.country)) throw new InvalidPropertyError("enter a valid Head quarters country ID");
    headQuarters.city = trimAndRemoveSpaces(headQuarters.city);
    if (!headQuarters.city) throw new RequiredParameterError("head quarters city");
    if (!isObjectId(headQuarters.city)) throw new InvalidPropertyError("enter a valid Head quarters city ID");
  }

  //#endregion headQuarters validation

  //#region user validation
  user = trimAndRemoveSpaces(user);
  if (!user) {
    throw new RequiredParameterError("user");
  }
  if (!isObjectId(user)) {
    throw new InvalidPropertyError("user must include a user ID");
  } //#endregion headQuarters validation

  //#region addresses validation
  if (!addresses) throw new RequiredParameterError("addresses");
  for (let i = 0; i < addresses.length; i++) {
    addresses[i] = trimAndRemoveSpaces(addresses[i]);
    if (!addresses[i]) throw new RequiredParameterError("addresses");
    if (!isAlphaNumeric(addresses[i])) throw new InvalidPropertyError("addresses should only contain letters and numbers");
  }
  //#endregion addresses validation

  //#region companyMedia validation
  if (companyMedia) {
    for (let i = 0; i < companyMedia.length; i++) {
      if (!companyMedia[i]) throw new RequiredParameterError("companyMedia");
      if (!isStringPath(companyMedia[i])) throw new InvalidPropertyError("companyMedia should only contain letters and numbers");
    }
  }
  //#endregion companyMedia validation

  //#region industries validation
  // check if industries is empty array
  if(!industries) throw new RequiredParameterError("industries and subIndustries");
  if(industries.length<1) throw new InvalidPropertyError("at least one industry should be required")
    for (let i = 0; i < industries.length; i++) {
  if (!industries[i].industry) throw new InvalidPropertyError("at least one industry should be required");
      if (!isObjectId(industries[i].industry)) throw new InvalidPropertyError("enter a valid  industry ");
      for (let j = 0; j < industries[i].subIndustries.length; j++) {
        if(!industries[i].subIndustries[j]) throw new InvalidPropertyError("at least one sub industry should be required");
        industries[i].subIndustries[j] = trimAndRemoveSpaces(industries[i].subIndustries[j]);
        if (!isObjectId(industries[i].subIndustries[j])) throw new InvalidPropertyError("enter a valid  subIndustry ");
      }
    }
  
  //#endregion industries validation

  //#region background validation
  if (background) {
    background = trimAndRemoveSpaces(background);
    if (!background) {
      throw new RequiredParameterError("background");
    }
    if (!isAlphaNumeric(background)) throw new InvalidPropertyError("background should only contain letters and numbers");
  }
  //#endregion background validation

  //#region industries validation

  // if(!industries) throw new RequiredParameterError("industry");

  // for (let i = 0; i < industries.length; i++) {

  //   //#region industry validation
  //   if (typeof industries[i].industry === "string") industries[i].industry = trimAndRemoveSpaces(industries[i].industry);
  //   if (!isObjectId(industries[i].industry)) throw new InvalidPropertyError("enter a valid industry ID");
  //   //#endregion industry validation

  //   for (let j = 0; j < industries[i].subIndustries.length; j++) {

  //     //#region industry validation
  //     if (typeof industries[i].subIndustries[j] === "string") industries[i].subIndustries[j] = trimAndRemoveSpaces(industries[i].subIndustries[j]);
  //     if (!isObjectId(industries[i].subIndustries[j])) throw new InvalidPropertyError("enter a valid industry ID");
  //     //#endregion industry validation

  //   }

  // }

  //#endregion subIndustries validation

  //#region guideLines validation
  guideLines = toBoolean(guideLines);
  //#endregion guideLines validation

if(agreeToTerms)
{
  agreeToTerms = toBoolean(agreeToTerms);
  if (typeof agreeToTerms !== "boolean") throw new InvalidPropertyError("enter a valid agree to terms");
}

  //#region accountVisibility validation
  accountVisibility = trimAndRemoveSpaces(accountVisibility);
  if (!accountVisibility) throw new RequiredParameterError("account visibility");
  if (!Object.values(CompanyAccountVisibilityEnum).includes(accountVisibility)) throw new InvalidPropertyError("enter a valid account visibility");
  //#endregion accountVisibility validation

  //#region receiveMessage validation
  if (receiveMessage) receiveMessage = toBoolean(receiveMessage);
  //#endregion receiveMessage validation

  let company = {
    _id,
    name,
    logo,
    coverPhoto,
    webSite,
    industries,
    phoneNumber,
    headQuarters,
    user,
    addresses,
    accountVisibility,
    companyMedia,
    receiveMessage,
    guideLines,
    industries,
    companySize,
    background,
    agreeToTerms
  };
  
  if (jobApplicationMessages) company.jobApplicationMessages = jobApplicationMessages;

  return Object.freeze(company);
}
export default makeCompany;
