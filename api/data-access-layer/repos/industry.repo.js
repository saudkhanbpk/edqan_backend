import industryModel from "../models/industry.model.js";
import subIndustryModel from "../models/subIndustry.model.js";
import companyModel from "../models/company.model.js";
import mentorModel from "../models/mentor.model.js";

async function findAll() {
  return await industryModel.aggregate([
    {
      $lookup: {
        from: subIndustryModel.collection.name,
        localField: "_id",
        foreignField: "industry",
        as: "subIndustrys",
      },
    },
    {
      $sort: {
        order: 1, // Sorting in ascending order based on the "industryName" field
      },
    },
  ]);

  // return await subIndustryModel.find().populate('industry').lean();
}
async function findById(industryId) {
  return await industryModel.findById(industryId).lean();
}
async function updateById(industryId, updatedIndustryInfo) {
  return await industryModel.findByIdAndUpdate(industryId, updatedIndustryInfo, { new: true, runValidators: true }).lean();
}
async function insert(industryInfo) {
  const newIndustry = new industryModel(industryInfo);
  await newIndustry.save();
  return newIndustry;
}
async function deleteIndustryById(IndustryId) {
  let companies = await companyModel.find({ "industries.industry": IndustryId }).lean();
  if (companies.length > 0) {
    throw new Error("Can't delete this industry because it's used by companies");
  }

  let mentors = await mentorModel.find({ industry: IndustryId }).lean();
  if (mentors.length > 0) {
    throw new Error("Can't delete this industry because it's used by mentors");
  }

  let subIndustrys = await subIndustryModel.find({ industry: IndustryId }).lean();
  if (subIndustrys.length > 0) {
    await subIndustryModel.deleteMany({ industry: IndustryId });
  }
  await industryModel.deleteOne({ _id: IndustryId });
  return;
}
export default { findAll, insert, findById, updateById, deleteIndustryById };
