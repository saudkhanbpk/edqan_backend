import { jobRepo, studentRepo, applicationRepo, userRepo } from "../data-access-layer/index.js";
import notificationTypeEnum from "../types/notificationType.enum.js";
import userNotificationsUseCase from "./userNotifications.use-case.js";
import { makeJob } from "../entities/index.js";
import { CompanyPostedJob, JobApprovedByAdmin, CompanyUpdatedJobPost } from "../notificationData/notificationData.js";
import studentModel from "../data-access-layer/models/student.model.js";

async function createJobUseCase(jobInfo, companyId) {
  jobInfo.datePosted = new Date();
  const newJob = await makeJob({ ...jobInfo, company: companyId });
  const savedJob = await jobRepo.insert(newJob);
  // get company name
  const companyName = await userRepo.findById(newJob.company).then((user) => user.subModel.name);
  // send notification to the company
  await userNotificationsUseCase.createUserNotificationsUseCase(
    notificationTypeEnum.COMPANY_POSTED_JOB,
    companyId,
    new CompanyPostedJob(companyName, savedJob.name)
  );
}
async function getJobsUseCase(query, paginationQuery) {
  return await jobRepo.findAll(query?.workType, query?.jobType, query?.city, query?.searchTerm, query?.company,query?.industry, query?.status,query?.major,paginationQuery);
}
async function getJobByIdUseCase(jobId, saveMajor, userId, user = null) {
  let job = await jobRepo.findById(jobId);

  if (!user==null&&user.model=="Student") {
    //to be updated later on
    if (job?.views < 2000) {
      await jobRepo.updateById(jobId, { $inc: { views: job.views + 1 } });
    }
   
  }
  if (userId) {
    // finds the user object of the student that is calling this use case
    let user = await userRepo.findById(userId);

    // if the save flag is passed then I add the major to the student to be able to find jobs in the future by this major
    if (saveMajor) {
      if (job.major) {
        saveMajor = {
          jobMajors: job.major?._id,
        };
        await studentRepo.addjobMajor(user.subModel._id, saveMajor);
      }
      // await jobRepo.updateById(jobId, { $inc: { views: 1 } });
    }

    // job preference matching to the user

    let newJobPreference = {};

    if (job.jobPreference.fluentLanguage?._id) {
      const fluentLanguageIds = user.subModel.fluentLanguage.map((language) => language._id.toString());

      if (fluentLanguageIds.includes(job.jobPreference.fluentLanguage._id.toString())) {
        newJobPreference.fluentLanguage = {
          term: "Language Fluency",
          matches: true,
        };
      } else {
        newJobPreference.fluentLanguage = {
          term: "Language Fluency",
          matches: false,
        };
      }
    }
    if (job.jobPreference.gpa) {
      if (user.subModel?.gpa >= job.jobPreference.gpa) newJobPreference.gpa = { term: "GPA", matches: true };
      else newJobPreference.gpa = { term: "GPA", matches: false };
    }
    if (job.jobPreference.major) {
      //major in submodel is an array of ids
      const majorIds = user.subModel.major.map((major) => major._id.toString());
      if (majorIds.includes(String(job.major._id))) newJobPreference.major = { term: "Major", matches: true };
      else newJobPreference.major = { term: "Major", matches: false };
    }


    if (job.jobPreference.graduationDate) {
      // Calculate the range for graduation date matching (3 months before and after)
      const currentDate = new Date(job.jobPreference.graduationDate);
      const threeMonthsBefore = new Date(currentDate);
      threeMonthsBefore.setMonth(currentDate.getMonth() - 3);
      const threeMonthsAfter = new Date(currentDate);
      threeMonthsAfter.setMonth(currentDate.getMonth() + 3);
      const userGraduationDate = user.subModel?.graduationDate;
      if (
        userGraduationDate &&
        userGraduationDate >= threeMonthsBefore &&
        userGraduationDate <= threeMonthsAfter
      ) {
        newJobPreference.graduationDate = {
          term: "graduation Date",
          matches: true,
        };
      } else {
        newJobPreference.graduationDate = {
          term: "graduation Date",
          matches: false,
        };
      }
    }
    if (job.jobPreference.location) {
      // to be checked for later if the property itself is the _id or the _id is nested
      if (String(job.country?._id) == String(user.country?._id) && String(job.city?._id) === String(user.city?._id))
        newJobPreference.location = { term: "location", matches: true };
      else newJobPreference.location = { term: "location", matches: false };
    }

    job.jobPreference = newJobPreference;


    //pass an applied flag to the returned job object as a flag to the front end

    let applied = await applicationRepo.findByStudentAndJob(userId, jobId);
    if (applied.length > 0) {
      job.applied = true;
    } else {
      job.applied = false;
    }
  }
  return job;
}
async function updateJobByIdUseCase(jobId, jobInfo) {
  // get old job
  const oldJob = await jobRepo.findJobByIdWithoutPopulate(jobId);
  // update job
  let updatedJob = { ...oldJob, ...jobInfo };

  if (jobInfo.jobPreference) {
    updatedJob.jobPreference = {
      ...oldJob?.jobPreference,
      ...jobInfo.jobPreference,
    };
  }
  const newJob = makeJob(updatedJob);
  await jobRepo.updateById(jobId, newJob);
  // get company name
  const companyName = await userRepo.findById(newJob.company).then((user) => user.subModel.name);
  // check if the approved flag is changed, only admin can change it, this rule is defined in access control layer
  if (oldJob.approved != newJob.approved) {
    await userNotificationsUseCase.createUserNotificationsUseCase(
      notificationTypeEnum.JOB_APPROVED_BY_ADMIN,
      newJob.company,
      new JobApprovedByAdmin(companyName, newJob.name)
    );
  } else {
    // if the approved flag is not changed, this means that the company was updated by itself, so I send notification about the update
    await userNotificationsUseCase.createUserNotificationsUseCase(
      notificationTypeEnum.COMPANY_UPDATED_JOB_POST,
      newJob.company,
      new CompanyUpdatedJobPost(companyName, newJob.name)
    );
  }
}
async function getRecentJobsUseCase(user, query) {
  let student = await studentModel.findById(user.subModel._id).lean();
  let studentInterests = {};
  // studentInterests.major = student?.major;
  if (student.careerInterest) {
    studentInterests.subIndustry = student.careerInterest.subIndustry;
  }
  return await jobRepo.findRecentJobs(studentInterests, query);
}
async function getJobsBasedOnMajor(major, query, paginationQuery) {
  return await jobRepo.jobsBasedOnMajor(major, query, paginationQuery);

}
async function searchUseCase(searchData, query) {
  return await jobRepo.findJobsWithQuery(searchData?.workType, searchData?.jobType, searchData?.city, searchData?.searchTerm, query);
}
async function removeJobByIdUseCase(jobId) {
  return await jobRepo.removeById(jobId);
}
async function findJobsByCompany(companyId, paginationQuery) {
  return await jobRepo.findJobsByCompany(companyId, paginationQuery);
}
async function approveJobByIdUseCase(jobId, approved) {
  return await jobRepo.updateApproved(jobId, approved);
}
async function countJobsUseCase() {
  return await jobRepo.countAllJobs();
}

export default {
  createJobUseCase,
  getJobsUseCase,
  getJobByIdUseCase,
  updateJobByIdUseCase,
  getRecentJobsUseCase,
  getJobsBasedOnMajor,
  removeJobByIdUseCase,
  findJobsByCompany,
  approveJobByIdUseCase,
  countJobsUseCase,
  searchUseCase,
};
