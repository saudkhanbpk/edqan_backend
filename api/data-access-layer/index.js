import dotEnv from "dotenv";
dotEnv.config();

import mongoose from "mongoose";

//#region mongoDB connection
await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
//#endregion mongoDB connection

//#region repos imports
import adminRepo from "./repos/admin.repo.js";
import appStateRepo from "./repos/appState.repo.js";
import profileViewsRepo from "./repos/profileViews.repo.js";
import applicationRepo from "./repos/application.repo.js";
import areaInterestRepo from "./repos/areaInterest.repo.js";
import chatRepo from "./repos/chat.repo.js";
import cityRepo from "./repos/city.repo.js";
import companyRepo from "./repos/company.repo.js";
import companyFollowersRepo from "./repos/companyFollowers.repo.js";
import companyGuideLineRepo from "./repos/companyGuideLine.repo.js";
import countryRepo from "./repos/country.repo.js";
import currencyRepo from "./repos/currency.repo.js";
import didYouGetOfferRepo from "./repos/didYouGetOffer.repo.js";
import domainRepo from "./repos/domain.repo.js";
import educationLevelGroupRepo from "./repos/educationLevelGroup.repo.js";
import educationLevelRepo from "./repos/educationLevel.repo.js";
import howDidYouGetPaidRepo from "./repos/howDidYouGetPaid.repo.js";
import industryRepo from "./repos/industry.repo.js";
import institutionRepo from "./repos/institution.repo.js";
import jobRepo from "./repos/job.repo.js";
import jobTypeRepo from "./repos/jobType.repo.js";
import jobRoleRepo from "./repos/jobRole.repo.js";
import keyWaysRepo from "./repos/keyWays.repo.js";
import languageRepo from "./repos/language.repo.js";
import majorRepo from "./repos/major.repo.js";
import mentorRepo from "./repos/mentor.repo.js";
import mentoringProgramOptionRepo from "./repos/mentoringProgramOptions.repo.js";
import mentorShipGuideLineRepo from "./repos/mentorShipGuideLine.repo.js";
import meetingRepo from "./repos/meeting.repo.js";
import meetingDurationRepo from "./repos/meetingDuration.repo.js";
import mentorShipTypeRepo from "./repos/mentorShipType.repo.js";
import messageRepo from "./repos/message.repo.js";
import notificationMethodRepo from "./repos/notificationMethod.repo.js";
import notificationTypeRepo from "./repos/notificationType.repo.js";
import resourcesFindingJobRepo from "./repos/resourcesFindingJob.repo.js";
import reviewRepo from "./repos/review.repo.js";
// import reviewOptionsRepo from "./repos/reviewOptions.repo.js";
import socialMediaRepo from "./repos/socialMedia.repo.js";
import studentRepo from "./repos/student.repo.js";
import subIndustryRepo from "./repos/subIndustry.repo.js";
import userRepo from "./repos/user.repo.js";
import userAttachmentRepo from "./repos/userAttachment.repo.js";
import userNotificationsRepo from "./repos/userNotifications.repo.js";
import workTypeRepo from "./repos/workType.repo.js";
import institutionVersionRepo from "./repos/institutionVersion.repo.js";
import companyVersionRepo from "./repos/companyVersion.repo.js";
import userVersionRepo from "./repos/userVersion.repo.js";
import provinceRepo from "./repos/province.repo.js";
//#endregion repos imports

export {
  adminRepo,
  profileViewsRepo,
  applicationRepo,
  areaInterestRepo,
  chatRepo,
  cityRepo,
  companyRepo,
  companyFollowersRepo,
  companyGuideLineRepo,
  countryRepo,
  currencyRepo,
  didYouGetOfferRepo,
  domainRepo,
  educationLevelGroupRepo,
  educationLevelRepo,
  howDidYouGetPaidRepo,
  industryRepo,
  institutionRepo,
  jobRepo,
  jobTypeRepo,
  keyWaysRepo,
  languageRepo,
  mentorRepo,
  mentoringProgramOptionRepo,
  mentorShipGuideLineRepo,
  meetingRepo,
  meetingDurationRepo,
  mentorShipTypeRepo,
  messageRepo,
  notificationMethodRepo,
  notificationTypeRepo,
  resourcesFindingJobRepo,
  reviewRepo,
  socialMediaRepo,
  studentRepo,
  subIndustryRepo,
  userRepo,
  userAttachmentRepo,
  userNotificationsRepo,
  workTypeRepo,
  majorRepo,
  jobRoleRepo,
  appStateRepo,
  institutionVersionRepo,
  companyVersionRepo,
  userVersionRepo,
  provinceRepo,
};
