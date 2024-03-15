import companyVersionModel from "../models/companyVersion.model.js";
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
async function findById(companyId) {
  return await companyVersionModel
    .findById(companyId)
    .populate("headQuarters.country")
    .populate("headQuarters.city")
    .populate("headQuarters.province")
    .populate("industries.industry")
    .populate("industries.subIndustries")
    .lean();
}
async function findByIdWithoutPopulate(companyId) {
  return await companyVersionModel.findById(companyId).lean();
}
async function updateById(companyId, updatedCompanyInfo) {
  return await companyVersionModel
    .findByIdAndUpdate(companyId, updatedCompanyInfo, {
      new: true,
      runValidators: true,
    })
    .lean();
}


async function insert(companyInfo) {
  const newCompany = new companyVersionModel(companyInfo);
  await newCompany.save();
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
