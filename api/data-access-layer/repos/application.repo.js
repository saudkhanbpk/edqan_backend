import applicationModel from "../models/application.model.js";
import jobModel from "../models/job.model.js";
import studentModel from "../models/student.model.js";
import companyModel from "../models/company.model.js";
import paginator from "../../helper/paginator.js";
import workTypeModel from "../models/workType.model.js";
import userModel from "../models/user.model.js";
import companyRepo from "./company.repo.js";
import userTypesModelNamesEnum from "../../types/userTypesModelNames.enum.js";
async function findAll(userId, status, job, dateFrom, dateTo, paginationQuery) {
  let query = {};
  query.user = userId;
  if (job) {
    let search = {};
    const lowercasedSearchTerm = job.toLowerCase();
    search.$or = [
      { roleDescription: { $regex: lowercasedSearchTerm, $options: 'i' } },
      { name: { $regex: lowercasedSearchTerm, $options: 'i' } }
    ];
    query.job = await jobModel.find(search).select("_id");
  }
  if (status) query.status = status;
  if (dateFrom)
    query["createdAt"] = {
      $gte: new Date(dateFrom).toISOString(),
      $lte: new Date(dateTo).toISOString(),
    };

  const queryResult = await paginator(applicationModel, query, paginationQuery, [
    "job",
    "existingCv",
    "existingCoverLetter",
    {
      path: "job",
      populate: [{ path: "jobType" }],
    },
    {
      path: "job",
      populate: [{ path: "currency" }],
    },
    {
      path: "job",
      populate: [{ path: "workType" }],
    },
    {
      path: "job",
      populate: [{ path: "company" }],
    },
    {
      path: "user",
      populate: [{ path: "subModel" }],
    },
    {
      path: "job",
      populate: [
        {
          path: "company",
          populate: [
            {
              path: "subModel",
              populate: [{ path: "headQuarters", populate: ["country", "city", "province"] }],
            },
          ],
        },
      ],
    },
    {
      path: "job",
      populate: [{ path: "city" }],
    },
  ]);

  return queryResult;
}
async function findByJobId(jobId, status, paginationQuery) {
  let query = {};
  query.job = jobId;
  if (status) query.status = status;
  const apps = await paginator(applicationModel, query, paginationQuery, [
    "job",
    "existingCv",
    "existingCoverLetter",
    {
      path: "user",
      populate: [{ path: "subModel" }],
    },
    {
      path: "job",
      populate: [{ path: "jobType" }],
    },
    {
      path: "user",
      populate: [{ path: "subModel" }],
    },
    {
      path: "job",
      populate: [{ path: "currency" }],
    },
    {
      path: "job",
      populate: [{ path: "workType" }],
    },
    {
      path: "job",
      populate: [{ path: "company" }],
    },
    {
      path: "job",
      populate: [
        {
          path: "company",
          populate: [
            {
              path: "subModel",
              populate: [{ path: "headQuarters", populate: ["country", "city", "province"] }],
            },
          ],
        },
      ],
    },
    {
      path: "job",
      populate: [{ path: "city" }],
    },
  ]);

  for (let i = 0; i < apps.queryResult.length; i++) {
    // replace the existingCv and existingCoverLetter with the attachment
    if (apps.queryResult[i].existingCv) {
      apps.queryResult[i].existingCv = apps.queryResult[i].existingCv.attachment;
    }
    if (apps.queryResult[i].existingCoverLetter) {
      apps.queryResult[i].existingCoverLetter = apps.queryResult[i].existingCoverLetter.attachment;
    }
  }
  return apps;
}
async function findById(applicationId) {
  return await applicationModel
    .findById(applicationId)
    .populate([
      "job",
      "existingCv",
      "existingCoverLetter",
      {
        path: "user",
        populate: [{ path: "subModel" }],
      },
      {
        path: "job",
        populate: [{ path: "jobType" }],
      },
      {
        path: "job",
        populate: [{ path: "currency" }],
      },
      {
        path: "job",
        populate: [{ path: "workType" }],
      },
      {
        path: "job",
        populate: [{ path: "company" }],
      },
      {
        path: "job",
        populate: [
          {
            path: "company",
            populate: [
              {
                path: "subModel",
                populate: [{ path: "headQuarters", populate: ["country", "city", "province"] }],
              },
            ],
          },
        ],
      },
      {
        path: "job",
        populate: [{ path: "city" }],
      },
    ])
    .lean();
}
async function findByIdWithoutPopulate(applicationId) {
  return await applicationModel.findById(applicationId).lean();
}
async function findByStudentAndJob(studentId, jobId) {
  return await applicationModel.find({ user: studentId, job: jobId }).lean();
}
async function updateById(applicationId, updatedApplicationInfo) {
  return await applicationModel
    .findByIdAndUpdate(applicationId, updatedApplicationInfo, {
      new: true,
      runValidators: true,
    })
    .populate([
      "job",
      "existingCv",
      "existingCoverLetter",
      {
        path: "job",
        populate: [{ path: "jobType" }],
      },
      {
        path: "user",
        populate: [{ path: "subModel" }],
      },
      {
        path: "job",
        populate: [{ path: "currency" }],
      },
      {
        path: "job",
        populate: [{ path: "workType" }],
      },
      {
        path: "job",
        populate: [{ path: "company" }],
      },
      {
        path: "job",
        populate: [
          {
            path: "company",
            populate: [
              {
                path: "subModel",
                populate: [{ path: "headQuarters", populate: ["country", "city", "province"] }],
              },
            ],
          },
        ],
      },
      {
        path: "job",
        populate: [{ path: "city" }],
      },
    ])
    .lean();
}
async function insert(applicationInfo) {
  const newApplication = new applicationModel(applicationInfo);
  await newApplication.save();
  return newApplication;
}
async function removeApplicationById(ApplicationId) {
  let application = await applicationModel.findById(ApplicationId);
  if (application) {
    if (application?.coverLetterPath) {
      let url = application.coverLetterPath.replace(/^[a-zA-Z]{3,5}\:\/{2}[a-zA-Z0-9_.:-]+\//, "");
      await fs.unlinkSync(url);
    }
    if (application?.cvPath) {
      let url = application.cvPath.replace(/^[a-zA-Z]{3,5}\:\/{2}[a-zA-Z0-9_.:-]+\//, "");
      await fs.unlinkSync(url);
    }
  }
  await applicationModel.deleteOne({ _id: ApplicationId });
  return;
}
//dashboard analytics

//make  function returns number of distinct users who applied to jobs in time range
async function getNumberOfDistinctUsersWhoAppliedToJobsInTimeRange(startDate, endDate) {
  return await applicationModel
    .distinct("user", {
      createdAt: {
        $gte: new Date(startDate).toISOString(),
        $lte: new Date(endDate).toISOString(),
      },
    })
    .countDocuments();
}
//make function returns number of distinct users where status is hired in time range
async function getNumberOfDistinctUsersWhereStatusIsHiredInTimeRange(startDate, endDate) {
  return await applicationModel
    .distinct("user", {
      status: "1",
      createdAt: {
        $gte: new Date(startDate).toISOString(),
        $lte: new Date(endDate).toISOString(),
      },
    })
    .countDocuments();
}
//make function returns number of distinct users where status is hired related to specific company job in time range
async function getNumberOfDistinctUsersByCompanyWhereStatusIsHiredInTimeRange(companyId, dateFrom, dateTo) {
  return await applicationModel
    .distinct("user", {
      company: companyId,
      status: "1",
      createdAt: {
        $gte: new Date(dateFrom).toISOString(),
        $lte: new Date(dateTo).toISOString(),
      },
    })
    .countDocuments();
}
async function getUserCountByCompanyAndFilters(companyId, workType, jobType, startDate, endDate) {
  try {
    let query = {};
    query.company = companyId;
    if (workType) query.workType = workType;
    if (jobType) query.jobType = jobType;

    const jobIds = await jobModel.find(query).distinct("_id");

    // Convert the endDate to a Date object and set it to the end of the day
    const endOfDay = new Date(endDate);
    endOfDay.setUTCHours(23, 59, 59, 999); // Set to 23:59:59.999 UTC

    const userCount = await applicationModel.countDocuments({
      company: companyId,
      job: { $in: jobIds },
      createdAt: {
        $gte: new Date(startDate).toISOString(),
        $lte: endOfDay.toISOString(),
      },
    });
    return userCount;
  } catch (error) {
    // Handle the error
    console.error(error);
  }
}


async function getUsersByCompanyAndInstitution(institutionId) {
  //get distinct users count where user.subModel is equal to institutionId

  const students = await studentModel.find({ institution: institutionId }).lean();
  const usersIds = students.map((student) => student.user);

  const applications = await applicationModel.find({ user: { $in: usersIds }, status: "1" }).lean();
  const applicationCountsByCompany = {};

  for (const application of applications) {
    const companyId = application.company.toString();
    if (!applicationCountsByCompany[companyId]) {
      applicationCountsByCompany[companyId] = 0;
    }
    applicationCountsByCompany[companyId]++;
  }

  const distinctCompanyIds = Object.keys(applicationCountsByCompany);
  const userCountsByCompany = [];

  for (const companyId of distinctCompanyIds) {
    const userCount = applicationCountsByCompany[companyId];
    const company = await companyModel.findOne({ user: companyId }).select("name logo").lean();
    userCountsByCompany.push({ company, userCount });
  }
  return userCountsByCompany;
}

//make function to return students from institution who applied to jobs
async function getStudentsByInstitution(institutionId, paginationQuery) {
  // get distinct users count where user.subModel is equal to institutionId
  const students = await studentModel.find({ institution: institutionId }).lean();
  const usersIds = students.map((student) => student.user);
  const queryResult = await paginator(applicationModel, { user: { $in: usersIds } }, paginationQuery, [
    "job",
    "existingCv",
    "existingCoverLetter",
    {
      path: "job",
      populate: [{ path: "jobType" }],
    },
    {
      path: "job",
      populate: [{ path: "currency" }],
    },
    {
      path: "job",
      populate: [{ path: "workType" }],
    },
    {
      path: "job",
      populate: [{ path: "company" }],
    },
    {
      path: "user",
      populate: [{ path: "subModel" }],
    },
    {
      path: "job",
      populate: [
        {
          path: "company",
          populate: [
            {
              path: "subModel",
              populate: [{ path: "headQuarters", populate: ["country", "city", "province"] }],
            },
          ],
        },
      ],
    },
    {
      path: "job",
      populate: [{ path: "city" }],
    },
    {
      path: "company",
      populate: [
        {
          path: "subModel",
          populate: [{ path: "headQuarters", populate: ["country", "city", "province"] }],
        },
      ],
    }
  ], { createdAt: -1 });
  return queryResult;

}


// make function to return students from institution who applied to jobs where status = 1
async function getStudentsByInstitutionAndHired(institutionId, paginationQuery) {
  // get distinct users count where user.subModel is equal to institutionId
  const students = await studentModel.find({ institution: institutionId }).lean();
  const usersIds = students.map((student) => student.user);
  const queryResult = await paginator(applicationModel, { user: { $in: usersIds }, status: "1" }, paginationQuery, [
    "job",
    "existingCv",
    "existingCoverLetter",
    {
      path: "job",
      populate: [{ path: "jobType" }],
    },
    {
      path: "job",
      populate: [{ path: "currency" }],
    },
    {
      path: "job",
      populate: [{ path: "workType" }],

    },
    {
      path: "job",
      populate: [{ path: "company" }],
    },
    {
      path: "user",
      populate: [{ path: "subModel" }],
    },
    {
      path: "job",
      populate: [
        {
          path: "company",
          populate: [
            {
              path: "subModel",
              populate: [{ path: "headQuarters", populate: ["country", "city", "province"] }],
            },
          ],
        },
      ],
    },
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
      path: "job",
      populate: [{ path: "city" }],
    },
  ], { createdAt: -1 });
  for (let i = 0; i < queryResult.queryResult.length; i++) {
    // replace the existingCv and existingCoverLetter with the attachment
    if (queryResult.queryResult[i].existingCv) {
      queryResult.queryResult[i].existingCv = queryResult.queryResult[i].existingCv.attachment;
    }
    if (queryResult.queryResult[i].existingCoverLetter) {
      queryResult.queryResult[i].existingCoverLetter = queryResult.queryResult[i].existingCoverLetter.attachment;
    }
  }
  return queryResult;

}


// make function to return applications where company = companieId
async function getApplicationsByCompany(companyId, paginationQuery) {
  let apps = await paginator(applicationModel, { company: companyId }, paginationQuery, [
    "job",
    "existingCv",
    "existingCoverLetter",
    {
      path: "job",
      populate: [{ path: "jobType" }],
    },
    {
      path: "job",
      populate: [{ path: "currency" }],
    },
    {
      path: "job",
      populate: [{ path: "workType" }],

    },
    {
      path: "job",
      populate: [{ path: "company" }],
    },
    {
      path: "user",
      populate: [{ path: "subModel" }],
    },
    {
      path: "job",
      populate: [
        {
          path: "company",
          populate: [
            {
              path: "subModel",
              populate: [{ path: "headQuarters", populate: ["country", "city", "province"] }],
            },
          ],
        },
      ],
    },
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
      path: "job",
      populate: [{ path: "city" }],
    },
  ], { createdAt: -1 });

  for (let i = 0; i < apps.queryResult.length; i++) {
    // replace the existingCv and existingCoverLetter with the attachment
    if (apps.queryResult[i].existingCv) {
      apps.queryResult[i].existingCv = apps.queryResult[i].existingCv.attachment;
    }
    if (apps.queryResult[i].existingCoverLetter) {
      apps.queryResult[i].existingCoverLetter = apps.queryResult[i].existingCoverLetter.attachment;
    }
  }
  return apps;
}

