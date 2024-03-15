//#region DB models imports
import areaInterestModel from "../data-access-layer/models/areaInterest.model.js";
import chatModel from "../data-access-layer/models/chat.model.js";
import cityModel from "../data-access-layer/models/city.model.js";
import educationLevelGroupModel from "../data-access-layer/models/educationLevelGroup.model.js";
import companyModel from "../data-access-layer/models/company.model.js";
import companyFollowersModel from "../data-access-layer/models/companyFollowers.model.js";
import companyGuideLineModel from "../data-access-layer/models/companyGuideLine.model.js";
import countryModel from "../data-access-layer/models/country.model.js";
import currencyModel from "../data-access-layer/models/currency.model.js";
import didYouGetOfferModel from "../data-access-layer/models/subModels/didYouGetOffer.model.js";
import domainModel from "../data-access-layer/models/subModels/domain.model.js";
import educationLevelModel from "../data-access-layer/models/educationLevel.model.js";
import howDidYouGetPaidModel from "../data-access-layer/models/subModels/howDidYouGetPaid.model.js";
import industryModel from "../data-access-layer/models/industry.model.js";
import institutionModel from "../data-access-layer/models/institution.model.js";
import jobModel from "../data-access-layer/models/job.model.js";
import jobTypeModel from "../data-access-layer/models/jobType.model.js";
import jobRoleModel from "../data-access-layer/models/jobRole.model.js";
import keyWaysModel from "../data-access-layer/models/keyWays.model.js";
import languageModel from "../data-access-layer/models/language.model.js";
import majorModel from "../data-access-layer/models/major.model.js";
import mentorModel from "../data-access-layer/models/mentor.model.js";
import mentoringProgramOptionModel from "../data-access-layer/models/subModels/mentoringProgramOptions.model.js";
import mentorShipGuideLineModel from "../data-access-layer/models/mentorShipGuideLine.model.js";
import meetingModel from "../data-access-layer/models/meeting.model.js";
import meetingDurationModel from "../data-access-layer/models/meetingDuration.model.js";
import mentorShipTypeModel from "../data-access-layer/models/mentorShipType.model.js";
import messageModel from "../data-access-layer/models/message.model.js";
import notificationMethodModel from "../data-access-layer/models/notificationMethod.model.js";
import notificationTypeModel from "../data-access-layer/models/notificationType.model.js";
import resourcesFindingJobModel from "../data-access-layer/models/subModels/resourcesFindingJob.model.js";
import reviewModel from "../data-access-layer/models/review.model.js";
// import reviewOptionsModel from "../../data-access-layer/models/reviewOptions.model.js';
const reviewOptionsModel = null;
import socialMediaModel from "../data-access-layer/models/subModels/socialMedia.model.js";
import studentModel from "../data-access-layer/models/student.model.js";
import subIndustryModel from "../data-access-layer/models/subIndustry.model.js";
import typeOfWorkModel from "../data-access-layer/models/subModels/typeOfWork.model.js";
import userModel from "../data-access-layer/models/user.model.js";
import userAttachmentModel from "../data-access-layer/models/userAttachment.model.js";
import userNotificationsModel from "../data-access-layer/models/userNotification.model.js";
import workTypeModel from "../data-access-layer/models/workType.model.js";
import paginator from "../helper/paginator.js";
import provinceModel from "../data-access-layer/models/province.model.js";
//#endregion DB models imports

