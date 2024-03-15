import { applicationRepo, userRepo, jobRepo } from "../data-access-layer/index.js";
import notificationTypeEnum from "../types/notificationType.enum.js";
import userNotificationsUseCase from "./userNotifications.use-case.js";
import { makeApplication } from "../entities/index.js";
import { JobApplicationStatusChanged, StudentAppliedForJob, StudentAppliesForJob } from "../notificationData/notificationData.js";
import applicationStatusEnum from "../types/applicationStatus.enum.js";
import messageUseCase from "./message.use-case.js";
import messageStatusEnum from "../types/messageStatus.enum.js";

async function createApplicationUseCase(userId, applicationInfo) {
  let student = await userRepo.findByIdWithoutPopulate(userId);
  // checks if the user applying is not a student
  if (student?.model != "Student") throw new Error("student not found");
  // checks if the student has already applied for the job
  let existApplication = await applicationRepo.findByStudentAndJob(userId, applicationInfo.job);
  if (existApplication.length > 0) throw new Error("application already exists");
  // setting the application info
  applicationInfo.user = userId;
  applicationInfo.status = applicationStatusEnum.PENDING;
  if (applicationInfo.cvPath) applicationInfo.existingCv = undefined;
  if (applicationInfo.coverLetterPath) applicationInfo.existingCoverLetter = undefined;
  // getting job details
  let jobDetails = await jobRepo.findJobByIdWithoutPopulate(applicationInfo.job);
 if(jobDetails.status!='approved') throw new Error("You Can't Apply For This job, it is not approved");
 


  

  // setting the company id
  applicationInfo.company = jobDetails.company;
  // setting the questions and answers if they exist
  if (applicationInfo.questionsAnswers && applicationInfo.questionsAnswers.length > 0) {
    applicationInfo.questionsAnswers = JSON.parse(applicationInfo.questionsAnswers);
  }
  // make application repo call
  const newApplication = await makeApplication(applicationInfo);
  // inserting the application in the database
  await applicationRepo.insert(newApplication);
  // gets the company name
  const { name: companyName, jobApplicationMessages } = await userRepo.findById(newApplication.company).then((user) => user.subModel);
  // gets the student name
  const studentName = await userRepo.findById(newApplication.user).then((user) => user.subModel.firstName + " " + user.subModel.lastName);
  // sends notification to the student
  await userNotificationsUseCase.createUserNotificationsUseCase(
    notificationTypeEnum.STUDENT_APPLIED_FOR_JOB,
    newApplication.user,
    new StudentAppliedForJob(studentName, companyName, jobDetails.name, jobApplicationMessages.received)
  );
  // sends a message to the student
  await messageUseCase.createMessageUseCase(
    {
      message: jobApplicationMessages.received,
      receiver: newApplication.user,
      sender: newApplication.company,
      status: messageStatusEnum.DELIVERED,
      job: [newApplication.job],
    },
    newApplication.company
  );
  // sends notification to the company
  await userNotificationsUseCase.createUserNotificationsUseCase(
    notificationTypeEnum.STUDENT_APPLIES_FOR_JOB,
    newApplication.company,
    new StudentAppliesForJob(studentName, companyName, jobDetails.name)
  );
}

async function getApplicationsUseCase(userId, filter, query) {
  return await applicationRepo.findAll(userId, filter?.status, filter?.job, filter?.dateFrom, filter?.dateTo, query);
}

async function getApplicationByIdUseCase(applicationId) {
  return await applicationRepo.findById(applicationId);
}

async function updateApplicationByIdUseCase(applicationId, applicationInfo) {
  let oldApplication = await applicationRepo.findByIdWithoutPopulate(applicationId);

  const newApplication = await makeApplication({
    ...oldApplication,
    ...applicationInfo,
  });

  await applicationRepo.updateById(applicationId, newApplication);

  if (applicationInfo.status) {
    // gets student name
    const studentName = await userRepo.findById(newApplication.user).then((user) => user.subModel.firstName + " " + user.subModel.lastName);
    // gets job name
    const jobName = await jobRepo.findById(newApplication.job).then((job) => job.name);
    // gets the company name
    const { name: companyName, jobApplicationMessages } = await userRepo.findById(newApplication.company).then((user) => user.subModel);
    // sends notification to the student
    await userNotificationsUseCase.createUserNotificationsUseCase(
      notificationTypeEnum.JOB_APPLICATION_STATUS_CHANGED,
      newApplication.user,
      new JobApplicationStatusChanged(studentName, companyName, jobName, `${process.env.APPLICATION_URL}job-details/${newApplication.job}`)
    );
    // sends a message to the student
    await messageUseCase.createMessageUseCase(
      {
        message: applicationInfo.status == applicationStatusEnum.HIRED ? jobApplicationMessages.hired : jobApplicationMessages.notSelected,
        receiver: newApplication.user,
        sender: newApplication.company,
        status: messageStatusEnum.DELIVERED,
        job: [oldApplication.job],
      },
      newApplication.company
    );
  }
}

async function getApplicationByJobIdUseCase(jobId, query, paginationQuery) {
  return await applicationRepo.findByJobId(jobId, query.status, paginationQuery);
}



export default {
  createApplicationUseCase,
  getApplicationsUseCase,
  getApplicationByIdUseCase,
  updateApplicationByIdUseCase,
  getApplicationByJobIdUseCase,
};