// make function to return applications where company = companieId status = 1
async function getApplicationsByCompanyAndStatus(companyId, paginationQuery) {
  let apps = await paginator(applicationModel, { company: companyId, status: "1" }, paginationQuery, [
    "job",
    "existingCv",
    "existingCoverLetter",
    {
      path: "job",
      populate: [{ path: "jobType" }],
    },
    {
      path: "job",
      populate: [{ path: "currency" }],
    },
    {
      path: "job",
      populate: [{ path: "workType" }],

    },
    {
      path: "job",
      populate: [{ path: "company" }],
    },
    {
      path: "user",
      populate: [{ path: "subModel" }],
    },
    {
      path: "job",
      populate: [
        {
          path: "company",
          populate: [
            {
              path: "subModel",
              populate: [{ path: "headQuarters", populate: ["country", "city", "province"] }],
            },
          ],
        },
      ],
    },
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
      path: "job",
      populate: [{ path: "city" }]
    },
  ], { createdAt: -1 });

  for (let i = 0; i < apps.queryResult.length; i++) {
    // replace the existingCv and existingCoverLetter with the attachment
    if (apps.queryResult[i].existingCv) {
      apps.queryResult[i].existingCv = apps.queryResult[i].existingCv.attachment;
    }
    if (apps.queryResult[i].existingCoverLetter) {
      apps.queryResult[i].existingCoverLetter = apps.queryResult[i].existingCoverLetter.attachment;
    }
  }
  return apps;
}