async function search(model, term, paginationQuery) {
  // check if model is equal to the model name
  if (model === "areaInterest") {
    let query = {};
    if (term) {
      query = { $or: [{ nameEn: { $regex: term, $options: "i" } }, { nameAr: { $regex: term, $options: "i" } }] };
    }
    const queryResult = await paginator(areaInterestModel, query, paginationQuery, []);
    return queryResult;
  }
  if (model === "user") {
    //should be refactored to be more generic
    // Retrieve users from companies submodel

    //  term = term.toLowerCase();
    const companies = await companyModel
      .find({
        name: { $regex: term, $options: "i" },
      })
      .select("user");

    const institutions = await institutionModel
      .find({
        name: { $regex: term, $options: "i" },
      })
      .select("user");

    const mentors = await mentorModel
      .find({
        $or: [
          { firstName: { $regex: term, $options: "i" } },
          { lastName: { $regex: term, $options: "i" } },
          { middleName: { $regex: term, $options: "i" } },
        ],
      })
      .select("user");

    const students = await studentModel
      .find({
        $or: [{ firstName: { $regex: term, $options: "i" } }, { lastName: { $regex: term, $options: "i" } }],
      })
      .select("user");

    const userIDs = [
      ...companies.map((company) => company.user),
      ...institutions.map((institution) => institution.user),
      ...mentors.map((mentor) => mentor.user),
      ...students.map((student) => student.user),
    ];

    let query = {
      $or: [
        { email: { $regex: term, $options: "i" } }, // Search in the email field
        { _id: { $in: userIDs } }, // Search for matching user IDs from submodels
      ],
    };
    const queryResult = await paginator(userModel, query, paginationQuery, ["subModel"]);
    return queryResult;
  }

  if (model === "chat") {
    let query = {};
    query = { name: { $regex: term, $options: "i" } };
    const queryResult = await paginator(chatModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "city") {
    let query = {};
    query = {
      $or: [{ name: { $regex: term, $options: "i" } }, { name: { $regex: term, $options: "i" } }],
    };
    const queryResult = await paginator(cityModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "country") {
    let query = {};

    query = {
      $or: [{ name: { $regex: term, $options: "i" } }, { name: { $regex: term, $options: "i" } }],
    };
    const queryResult = await paginator(countryModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "province") {
    let query = {};
    query = {
      $or: [{ name: { $regex: term, $options: "i" } }, { name: { $regex: term, $options: "i" } }],
    };
    const queryResult = await paginator(provinceModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "company") {
    let query = {};

    query = {
      $or: [{ name: { $regex: term, $options: "i" } }, { background: { $regex: term, $options: "i" } }],
    };
    const queryResult = await paginator(companyModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "currency") {
    let query = {};

    query = {
      $or: [{ nameEn: { $regex: term, $options: "i" } }, { nameAr: { $regex: term, $options: "i" } }],
    };
    const queryResult = await paginator(currencyModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "domain") {
    let query = {};

    query = { name: { $regex: term, $options: "i" } };
    const queryResult = await paginator(domainModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "educationLevel") {
    let query = {};

    query = {
      $or: [{ nameEn: { $regex: term, $options: "i" } }, { nameAr: { $regex: term, $options: "i" } }],
    };
    const queryResult = await paginator(educationLevelModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "howDidYouGetPaid") {
    let query = {};

    query = {
      $or: [{ nameEn: { $regex: term, $options: "i" } }, { nameAr: { $regex: term, $options: "i" } }],
    };
    const queryResult = await paginator(howDidYouGetPaidModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "industry") {
    let query = {};
    console.log(term);
    query = {
      $or: [{ nameEn: { $regex: term, $options: "i" } }, { nameAr: { $regex: term, $options: "i" } }],
    };
    const queryResult = await industryModel.find(query);
    return queryResult;
  }

  if (model === "institution") {
    let query = {};

    query = { name: { $regex: term, $options: "i" } };
    const queryResult = await paginator(institutionModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "job") {
    let query = {};

    query = {
      $or: [{ name: { $regex: term, $options: "i" } }, { description: { $regex: term, $options: "i" } }],
      approved: true,
    };
    const queryResult = await paginator(jobModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "jobType") {
    let query = {};

    query = {
      $or: [{ nameEn: { $regex: term, $options: "i" } }, { nameAr: { $regex: term, $options: "i" } }],
    };
    const queryResult = await paginator(jobTypeModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "jobRole") {
    let query = {};

    query = {
      $or: [{ nameEn: { $regex: term, $options: "i" } }, { nameAr: { $regex: term, $options: "i" } }],
    };
    const queryResult = await paginator(jobRoleModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "keyWays") {
    let query = {};

    query = {
      $or: [{ nameEn: { $regex: term, $options: "i" } }, { nameAr: { $regex: term, $options: "i" } }],
    };
    const queryResult = await paginator(keyWaysModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "language") {
    let query = {};

    query = {
      $or: [{ nameEn: { $regex: term, $options: "i" } }, { nameAr: { $regex: term, $options: "i" } }],
    };
    const queryResult = await paginator(languageModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "major") {
    let query = {};

    query = {
      $or: [{ nameEn: { $regex: term, $options: "i" } }, { nameAr: { $regex: term, $options: "i" } }],
    };
    const queryResult = await paginator(majorModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "notificationType") {
    let query = {};

    query = { name: { $regex: term, $options: "i" } };
    const queryResult = await paginator(notificationTypeModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "didYouGetOffer") {
    let query = {};

    query = { name: { $regex: term, $options: "i" } };
    const queryResult = await paginator(didYouGetOfferModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "mentor") {
    let query = {};

    query = {
      $or: [
        { firstName: { $regex: term, $options: "i" } },
        { lastName: { $regex: term, $options: "i" } },
        { email: { $regex: term, $options: "i" } },
      ],
    };
    const queryResult = await paginator(mentorModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "mentoringProgramOption") {
    let query = {};

    query = {
      $or: [{ nameEn: { $regex: term, $options: "i" } }, { nameAr: { $regex: term, $options: "i" } }],
    };
    const queryResult = await paginator(mentoringProgramOptionModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "review") {
    let query = {};

    query = {
      $or: [
        { jobTitle: { $regex: term, $options: "i" } },
        { whatYouLikedAndLearned: { $regex: term, $options: "i" } },
        { advicesForOthers: { $regex: term, $options: "i" } },
      ],
    };
    const queryResult = await paginator(reviewModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "educationLevelGroup") {
    let query = {};

    query = {
      $or: [{ nameEn: { $regex: term, $options: "i" } }, { nameAr: { $regex: term, $options: "i" } }],
    };
    const queryResult = await paginator(educationLevelGroupModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "mentoringProgram") {
    let query = {};

    query = {
      $or: [{ nameEn: { $regex: term, $options: "i" } }, { nameAr: { $regex: term, $options: "i" } }],
    };
    const queryResult = await paginator(mentoringProgramOptionModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "mentorShipType") {
    let query = {};

    query = {
      $or: [{ nameEn: { $regex: term, $options: "i" } }, { nameAr: { $regex: term, $options: "i" } }],
    };
    const queryResult = await paginator(mentorShipTypeModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "notificationMethod") {
    let query = {};

    query = {
      $or: [{ nameEn: { $regex: term, $options: "i" } }, { nameAr: { $regex: term, $options: "i" } }],
    };
    const queryResult = await paginator(notificationMethodModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "notificationType") {
    let query = {};

    query = {
      $or: [{ nameEn: { $regex: term, $options: "i" } }, { nameAr: { $regex: term, $options: "i" } }],
    };
    const queryResult = await paginator(notificationTypeModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "student") {
    let query = {};

    query = {
      $or: [
        { firstName: { $regex: term, $options: "i" } },
        { lastName: { $regex: term, $options: "i" } },
        { email: { $regex: term, $options: "i" } },
      ],
    };
    const queryResult = await paginator(studentModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "socialMedia") {
    let query = {};

    query = {
      $or: [{ nameEn: { $regex: term, $options: "i" } }, { nameAr: { $regex: term, $options: "i" } }],
    };
    const queryResult = await paginator(socialMediaModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "subIndustry") {
    let query = {};

    query = {
      $or: [{ nameEn: { $regex: term, $options: "i" } }, { nameAr: { $regex: term, $options: "i" } }],
    };
    const queryResult = await paginator(subIndustryModel, query, paginationQuery, ["industry"]);
    // this part gets the industry name from the populated industry, to removed in the future due to performance issues
    // for (const subIndustry of queryResult.queryResult) {
    //   subIndustry.industry_nameEn = subIndustry.industry.nameEn;
    //   delete subIndustry.industry.nameEn;
    // }
    for (let i = 0; i < queryResult.queryResult.length; i++) {
      queryResult.queryResult[i].industry_nameEn = queryResult.queryResult[i].industry.nameEn;
      queryResult.queryResult[i].industry = queryResult.queryResult[i].industry._id;
    }
    return queryResult;
  }

  if (model === "typeOfWork") {
    let query = {};

    query = {
      $or: [{ nameEn: { $regex: term, $options: "i" } }, { nameAr: { $regex: term, $options: "i" } }],
    };
    const queryResult = await paginator(typeOfWorkModel, query, paginationQuery, []);
    return queryResult;
  }

  if (model === "workType") {
    let query = {};

    query = {
      $or: [{ nameEn: { $regex: term, $options: "i" } }, { nameAr: { $regex: term, $options: "i" } }],
    };
    const queryResult = await paginator(workTypeModel, query, paginationQuery, []);
    return queryResult;
  }
}

export default { search };
