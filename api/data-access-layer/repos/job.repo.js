import jobModel from "../models/job.model.js";
import paginator from "../../helper/paginator.js";
import applicationModel from "../models/application.model.js";
import messageModel from "../models/message.model.js";
import studentModel from "../models/student.model.js";
import fs from "fs";

async function findJobByIdWithoutPopulate(jobId) {
  return await jobModel.findById(jobId).lean();
}
async function findAll(workType, jobType, city, searchTerm, company, industry, status, major, paginationQuery) {
  let query = {};
  const currentDate = new Date(); // Current date and time

  currentDate.setHours(0, 0, 0, 0); // Set time to 00:00 (midnight)

  // query.deadLine = { $gte: currentDate }; // Between current date and 12:00 PM

  // query.deadLine = { $gte: currentDate };
  if (status == 'approved' || status == 'pending') query.status = status;
  if (industry) query.industry = industry;
  if (workType) query.workType = workType;
  if (jobType) query.jobType = jobType;
  if (major) query.major = major;
  // if (industry) query.industry = industry;
  if (searchTerm) {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    query.$or = [
      { roleDescription: { $regex: lowercasedSearchTerm, $options: 'i' } },
      { name: { $regex: lowercasedSearchTerm, $options: 'i' } }
    ];
  }
  if (company) query.company = company;
  if (city) query.city = city;
  const queryResult = await paginator(
    jobModel,
    query,
    paginationQuery,
    [
      {
        path: "company",
        populate: ["subModel", "country", "city", "province"],
      },
      "jobType",
      "currency",
      "workType",
      "city",
      "province",
      "country",
      "major",
      "jobPreference.fluentLanguage",
    ],
    { createdAt: -1 }
  );

  return queryResult;
}
async function findRecentJobs(studentIndustries, paginationQuery) {
  let query = {};
  // query.major = { $in: studentIndustries.major };
  const currentDate = new Date(); // Current date and time

  currentDate.setHours(0, 0, 0, 0); // Set time to 00:00 (midnight)


  // query.deadLine = { $gte: currentDate };
  query.status = 'approved';
  // if (studentIndustries.subIndustry) {
  query = {
    $and: [
      {
        $or: [
          // { major: { $in: studentIndustries.major } },
          { subIndustry: { $in: studentIndustries.subIndustry } },
        ],
      },
      { deadLine: { $gte: currentDate } },
      { status: 'approved' },
    ],
  };
  // }

  const queryResult = await paginator(
    jobModel,
    query,
    paginationQuery,
    [
      {
        path: "company",
        populate: [
          {
            path: "subModel",
            populate: [{ path: "headQuarters", populate: ["country", "city", "province"] }],
          },
        ],
      },
      {
        path: "company",
        populate: [
          {
            path: "subModel",
            populate: [{ path: "industries", populate: ["industry", "subIndustries"] }],
          },
        ],
      },
      {
        path: "company",
        populate: [
          {
            path: "city",
            populate: [{ path: "country" }],
          },
        ],
      },
      {
        path: "company",
        populate: [
          {
            path: "country"
          },
        ],
      },
      "jobType",
      "currency",
      "workType",
      "city",
      "country",
      "province",
      {
        path: "city",
        populate: [{ path: "country" }],
      },
      "major",
      "jobPreference.fluentLanguage",
    ],
    { createdAt: -1 }
  );

  return queryResult;
}
async function jobsBasedOnMajor(major, queryParam, paginationQuery) {
  let query = {};
  const currentDate = new Date(); // Current date and time

  currentDate.setHours(0, 0, 0, 0); // Set time to 00:00 (midnight)

  //if query.currentJob exclude from the query this currentJob id
  if (queryParam.currentJob) {
    query._id = { $ne: queryParam.currentJob };
  }

  // query.deadLine = { $gte: currentDate };
  query.major = major;
  query.status = 'approved';
  const queryResult = await paginator(
    jobModel,
    query,
    paginationQuery,
    [
      {
        path: "company",
        populate: [
          {
            path: "subModel",
            populate: [{ path: "headQuarters", populate: ["country", "city", "province"] }],
          },
        ],
      },
      {
        path: "company",
        populate: [
          {
            path: "subModel",
            populate: [{ path: "industries", populate: ["industry", "subIndustries"] }],
          },
        ],
      },
      {
        path: "company",
        populate: [
          {
            path: "city",
            populate: [{ path: "country" }],
          },
        ],
      },
      {
        path: "company",
        populate: [
          {
            path: "country"
          },
        ],
      },
      "jobType",
      "currency",
      "country",
      "city",
      "province",
      {
        path: "city",
        populate: [{ path: "country" }],
      },
      "workType",
      "major",
      "jobPreference.fluentLanguage",
    ],
    { createdAt: -1 }
  );

  return queryResult;
}
// make function to return all jobs for a company and populate all fields and use paginationQuery
async function findJobsByCompany(company, paginationQuery) {
  let query = {};
  const currentDate = new Date(); // Current date and time

  currentDate.setHours(0, 0, 0, 0); // Set time to 00:00 (midnight)


  // query.deadLine = { $gte: currentDate };
  query.company = company;
  const queryResult = await paginator(
    jobModel,
    query,
    paginationQuery,
    [
      "company.subModel",
      "jobType",
      "currency",
      "company",
      "city",
      "country",
      "province",
      {
        path: "city",
        populate: [{ path: "country" }],
      },
      "workType",
      "major",
      "jobPreference.fluentLanguage",
    ],
    { createdAt: -1 }
  );

  return queryResult;
}
async function findById(jobId) {
  let jobData = await jobModel
    .findById(jobId)
    .populate("company")
    .populate("city")
    .populate("country")
    .populate("province")
    // .populate({
    //   path: "city",
    //   populate: [{ path: "country" }],
    // })

    .populate("jobType")
    .populate("workType")
    .populate("currency")
    .populate("major")
    .populate("jobPreference.fluentLanguage")
    .populate({ path: "major" })
    .populate({
      path: "company",
      populate: [
        {
          path: "subModel",
          populate: [{ path: "headQuarters", populate: ["country", "city", "province"] }],
        },
      ],
    })
    .populate({
      path: "company",
      populate: [
        {
          path: "subModel",
          populate: [{ path: "industries", populate: ["industry", "subIndustries"] }],
        },
      ],
    })
    .populate("industry")
    .populate("subIndustry")
    .lean();
  // jobData.company.companyMedia = await companyMediaModel.find({ company: jobData.company._id }).lean();
  return jobData;
}
async function updateById(jobId, updatedJobInfo) {
  return await jobModel
    .findByIdAndUpdate(jobId, updatedJobInfo, {
      new: true,
      runValidators: true,
    })
    .lean();
}
async function insert(jobInfo) {
  const newJob = new jobModel(jobInfo);
  await newJob.save();
  return newJob;
}
async function removeById(JobId) {
  let applicationAttachments = await applicationModel.find({ job: JobId });
  for (let i = 0; i < applicationAttachments.length; i++) {
    if (applicationAttachments[i]) {
      //check if it has coverLetterPath or  cvPath
      if (applicationAttachments[i]?.coverLetterPath) {
        try {
          let url = applicationAttachments[i].coverLetterPath.replace(/^[a-zA-Z]{3,5}\:\/{2}[a-zA-Z0-9_.:-]+\//, "");
          await fs.unlinkSync(url);
        } catch (error) {
        }
      }
      if (applicationAttachments[i]?.cvPath) {
        try {
          let url = applicationAttachments[i].cvPath.replace(/^[a-zA-Z]{3,5}\:\/{2}[a-zA-Z0-9_.:-]+\//, "");
          await fs.unlinkSync(url);
        } catch (error) {
        }
      }
    }
  }



  await applicationModel.deleteMany({ job: JobId });
  await messageModel.deleteMany({ job: JobId });
  await studentModel.updateMany({ "savedJobs.job": JobId }, { $pull: { savedJobs: { job: JobId } } });
  await jobModel.deleteOne({ _id: JobId });
  return;
}
async function findJobsWithQuery(workType, jobType, city, searchTerm) {
  let query = {};
  const currentDate = new Date(); // Current date and time

  currentDate.setHours(0, 0, 0, 0); // Set time to 00:00 (midnight)


  query.deadLine = { $gte: currentDate };
  query.status = 'approved';
  if (workType) query.workType = workType;
  if (jobType) query.jobType = jobType;
  if (searchTerm) {
    query.name = { $regex: searchTerm };
    query.roleDescription = { $regex: searchTerm };
  }
  if (city) query.city = city;
  return await jobModel.find(query).populate("company").populate("company.subModel").lean();
}
//make function that returns number of views for specific job by job id and company id
async function findNumberOfViews(companyId, jobId) {
  return await jobModel.findOne({ company: companyId, _id: jobId }).select("views -_id").lean();
}
//make function to only update field approved
async function updateApproved(jobId, approved) {
  return await jobModel.findByIdAndUpdate(jobId, { status: approved }, { new: true }).lean();
}
//count all jobs in database
async function countAllJobs() {
  return await jobModel.countDocuments();
}
export default {
  findAll,
  insert,
  findById,
  updateById,
  removeById,
  findRecentJobs,
  jobsBasedOnMajor,
  findJobsWithQuery,
  findJobByIdWithoutPopulate,
  findJobsByCompany,
  findNumberOfViews,
  updateApproved,
  countAllJobs,
};
