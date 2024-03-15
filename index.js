import dotEnv from "dotenv";
dotEnv.config();

import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

import errorHandler from "./api/helper/errorHandler.js";
import { NotFoundError } from "./api/error/errors.js";

//#region initializing app
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
//#endregion initializing app

//#region routes
import adminRoutes from "./api/routes/admin.routes.js";
import applicationRoutes from "./api/routes/application.routes.js";
import areaInterestRoutes from "./api/routes/areaInterest.routes.js";
import chatRoutes from "./api/routes/chat.routes.js";
import cityRoutes from "./api/routes/city.routes.js";
import companyRoutes from "./api/routes/company.routes.js";
import companyFollowersRoutes from "./api/routes/companyFollowers.routes.js";
import companyGuideLineRoutes from "./api/routes/companyGuideLine.routes.js";
import countryRoutes from "./api/routes/country.routes.js";
import currencyRoutes from "./api/routes/currency.routes.js";
import didYouGetOfferRoutes from "./api/routes/didYouGetOffer.routes.js";
import domainRoutes from "./api/routes/domain.routes.js";
import majorRoutes from "./api/routes/major.routes.js";
import educationLevelGroupRoutes from "./api/routes/educationLevelGroup.routes.js";
import educationLevelRoutes from "./api/routes/educationLevel.routes.js";
import howDidYouGetPaidRoutes from "./api/routes/howDidYouGetPaid.routes.js";
import industryRoutes from "./api/routes/industry.routes.js";
import institutionRoutes from "./api/routes/institution.routes.js";
import jobRoutes from "./api/routes/job.routes.js";
import jobTypeRoutes from "./api/routes/jobType.routes.js";
import jobRoleRoutes from "./api/routes/jobRole.routes.js";
import keyWaysRoutes from "./api/routes/keyWays.routes.js";
import languageRoutes from "./api/routes/language.routes.js";
import mentorRoutes from "./api/routes/mentor.routes.js";
import mentorProgramOptionsRoutes from "./api/routes/mentoringProgramOptions.routes.js";
import mentorShipGuideLineRoutes from "./api/routes/mentorShipGuideLine.routes.js";
import meetingRoutes from "./api/routes/meeting.routes.js";
import meetingDurationRoutes from "./api/routes/meetingDuration.routes.js";
import mentorShipTypeRoutes from "./api/routes/mentorShipType.routes.js";
import messageRoutes from "./api/routes/message.routes.js";
import notificationMethodRoutes from "./api/routes/notificationMethod.routes.js";
import notificationTypeRoutes from "./api/routes/notificationType.routes.js";
import resourcesFindingJobRoutes from "./api/routes/resourcesFindingJob.routes.js";
import reviewRoutes from "./api/routes/review.routes.js";
import reviewOptionsRoutes from "./api/routes/reviewOptions.routes.js";
import socialMediaRoutes from "./api/routes/socialMedia.routes.js";
import studentRoutes from "./api/routes/student.routes.js";
import subIndustryRoutes from "./api/routes/subIndustry.routes.js";
import userRoutes from "./api/routes/user.routes.js";
import userAttachmentRoutes from "./api/routes/userAttachment.routes.js";
import userNotificationsRoutes from "./api/routes/userNotifications.routes.js";
import workTypeRoutes from "./api/routes/workType.routes.js";
import appStateRoutes from "./api/routes/appState.routes.js";
import searchRoutes from "./api/routes/search.routes.js";
import provinceRoutes from "./api/routes/province.routes.js";

// app.use('/', (req, res) => {
//     res.send('Edqan API')
// });

//sub models route
app.use("/didYouGetOffer", didYouGetOfferRoutes);
app.use("/domain", domainRoutes);
app.use("/howDidYouGetPaid", howDidYouGetPaidRoutes);
app.use("/mentoringProgramOptions", mentorProgramOptionsRoutes);
app.use("/resourcesFindingJob", resourcesFindingJobRoutes);
app.use("/socialMedia", socialMediaRoutes);

app.use("/application", applicationRoutes);
app.use("/areaInterest", areaInterestRoutes);
app.use("/chat", chatRoutes);
app.use("/city", cityRoutes);
app.use("/company", companyRoutes);
app.use("/companyGuideLine", companyGuideLineRoutes);
app.use("/companyFollowers", companyFollowersRoutes);
app.use("/country", countryRoutes);
app.use("/currency", currencyRoutes);
app.use("/educationLevelGroup", educationLevelGroupRoutes);
app.use("/educationLevel", educationLevelRoutes);
app.use("/industry", industryRoutes);
app.use("/institution", institutionRoutes);
app.use("/job", jobRoutes);
app.use("/jobType", jobTypeRoutes);
app.use("/jobRole", jobRoleRoutes);
app.use("/keyWays", keyWaysRoutes);
app.use("/language", languageRoutes);
app.use("/meeting", meetingRoutes);
app.use("/mentor", mentorRoutes);
app.use("/mentorShipGuideLine", mentorShipGuideLineRoutes);
app.use("/meeting", meetingRoutes);
app.use("/meetingDuration", meetingDurationRoutes);
app.use("/mentorShipType", mentorShipTypeRoutes);
app.use("/message", messageRoutes);
app.use("/notificationMethod", notificationMethodRoutes);
app.use("/notificationType", notificationTypeRoutes);
app.use("/review", reviewRoutes);
app.use("/reviewOptions", reviewOptionsRoutes);
app.use("/student", studentRoutes);
app.use("/subIndustry", subIndustryRoutes);
app.use("/user", userRoutes);
app.use("/userAttachment", userAttachmentRoutes);
app.use("/major", majorRoutes);
app.use("/userNotifications", userNotificationsRoutes);
app.use("/workType", workTypeRoutes);
app.use("/admin", adminRoutes);
app.use("/appState", appStateRoutes);
app.use("/search", searchRoutes);
app.use("/province", provinceRoutes);

app.use((req, res, next) => {
  res.sendStatus(404);
});
//#endregion routes

//#region error handling
//invalid resource error handling
app.use((req, res, next) => {
  next(new NotFoundError()); //hint: i passed the err object in the next fn, so the next fn will call upon a middleware which have a forth argument which is the err
});
//handling all kinds of errors from every where in the app

//I'm using this here to handle not found errors
app.use(errorHandler);
//#endregion error handling

app.listen(process.env.SERVER_PORT, () => console.log("Server is listening on port 3000"));
