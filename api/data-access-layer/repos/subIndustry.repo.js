import subIndustryModel from "../models/subIndustry.model.js";
import paginator from "../../helper/paginator.js";
import companyModel from "../models/company.model.js";
import studentModel from "../models/student.model.js";

async function findAll(paginationQuery) {
  let query = {};
  const queryResult = await paginator(subIndustryModel, query, paginationQuery, ['industry'], { order: 1 });
 // loop over subIndusries and get their industry nameEn and store it in industry_nameEn
  for (let i = 0; i < queryResult.queryResult.length; i++) {
    queryResult.queryResult[i].industry_nameEn = queryResult.queryResult[i].industry.nameEn;
    queryResult.queryResult[i].industry = queryResult.queryResult[i].industry._id;

  }
  return queryResult;
}
async function findById(subIndustryId) {
  return await subIndustryModel.findById(subIndustryId).lean();
}
async function updateById(subIndustryId, updatedSubIndustryInfo) {
  return await subIndustryModel.findByIdAndUpdate(subIndustryId, updatedSubIndustryInfo, { new: true, runValidators: true }).lean();
}
async function insert(subIndustryInfo) {
  const newSubIndustry = new subIndustryModel(subIndustryInfo);
  await newSubIndustry.save();
  return newSubIndustry;
}
async function deleteSubIndustryById(SubIndustryId) {
  let companies = await companyModel.find({ "industries.subIndustry": SubIndustryId }).lean();
  if (companies.length > 0) {
    throw new Error("Can't delete this subIndustry because it's used by companies");
  }

  let students = await studentModel.find({ "careerInterest.subIndustry": SubIndustryId }).lean();
  if (students.length > 0) {
    throw new Error("Can't delete this subIndustry because it's used by students");
  }

  await subIndustryModel.deleteOne({ _id: SubIndustryId });
  return;
}
export default { findAll, insert, findById, updateById, deleteSubIndustryById };
