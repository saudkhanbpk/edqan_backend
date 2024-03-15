import { isObjectId, isValidDate, isValidUrl } from "../helper/validation.js";
import { trimAndRemoveSpaces, toBoolean } from "../helper/helper.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";

import genderEnum from "../types/gender.enum.js";
import accountVisibilityEnum from "../types/accountVisibility.enum.js";
import { educationLevelGroupRepo } from "../data-access-layer/index.js";
import educationLevelModel from "../data-access-layer/models/educationLevel.model.js";
import educationLevelGroupModel from "../data-access-layer/models/educationLevelGroup.model.js";

let getAllEducationLevelGroup = educationLevelGroupRepo.findAll;

async function makeStudent({
  _id,
  firstName=undefined,
  middleName=undefined,
  lastName=undefined,
  secondaryEmail=undefined,
  user=undefined,
  fluentLanguage=undefined,
  proficientLanguage=undefined,
  enrolledInHighSchool=undefined,
  major=undefined,
  graduationDate=undefined,
  areaOfInterest=undefined,
  educationLevel=undefined,
  institution=null,
  careerInterest=undefined,
  emailVerifiedAt=undefined,
  gender=undefined,
  jobMajors=undefined,
  brief=undefined,
  education=undefined,
  profileImage=undefined,
  volunteers=undefined,
  accountVisibility = accountVisibilityEnum.EMPLOYER,
  skills=undefined,
  courses=undefined,
  projects=undefined,
  student=undefined,
  organizations=undefined,
  gpa=undefined,
  agreeToTerms=undefined,
  guideLines=undefined,
}) {
  let educationLevelGroups = await getAllEducationLevelGroup();
  //#region education validation

  const educationFieldsValidation = {
    major: function (major) {
      //#region education.major validation
      if (major) {
        major = trimAndRemoveSpaces(major);
        // if (!major) throw new RequiredParameterError("major");
        if (!isObjectId(major)) throw new InvalidPropertyError("major should contain only major ID");
      }//#endregion education.major validation
    },
    minor: function (minor) {
      //#region education.major validation
      minor = trimAndRemoveSpaces(minor);
      // if (!minor) throw new RequiredParameterError("minor");
      //#endregion education.concentration validation
    },
    university: function (university) {
      //#region education.university validation
      university = trimAndRemoveSpaces(university);
      if (!university) throw new RequiredParameterError("university");
      // if (!isAlphaNumeric(university))
      //   throw new InvalidPropertyError(
      //     "university should only contain letters and numbers"
      //   );
      //#endregion education.university validation
    },
    startingDate: function (startingDate) {
      //#region education.startingDate validation
      if (!startingDate) throw new RequiredParameterError("starting date");
      startingDate = new Date(startingDate);

      if (!isValidDate(startingDate)) throw new InvalidPropertyError("enter a valid date");
      //#endregion education.startingDate validation
    },
    endingDate: function (endingDate) {
      //#region education.endingDate validation
      if (!endingDate) throw new RequiredParameterError("ending date");
      endingDate = new Date(endingDate);
      if (!isValidDate(endingDate)) throw new InvalidPropertyError("enter a valid date");
      // if (!compareDates(endingDate, startingDate))
      // throw new InvalidPropertyError(
      //   "education ending date should be a date after starting date"
      // );
      //#endregion education.endingDate validation
    },
    gpa: function (gpa) {
      //#region education.gpa validation
      if (gpa) {
        if (+gpa > 5 || +gpa < 0) throw new InvalidPropertyError("GPA must be between 1.0 to 5.0");
        gpa = trimAndRemoveSpaces(gpa);
        const parsedGPA = parseFloat(gpa);
        if (Number.isInteger(parsedGPA)) {
          if (!gpa.includes(".")) {
            gpa += ".0"; // Add ".0" if there's no decimal part
          }
          return gpa.toString();
        } else {
          gpa = parsedGPA.toFixed(2); // If GPA has one decimal place, apply toFixed(2)
          return gpa;
        }
      }
      //#endregion education.gpa validation
    },
    graduationDate: function (graduationDate) {
      //#region education.graduationDate validation
      if (graduationDate) {
        graduationDate = trimAndRemoveSpaces(graduationDate);
        graduationDate = new Date(graduationDate);
        if (!isValidDate(graduationDate)) throw new InvalidPropertyError("enter a valid date");
        //#endregion education.graduationDate validation
      }
      graduationDate = undefined
    },

  };



  // based on the new structure of educationLevel
  // based on the new structure of educationLevel
  for (let i = 0; i < education?.length; i++) {
    //#region education.educationLevel validation
    education[i].educationLevel = trimAndRemoveSpaces(education[i].educationLevel);
    if (!education[i].educationLevel) throw new RequiredParameterError("education level");
    if (!isObjectId(education[i].educationLevel)) throw new InvalidPropertyError("education level should only contain letters and numbers");
    //#endregion education.major validation

    // Find the education level object
    const educationLevel = await educationLevelModel.findById(education[i].educationLevel);

    // Find the education level group associated with this education level
    const educationLevelGroup = await educationLevelGroupModel.findById(educationLevel.educationLevelGroup);

    // Looping over educationLevelGroup.fieldsToValidate and validate their correspondents in each education object
    for (const field of educationLevelGroup.fieldsToValidate) {
      educationFieldsValidation[field](education[i][field]);
    }

    // Looping over all the education object fields and remove the ones that are not in the education level group fields to validate
    for (const key in education[i]) {
      if (key === "_id" || key === "educationLevel" || key === "university") continue;
      if (!educationLevelGroup.fieldsToValidate.includes(key) && key !== "graduationDate") {
        education[i][key] = undefined;
      }
    }

    // GPA validation
    if (education[i].hasOwnProperty("gpa")) {
      const gpa = education[i].gpa;
      if (+gpa > 5 || +gpa < 0) {
        throw new InvalidPropertyError("GPA must be between 1.0 to 5.0");
      }
      const trimmedGPA = trimAndRemoveSpaces(gpa);

      const parsedGPA = parseFloat(trimmedGPA);
      if (Number.isInteger(parsedGPA)) {
        education[i].gpa = parsedGPA.toFixed(1);
        if (!education[i].gpa.includes(".")) {
          education[i].gpa += ".0";
        }
      } else {
        education[i].gpa = parsedGPA.toFixed(2);
      }
    }
  }

  //#endregion education validation

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
  //#region _id validation
  if (typeof _id === "string") {
    _id = trimAndRemoveSpaces(_id);
  }
  if (!_id) throw new RequiredParameterError("_id");
  if (!isObjectId(_id)) throw new InvalidPropertyError("enter a valid student ID");
  //#endregion _id validation

  //#region firstName validation
  firstName = trimAndRemoveSpaces(firstName);
  if (!firstName) throw new RequiredParameterError("first name");
  // if (!isAlphaNumeric(firstName))
  //   throw new InvalidPropertyError(
  //     "first name should only contain letters and numbers"
  //   );
  //#endregion firstName validation

  //#region middleName validation
  if (middleName) middleName = trimAndRemoveSpaces(middleName);
  // if (!isAlphaNumeric(middleName))
  //   throw new InvalidPropertyError(
  //     "middle name should only contain letters and numbers"
  //   );
  //#endregion middleName validation

  //#region lastName validation
  lastName = trimAndRemoveSpaces(lastName);
  if (!lastName) throw new RequiredParameterError("last name");


  //#region secondaryEmail validation
  if (secondaryEmail) {
    secondaryEmail = trimAndRemoveSpaces(secondaryEmail);
    // if (!isEmail(secondaryEmail))
    //   throw new InvalidPropertyError("enter a valid email");
    secondaryEmail = secondaryEmail.toLowerCase();

    //TODO: to be validate
    // if (secondaryEmail == primaryEmail)
    //   throw new InvalidPropertyError(
    //     "secondary email must differ from primary email"
    //   );
  }
  //#endregion secondaryEmail validation

  //#region user validation
  // user = trimAndRemoveSpaces(user);
  // if (!user) throw new RequiredParameterError('user');
  // if (!isObjectId(user)) throw new InvalidPropertyError('enter a valid user ID');
  //#endregion user validation

  //#region fluentLanguage validation
  if (fluentLanguage)
    for (let i = 0; i < fluentLanguage.length; i++) {
      fluentLanguage[i] = trimAndRemoveSpaces(fluentLanguage[i]);
      if (!isObjectId(fluentLanguage[i])) throw new InvalidPropertyError("enter a valid language ID");
    }
  //#endregion fluentLanguage validation

  //#region proficientLanguage validation
  if (proficientLanguage)
    for (let i = 0; i < proficientLanguage.length; i++) {
      proficientLanguage[i] = trimAndRemoveSpaces(proficientLanguage[i]);
      if (!proficientLanguage[i]) if (!isObjectId(proficientLanguage[i])) throw new InvalidPropertyError("enter a valid language ID");
    }
  //#endregion proficientLanguage validation

  //#region enrolledInHighSchool validation
  new Boolean(enrolledInHighSchool);
  if (typeof enrolledInHighSchool !== "boolean") throw new InvalidPropertyError("enter a valid enrolled in high school");
  //#endregion enrolledInHighSchool validation

  //#region student validation
  if (typeof student !== "boolean") throw new InvalidPropertyError("enter a valid student option");
  //#endregion student validation

  //#region student gpa validation
  if (student) {
    if (+gpa > 5 || +gpa < 0) {
      throw new InvalidPropertyError("GPA must be between 1.0 to 5.0");
    }
    gpa = trimAndRemoveSpaces(gpa);
    const parsedGPA = parseFloat(gpa);
    if (Number.isInteger(parsedGPA)) {
      gpa = parsedGPA.toFixed(1); // If GPA is a whole number, apply toFixed(1)
      if (!gpa.includes(".")) {
        gpa += ".0"; // Add ".0" if there's no decimal part
      }
    } else {
      gpa = parsedGPA.toFixed(2); // If GPA has one decimal place, apply toFixed(2)
    }
  }
// this part to handle gpa on update
if(gpa){

  gpa = trimAndRemoveSpaces(gpa);
  const parsedGPA = parseFloat(gpa);
  if (Number.isInteger(parsedGPA)) {
    gpa = parsedGPA.toFixed(1); // If GPA is a whole number, apply toFixed(1)
    if (!gpa.includes(".")) {
      gpa += ".0"; // Add ".0" if there's no decimal part
    }
  } else {
    gpa = parsedGPA.toFixed(2); // If GPA has one decimal place, apply toFixed(2)
  }
}

  //#endregion student gpa validation

  //#region major validation
  if (enrolledInHighSchool) {
    //major is array of strings
    for (let i = 0; i < major.length; i++) {
      major[i] = trimAndRemoveSpaces(major[i]);
      if (!isObjectId(major[i])) throw new InvalidPropertyError("major should only contain major ID");
    }
  }
  //#endregion major validation
  if (typeof _id === "string") {
    major = trimAndRemoveSpaces(major);
  }

  //#region graduationDate validation
  //TODO: check if we need to make a validation about the duration of the graduation
  if (enrolledInHighSchool === true) {
    if (!graduationDate) throw new RequiredParameterError("graduation date");
    graduationDate = new Date(graduationDate);
    if (!isValidDate(graduationDate)) throw new InvalidPropertyError("enter a valid date");

  }

  //check if graduationDate is not date  


  //#endregion graduationDate validation

  //#region areaOfInterest validation
  if (!enrolledInHighSchool) {
    areaOfInterest = trimAndRemoveSpaces(areaOfInterest);
    if (!areaOfInterest) throw new RequiredParameterError("area of interest");
    if (!isObjectId(areaOfInterest)) throw new InvalidPropertyError("area of interest should only contain area of interest ID");
  }
  //#endregion areaOfInterest validation

  //#region educationLevel validation
  if (enrolledInHighSchool) {
    educationLevel = trimAndRemoveSpaces(educationLevel);
    if (!educationLevel) throw new RequiredParameterError("education level");
    if (!isObjectId(educationLevel)) throw new InvalidPropertyError("education level should only contain education level ID");
  }
  //#endregion educationLevel validation

  //#region institution validation
  if (institution) {
    institution = trimAndRemoveSpaces(institution);
    if (!isObjectId(institution)) throw new InvalidPropertyError("institution should only contain institution ID");
  }
  //#endregion institution validation

  //#region careerInterest validation
  if (careerInterest) {
    //#region careerInterest.workType validation
    for (let j = 0; j < careerInterest?.workType?.length; j++) {
      careerInterest.workType[j] = trimAndRemoveSpaces(careerInterest.workType[j]);
      if (!careerInterest.workType[j]) throw new RequiredParameterError("career interest work type");
      if (!isObjectId(careerInterest.workType[j])) throw new InvalidPropertyError("work type should only contain work type ID");
    }

    //#region careerInterest.subIndustry validation
    for (let j = 0; j < careerInterest?.subIndustry?.length; j++) {
      careerInterest.subIndustry[j] = trimAndRemoveSpaces(careerInterest.subIndustry[j]);
      if (!careerInterest.subIndustry[j]) throw new RequiredParameterError("career interest sub industry");
      if (!isObjectId(careerInterest.subIndustry[j]))
        throw new InvalidPropertyError("career interest sub industry should only contain sub industry ID");
    }
    //#endregion careerInterest.subIndustry validation

    //#region careerInterest.country validation
    for (let j = 0; j < careerInterest?.country?.length; j++) {
      careerInterest.country[j] = trimAndRemoveSpaces(careerInterest.country[j]);
      if (!careerInterest.country[j]) throw new RequiredParameterError("career interest country");
      if (!isObjectId(careerInterest.country[j])) throw new InvalidPropertyError("country should only contain country ID");
    }
    //#endregion careerInterest.country validation
    //#region careerInterest.jobRole validation
    for (let j = 0; j < careerInterest?.jobRole?.length; j++) {
      careerInterest.jobRole[j] = trimAndRemoveSpaces(careerInterest.jobRole[j]);
      if (!careerInterest.jobRole[j]) throw new RequiredParameterError("career interest jobRole");
    }
    //#endregion careerInterest.jobRole validation
  }
  //#endregion careerInterest validation

  //#region jobMajors validation
  if (jobMajors) {
    for (let j = 0; j < jobMajors?.length; j++) {
      jobMajors[j] = trimAndRemoveSpaces(jobMajors[j]);
      if (!isObjectId(jobMajors[j])) throw new InvalidPropertyError("enter a valid job major");
    }
  }

  //#region emailVerifiedAt validation
  if (emailVerifiedAt && !isValidDate(emailVerifiedAt)) throw new InvalidPropertyError("enter a valid date");
  //#endregion emailVerifiedAt validation

  //#region gender validation
  gender = trimAndRemoveSpaces(gender);
  if (!gender) throw new RequiredParameterError("gender");
  gender = gender.toLowerCase();
  if (!Object.values(genderEnum).includes(gender)) throw new InvalidPropertyError("enter a valid gender");
  //#endregion gender validation

  //#region brief validation
  if (brief) {
    brief = trimAndRemoveSpaces(brief);
    if (!brief) throw new RequiredParameterError("brief");
    // if (!isAlphaNumeric(brief))
    //   throw new InvalidPropertyError(
    //     "brief should only contain letters and numbers"
    //   );
  }
  //#endregion brief validation

  // //#region profileImage validation
  // if (profileImage) {
  //   profileImage = trimAndRemoveSpaces(profileImage);
  //   if (!isStringPath(profileImage))
  //     throw new InvalidPropertyError(
  //       "profile image should only contain path"
  //     );
  // }
  // //#endregion profileImage validation

  //#region volunteers validation
  for (let i = 0; i < volunteers?.length; i++) {
    //#region volunteers.educationLevel validation
    // volunteers[i].educationLevel = trimAndRemoveSpaces(
    //   volunteers[i].educationLevel
    // );
    // if (!volunteers[i].educationLevel)
    //   throw new RequiredParameterError("education level");
    // if (!isAlphaNumeric(volunteers[i].educationLevel))
    //   throw new InvalidPropertyError(
    //     "education level should only contain letters and numbers"
    //   );
    //#endregion volunteers.educationLevel validation

    //#region volunteers.company validation
    volunteers[i].company = trimAndRemoveSpaces(volunteers[i].company);
    if (!volunteers[i].company) throw new RequiredParameterError("company");
    // if (!isAlphaNumeric(volunteers[i].company))
    //   throw new InvalidPropertyError(
    //     "company should only contain letters and numbers"
    //   );
    //#endregion volunteers.company validation

    //#region volunteers.companyLink validation
    // volunteers[i].companyUrl = trimAndRemoveSpaces(volunteers[i].companyUrl);
    // if (!volunteers[i].companyUrl)
    //   throw new RequiredParameterError("company url");
    // if (!isValidUrl(volunteers[i].companyUrl))
    //   throw new InvalidPropertyError("company url should only contain url");
    //#endregion volunteers.companyLink validation

    //#region volunteers.role validation
    volunteers[i].role = trimAndRemoveSpaces(volunteers[i].role);
    if (!volunteers[i].role) throw new RequiredParameterError("role");
    // if (!isAlphaNumeric(volunteers[i].role))
    //   throw new InvalidPropertyError(
    //     "role should only contain letters and numbers"
    //   );
    //#endregion volunteers.role validation

    //#region volunteers startingDate validation
    if (!volunteers[i].startingDate) throw new RequiredParameterError("starting date");
    volunteers[i].startingDate = new Date(volunteers[i].startingDate);
    if (!isValidDate(volunteers[i].startingDate)) throw new InvalidPropertyError("enter a valid date");
    //#endregion volunteers startingDate validation

    //#region volunteers endingDate validation
    if (!volunteers[i].endingDate) throw new RequiredParameterError("ending date");
    volunteers[i].endingDate = new Date(volunteers[i].endingDate);
    if (!isValidDate(volunteers[i].endingDate)) throw new InvalidPropertyError("enter a valid date");
    // if (!compareDates(volunteers[i].endingDate, volunteers[i].startingDate))
    //   throw new InvalidPropertyError(
    //     "volunteer ending date should be a date after starting date"
    //   );
    //#endregion volunteers endingDate validation

    //#region volunteers.city validation
    if (volunteers[i].city) {
      volunteers[i].city = trimAndRemoveSpaces(volunteers[i].city);
    }
    // if (!isAlphaNumeric(volunteers[i].city))
    //   throw new InvalidPropertyError("city should only contain ID");

    //#endregion volunteers.city validation
    //#region volunteers.country validation
    if (volunteers[i].country) {
      volunteers[i].country = trimAndRemoveSpaces(volunteers[i].country);
    }
    //   throw new InvalidPropertyError("country should only contain ID");

    //#endregion volunteers.country validation

    //#region project description validation
    // volunteers[i].duration = trimAndRemoveSpaces(volunteers[i].duration);
    // if (!volunteers[i].duration) throw new RequiredParameterError("volunteer duration");
    // if (!isAlphaNumeric(volunteers[i].duration))
    //   throw new InvalidPropertyError(
    //     "volunteer duration should only contain letters and numbers"
    //   );
    //#region project duration validation
    volunteers[i].description = trimAndRemoveSpaces(volunteers[i].description);
    if (!volunteers[i].description) throw new RequiredParameterError("volunteer description");
    // if (!isAlphaNumeric(volunteers[i].description))
    //   throw new InvalidPropertyError(
    //     "volunteer description should only contain letters and numbers"
    //   );
    //#endregion volunteer description validation
  }

  //#endregion volunteers validation

  //#region accountVisibility validation
  if (accountVisibility) {
    accountVisibility = trimAndRemoveSpaces(accountVisibility);
    if (!accountVisibility) throw new RequiredParameterError("account visibility");
    if (!Object.values(accountVisibilityEnum).includes(accountVisibility)) throw new InvalidPropertyError("enter a valid account visibility");
  }
  //#endregion accountVisibility validation

  //#region skills validation
  for (let i = 0; i < skills?.length; i++) {
    skills[i] = trimAndRemoveSpaces(skills[i]);
  }
  //#endregion skills validation

  //#region organizations validation
  for (let i = 0; i < organizations?.length; i++) {
    organizations[i] = trimAndRemoveSpaces(organizations[i]);
  }
  //#endregion organizations validation

  //#region course validation
  for (let i = 0; i < courses?.length; i++) {
    //#region course name validation
    courses[i].name = trimAndRemoveSpaces(courses[i].name);
    if (!courses[i].name) throw new RequiredParameterError("course name");
    //#endregion course name validation

    //#region course url validation
    if (courses[i].url) {
      courses[i].url = trimAndRemoveSpaces(courses[i].url);
      if (!isValidUrl(courses[i].url)) throw new InvalidPropertyError("Please provide the website URL in correct format with 'http://' or 'https://' and no spaces or special characters");
    }
    //#endregion course url validation
  }
  //#endregion course validation




  //#region projects validation
  for (let i = 0; i < projects?.length; i++) {
    //#region project name validation
    projects[i].name = trimAndRemoveSpaces(projects[i].name);
    if (!projects[i].name) throw new RequiredParameterError("project name");
    //#endregion project name validation

    //#region project role validation
    projects[i].role = trimAndRemoveSpaces(projects[i].role);
    if (!projects[i].role) throw new RequiredParameterError("project role");
    //#endregion project role validation

    //#region project description validation
    projects[i].description = trimAndRemoveSpaces(projects[i].description);
    if (!projects[i].description) throw new RequiredParameterError("project description");
    //#endregion project description validation
    //region city
    if (projects[i].city) {
      projects[i].city = trimAndRemoveSpaces(projects[i].city);
    }
    //end region city
    //region country
    if (projects[i].country) {
      projects[i].country = trimAndRemoveSpaces(projects[i].country);
    }
    //end region country
    //#region project starting date validation
    if (!projects[i].startingDate) throw new RequiredParameterError("project starting date");
    projects[i].startingDate = new Date(projects[i].startingDate);

    if (!isValidDate(projects[i].startingDate)) throw new InvalidPropertyError("enter a valid date");
    //#endregion project starting date validation

    //#region project ending date validation
    if (!projects[i].endingDate) throw new RequiredParameterError("project starting date");
    projects[i].endingDate = new Date(projects[i].endingDate);

    if (!isValidDate(projects[i].endingDate)) throw new InvalidPropertyError("enter a valid date");
    // if (!compareDates(projects[i].endingDate, projects[i].startingDate))
    //   throw new InvalidPropertyError(
    //     "project ending date should be a date after starting date"
    //   );
    //#endregion project ending date validation

    //#region project url validation
    if (projects[i].url) {
      projects[i].url = trimAndRemoveSpaces(projects[i].url);
      if (!isValidUrl(projects[i].url)) throw new InvalidPropertyError("project URL should contain an actual url");
    }
    //#endregion project url validation

    //#region project owner validation
    projects[i].owner = trimAndRemoveSpaces(projects[i].owner);
    if (!projects[i].owner) throw new RequiredParameterError("project owner");
    //#endregion project owner validation
  }

  //#endregion projects validation
  return Object.freeze({
    _id,
    firstName,
    middleName,
    lastName,
    secondaryEmail,
    user,
    fluentLanguage,
    proficientLanguage,
    enrolledInHighSchool,
    major,
    graduationDate,
    areaOfInterest,
    educationLevel,
    institution,
    careerInterest,
    emailVerifiedAt,
    gender,
    brief,
    education,
    profileImage,
    volunteers,
    accountVisibility,
    skills,
    courses,
    projects,
    student,
    organizations,
    gpa,
    jobMajors,
    agreeToTerms,
    guideLines,
  });
}

export default makeStudent;