// make functio return companies that have specific workType in job and status = 1
async function getCompaniesThatHiresRemote(paginationQuery) {
  const regex = new RegExp('remote', 'i'); // 'i' flag makes it case-insensitive
  const workType = await workTypeModel.findOne({ 'nameEn': regex }).lean();
  let jobs = await jobModel.find({ workType: workType, status: 'approved' }).lean();
  let query = {
    user: {
      $in: jobs.map((job) => job.company)
    }
  }

  let companies = await companyModel.find(query).lean();
  let users = [];
  //loop through companies and get their user
  for (let i = 0; i < companies.length; i++) {
    users.push(companies[i].user);
  }

  let populateArray = ["city", "country", "province", "socialMediaLinks.socialMedia"];
  let newQuery = {
    _id: {
      $in: users
    }
  }
  const queryResult = await paginator(userModel, newQuery, paginationQuery, populateArray);
  for (let i = 0; i < queryResult.queryResult.length; i++) {
    if (queryResult.queryResult[i].model === userTypesModelNamesEnum.COMPANY)
      queryResult.queryResult[i].subModel = await companyRepo.findById(queryResult.queryResult[i].subModel);
  }

  return queryResult;

}

//get applications by user id
async function getApplicationsByUser(userId, paginationQuery) {
  return await paginator(applicationModel, { user: userId }, paginationQuery,
    [
      "job",
      "existingCv",
      "existingCoverLetter",
      {
        path: "job",
        populate: [{ path: "jobType" }],
      },
      {
        path: "job",
        populate: [{ path: "currency" }],
      },
      {
        path: "job",
        populate: [{ path: "workType" }],

      },
      {
        path: "job",
        populate: [{ path: "company" }],
      },
      {
        path: "user",
        populate: [{ path: "subModel" }],
      },
      {
        path: "job",
        populate: [
          {
            path: "company",
            populate: [
              {
                path: "subModel",
                populate: [{ path: "headQuarters", populate: ["country", "city", "province"] }],
              },
            ],
          },
        ],
      },
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
        path: "job",
        populate: [{ path: "city", populate: ["country"] }],
      },
    ], { createdAt: -1 });
}



export default {
  findAll,
  insert,
  findById,
  findByJobId,
  updateById,
  removeApplicationById,
  findByStudentAndJob,
  findByIdWithoutPopulate,
  getNumberOfDistinctUsersWhoAppliedToJobsInTimeRange,
  getNumberOfDistinctUsersWhereStatusIsHiredInTimeRange,
  getNumberOfDistinctUsersByCompanyWhereStatusIsHiredInTimeRange,
  getUserCountByCompanyAndFilters,
  getUsersByCompanyAndInstitution,
  getStudentsByInstitution,
  getStudentsByInstitutionAndHired,
  getApplicationsByCompany,
  getApplicationsByCompanyAndStatus,
  getCompaniesThatHiresRemote,
  getApplicationsByUser
};
