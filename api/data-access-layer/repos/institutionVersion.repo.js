import institutionVersionModel from "../models/institutionVersion.model.js";
// import paginator from "../../helper/paginator.js";
// import applicationModel from "../models/application.model.js";
// import jobModel from "../models/job.model.js";
// import workTypeModel from "../models/workType.model.js";
// import applicationStatusEnum from "../../types/applicationStatus.enum.js";

// async function findAll(school, country, workType, paginationQuery) {
//   let query = {};
//   if (school) {
//     query.school = school;
//     // return await applicationModel.find(query).lean();
//   }
//   if (workType) {
//     let remote = await workTypeModel.find({ nameEn: "remote" }).select("_id");
//     query.workType = remote;
//     return await jobModel.find(query).populate("company").select("-_id company").lean();
//   }
//   if (country) query.country = country;

//   const queryResult = await paginator(companyVersionModel, query, paginationQuery, [
//     "headQuarters.country",
//     "headQuarters.city",
//     {
//       path: "industries",
//       populate: ["industry", "subIndustries"],
//     },
//   ]);

//   return queryResult;
// }
async function findById(institutionId) {
  return await institutionVersionModel
    .findById(institutionId)
    .populate({
      path: "careerAdvisingLocation",
      populate: [
        {
          path: "country",
        },
        {
          path: "city",
        },
        {
          path: "province",
        },
      ],
    })
    .populate("user")
    .lean();
}
async function findByIdWithoutPopulate(institutionId) {
  return await institutionVersionModel.findById(institutionId).lean();
}
async function updateById(institutionId, updatedInstitutionInfo) {
  return await institutionVersionModel
    .findByIdAndUpdate(institutionId, updatedInstitutionInfo, {
      new: true,
      runValidators: true,
    })
    .lean();
}


async function insert(institutionInfo) {
  const newInstitution = new institutionVersionModel(institutionInfo);
  await newInstitution.save();
  // return newCompany.populate([
  //   "headQuarters.country",
  //   "headQuarters.city",
  //   {
  //     path: "industries",
  //     populate: ["industry", "subIndustries"],
  //   },
  // ]);
}
// async function removeCompanyById(CompanyId) {
//   await companyVersionModel.deleteOne({ _id: CompanyId });
//   return;
// }

// async function getStudentsThatHireFromCompany(companyId, paginationQuery) {
//   let paginatedJobApplications = await paginator(
//     applicationModel,
//     {
//       status: applicationStatusEnum.HIRED,
//     },
//     paginationQuery,
//     [
//       {
//         path: "user",
//         match: { "job.company": companyId },
//         populate: [{ path: "subModel", select: "firstName middleName lastName id " }],
//       },
//       {
//         path: "job",
//         populate: [ "jobType","workType", "company", "city",'country', "industry", "subIndustry",'major'],
//       }
//     ],
//     [],
//     "-questionsAnswers -status -visibility -existingCv"
//   );

//   return paginatedJobApplications;
// }

export default { insert, findById, updateById, findByIdWithoutPopulate };
