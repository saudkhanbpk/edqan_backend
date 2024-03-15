import { trimAndRemoveSpaces, toBoolean } from "../helper/helper.js";
import { isAlphaNumeric, isNumeric, isObjectId, isValidUrl, isValidDate } from "../helper/validation.js";
import { RequiredParameterError, InvalidPropertyError } from "../error/errors.js";
import questionTypeEnum from "../types/questionType.enum.js";
import applicationTypeEnum from "../types/applicationType.enum.js";
import workAuthorizationEnum from "../types/workAuthorization.enum.js";
import jobStatusEnum from "../types/jobStatus.enum.js";

function makeJob({
  name,
  applicationType,
  applicationUrl,
  startDate,
  endDate,
  jobType,
  workType,
  major,
  receiveMessage,
  industry,
  subIndustry,
  city,
  country,
  province,
  additionalComments,
  roleDescription,
  benefits,
  moreDetails,
  questions,
  salary,
  link,
  jobPreference,
  hoursPerWeek,
  company,
  currency,
  workAuthorization,
  deadLine,
  datePosted,
  status,
  // approved,
}) {
  // approved = toBoolean(approved);

  //#region name validation
  name = trimAndRemoveSpaces(name);
  if (!name) throw new RequiredParameterError("first name");
  // if (!isAlphaNumeric(name)) throw new InvalidPropertyError("first name should only contain letters and numbers");
  //#endregion name validation

  //#region description validation
  // description = trimAndRemoveSpaces(description);
  // if (!description) throw new RequiredParameterError("description");
  // if (!isAlphaNumeric(description))
  //   throw new InvalidPropertyError(
  //     "description should only contain letters and numbers"
  //   );

  //#endregion description validation

  //#region status validation enum
  if (status) {
    status = trimAndRemoveSpaces(status);
    let statusIsIncluded = Object.values(jobStatusEnum).includes(status);
    if (!statusIsIncluded) throw new InvalidPropertyError("enter a valid status");
  }
  //#endregion status validation enum

  //#region applicationType validation
  applicationType = trimAndRemoveSpaces(applicationType);
  let applicationTypeIsIncluded = Object.values(applicationTypeEnum).includes(applicationType);
  if (!applicationTypeIsIncluded) throw new RequiredParameterError("application type");
  //#endregion applicationType validation

  //#region applicationUrl validation
  if (applicationType == "external") {
    applicationUrl = trimAndRemoveSpaces(applicationUrl);
    if (!applicationUrl) throw new RequiredParameterError("application url");
    // to lower case
    applicationUrl = applicationUrl.toLowerCase();
    if (!isValidUrl(applicationUrl)) throw new InvalidPropertyError("application URL should contain an actual url");
  }

  //#endregion applicationUrl validation

  //#region questions validation
  if (questions) {
    for (let i = 0; i < questions?.length; i++) {
      //#region questions.questionId validation
      // questions[i].questionId = trimAndRemoveSpaces(questions[i].questionId);
      // if (!questions[i].questionId)
      //   throw new RequiredParameterError("question Id");
      // if (!isNumeric(questions[i].questionId))
      //   throw new InvalidPropertyError(
      //     "question Id should only contain letters and numbers"
      //   );
      //#endregion questions.questionId validation

      //#region questions.Question validation
      questions[i].question = trimAndRemoveSpaces(questions[i].question);
      if (!questions[i].question) throw new RequiredParameterError("question");
      if (!isAlphaNumeric(questions[i].question)) throw new InvalidPropertyError("question should only contain letters and numbers");
      //#endregion questions.Question validation

      //! enums must be implmented
      //#region questions.company validation
      questions[i].questionType = trimAndRemoveSpaces(questions[i].questionType);
      if (!questions[i].questionType) throw new RequiredParameterError("questionType");
      if (!Object.values(questionTypeEnum).includes(questions[i].questionType)) throw new InvalidPropertyError("enter a valid question type");
      //#endregion questions.questionType validation
    }
  }

  /**!end */

  //#endregion questions validation

  //#region link validation
  // link = trimAndRemoveSpaces(link);
  // if (!link) throw new RequiredParameterError("link url");
  // if (!isValidUrl(link))
  //   throw new InvalidPropertyError("link url should only contain url");

  //#end region link validation

  //#region moreDetails validation
  moreDetails = trimAndRemoveSpaces(moreDetails);
  // if (!moreDetails) throw new RequiredParameterError("more details");
  // if (!isAlphaNumeric(moreDetails)) throw new InvalidPropertyError("more details should only contain letters and numbers");
  //#end region moreDetails validation

  //#region benefits validation
  benefits = trimAndRemoveSpaces(benefits);
  // if (!benefits) throw new RequiredParameterError("benefits");
  // if (!isAlphaNumeric(benefits)) throw new InvalidPropertyError("benefits should only contain letters and numbers");
  //#end region benefits validation

  //#region roleDescription validation
  roleDescription = trimAndRemoveSpaces(roleDescription);
  if (!roleDescription) throw new RequiredParameterError("roleDescription");
  // if (!isAlphaNumeric(roleDescription)) throw new InvalidPropertyError("roleDescription should only contain letters and numbers");
  //#end region roleDescription validation

  //#region additionalComments validation
  if (additionalComments) {
    additionalComments = trimAndRemoveSpaces(additionalComments);
  } //#end region additionalComments validation

  //#region jobType validation
  if (typeof jobType === "string") jobType = trimAndRemoveSpaces(jobType);
  if (!jobType) {
    throw new RequiredParameterError("jobType");
  }
  if (!isObjectId(jobType)) {
    throw new InvalidPropertyError("jobType must include a jobType ID");
  }
  //#end region jobType validation

  //#region workType validation
  if (typeof workType === "string") workType = trimAndRemoveSpaces(workType);
  if (!workType) {
    throw new RequiredParameterError("workType");
  }
  if (!isObjectId(workType)) {
    throw new InvalidPropertyError("workType must include a workType ID");
  }
  //#end region workType validation

  // //#region jobRole validation
  // jobRole = trimAndRemoveSpaces(jobRole);
  // if (!jobRole) {
  //   throw new RequiredParameterError("role title");
  // }
  //#endregion jobRole validation

  //#region city validation
  if (city) {
    if (typeof city === "string") city = trimAndRemoveSpaces(city);
    if (!isObjectId(city) && city !== null) {
      throw new InvalidPropertyError("city must include a city ID");
    }
  }

  if (province) {
    if (typeof province === "string") city = trimAndRemoveSpaces(city);
    if (!isObjectId(province) && province !== null) {
      throw new InvalidPropertyError("province must include a province ID");
    }
  }
  //#endregion city validation

  //#region country validation
  if (country) {
    if (typeof country === "string") country = trimAndRemoveSpaces(country);
    if (!isObjectId(country) && country !== null) {
      throw new InvalidPropertyError("country must include a country ID");
    }
  }
  //#endregion city validation

  //#region city validatio
  if (currency) {
    if (typeof currency === "string") currency = trimAndRemoveSpaces(currency);
    if (!isObjectId(currency)) {
      throw new InvalidPropertyError("currency must include a currency ID");
    }
  }
  //#endregion currency validation

  //#region company validation
  if (typeof company === "string") company = trimAndRemoveSpaces(company);
  if (!company) {
    throw new Error("Company field is required");
  }
  if (!isObjectId(company)) {
    throw new InvalidPropertyError("company must include a company ID");
  }
  //#endregion company validation

  //#region major validation
  if (major) {
    if (typeof major === "string") major = trimAndRemoveSpaces(major);
    if (!isObjectId(major)) {
      throw new InvalidPropertyError("major must include a major ID");
    }
  }

  //#endregion major validation

  // //#region fluentLanguage validation
  // if (typeof fluentLanguage === 'string') fluentLanguage = trimAndRemoveSpaces(fluentLanguage);
  // if (!fluentLanguage) {
  //     throw new RequiredParameterError('fluentLanguage');
  // }
  // if (!isObjectId(fluentLanguage)) {
  //     throw new InvalidPropertyError('fluentLanguage must include a fluentLanguage ID');
  // }
  // //#endregion fluentLanguage validation

  // //#region proficiencyLanguage validation
  // if (typeof proficiencyLanguage === 'string') proficiencyLanguage = trimAndRemoveSpaces(proficiencyLanguage);
  // if (!proficiencyLanguage) {
  //     throw new RequiredParameterError('proficiencyLanguage');
  // }
  // if (!isObjectId(proficiencyLanguage)) {
  //     throw new InvalidPropertyError('proficiencyLanguage must include a proficiencyLanguage ID');
  // }
  // //#endregion proficiencyLanguage validation

  //#region hoursPerWeek validation
  hoursPerWeek = trimAndRemoveSpaces(hoursPerWeek);
  if (!hoursPerWeek) {
    throw new RequiredParameterError("hours per week");
  }
  if (!isNumeric(hoursPerWeek)) {
    throw new InvalidPropertyError("hours per week must be a number");
  }
  //#endregion hoursPerWeek validation

  //#region salary validation
  if (salary) {
    salary = trimAndRemoveSpaces(salary);
    if (!isNumeric(salary)) {
      throw new InvalidPropertyError("salary must be a number");
    }
  }
  //#endregion salary validation

  //#region deadLine validation
  if (!deadLine) throw new RequiredParameterError("deadline  date");
  deadLine = new Date(deadLine);
  deadLine.setHours(0, 0, 0, 0);
  if (!isValidDate(deadLine)) throw new InvalidPropertyError("enter a deadline date");
  //#endregion deadLine validation
  //#region education validation
  if (jobPreference) {
    //#region fluentLanguage validation
    if (typeof jobPreference.fluentLanguage === "string") jobPreference.fluentLanguage = trimAndRemoveSpaces(jobPreference.fluentLanguage);
    if (!jobPreference.fluentLanguage) {
      throw new RequiredParameterError("fluentLanguage");
    }
    if (!isObjectId(jobPreference.fluentLanguage)) {
      throw new InvalidPropertyError("fluentLanguage must include a fluentLanguage ID");
    }
    //#endregion fluentLanguage validation
    //#region languageProficiency validation
    if (jobPreference.languageProficiency) {
      if (typeof jobPreference.languageProficiency === "string")
        jobPreference.languageProficiency = trimAndRemoveSpaces(jobPreference.languageProficiency);
      if (!isObjectId(jobPreference.languageProficiency)) {
        throw new InvalidPropertyError("languageProficiency must include a languageProficiency ID");
      }
    }
    //#endregion languageProficiency validation

    //#region major validation
    jobPreference.major = toBoolean(jobPreference.major);
    // if (typeof jobPreference.major === "string")
    //   jobPreference.major = trimAndRemoveSpaces(jobPreference.major);
    // if (!jobPreference.major) {
    //   throw new RequiredParameterError("major");
    // }
    // if (!isObjectId(jobPreference.major)) {
    //   throw new InvalidPropertyError("major must include a major ID");
    // }
    //#endregion major validation

    //#region gpa validation
    if (jobPreference.gpa) {
      if (+jobPreference.gpa > 5 || +jobPreference.gpa < 0) {
        throw new InvalidPropertyError("GPA must be between 1.0 to 5.0");
      }
      jobPreference.gpa = trimAndRemoveSpaces(jobPreference.gpa);
      const parsedGPA = parseFloat(jobPreference.gpa);
      if (Number.isInteger(parsedGPA)) {
        jobPreference.gpa = parsedGPA.toFixed(1); // If GPA is a whole number, apply toFixed(1)
        if (!jobPreference.gpa.includes(".")) {
          jobPreference.gpa += ".0"; // Add ".0" if there's no decimal part
        }
      } else {
        jobPreference.gpa = parsedGPA.toFixed(2); // If GPA has one decimal place, apply toFixed(2)
      }
    }
    //#endregion gpa validation

    //#region graduationDate validation
    if (jobPreference.graduationDate) {
      if (!isValidDate(jobPreference.graduationDate)) throw new InvalidPropertyError("enter a valid date");
      jobPreference.graduationDate = new Date(jobPreference.graduationDate);
    }
    //#endregion graduationDate validation
  }

  //#region datePosted validation
  if (!datePosted) throw new RequiredParameterError("datePosted  date");
  datePosted = new Date(datePosted);
  if (!isValidDate(datePosted)) throw new InvalidPropertyError("enter a datePosted date");
  //#endregion datePosted validation

  //#endregion education validation

  // #region workAuthorization validation

  if (workAuthorization) {
    // to number if string
    if (typeof workAuthorization === "string") workAuthorization = trimAndRemoveSpaces(workAuthorization);
    workAuthorization = parseInt(workAuthorization);
    let workAuthorizationIncluded = Object.values(workAuthorizationEnum).includes(workAuthorization);
    if (!workAuthorizationIncluded) throw new InvalidPropertyError("please enter a valid work authorization");
  }

  // #endregion workAuthorization validation

  // industry and sub industry region
  // if (industry) {
  if (!industry) {
    throw new RequiredParameterError("industry");
  }
  if (typeof industry === "string") industry = trimAndRemoveSpaces(industry);

  if (!isObjectId(industry)) {
    throw new InvalidPropertyError("industry must include a industry ID");
  }
  // }
  // if (subIndustry) {
  if (!subIndustry) {
    throw new RequiredParameterError("subIndustry");
  }
  if (typeof subIndustry === "string") subIndustry = trimAndRemoveSpaces(subIndustry);

  if (!isObjectId(subIndustry)) {
    throw new InvalidPropertyError("subIndustry must include a subIndustry ID");
  }
  // }
  // industry and sub industry End region

  return Object.freeze({
    name,
    applicationType,
    applicationUrl,
    startDate,
    company,
    endDate,
    jobType,
    workType,
    hoursPerWeek,
    receiveMessage,
    industry,
    subIndustry,
    city,
    country,
    province,
    link,
    major,
    additionalComments,
    roleDescription,
    benefits,
    moreDetails,
    questions,
    salary,
    jobPreference,
    currency,
    deadLine,
    datePosted,
    workAuthorization,
    // approved,
    status,
  });
}

export default makeJob;
