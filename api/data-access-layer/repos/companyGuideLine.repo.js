import companyGuideLineModel from "../models/companyGuideLine.model.js";

async function findAll() {
  return await companyGuideLineModel.find().lean();
}
async function findById(companyGuideLineId) {
  return await companyGuideLineModel.findById(companyGuideLineId).lean();
}
async function updateById(companyGuideLineId, updatedCompanyGuideLineInfo) {
  return await companyGuideLineModel.findByIdAndUpdate(companyGuideLineId, updatedCompanyGuideLineInfo, { new: true, runValidators: true }).lean();
}
async function insert(companyGuideLineInfo) {
  const newCompanyGuideLine = new companyGuideLineModel(companyGuideLineInfo);
  await newCompanyGuideLine.save();
  return newCompanyGuideLine;
}
async function removeCompanyGuideLineById(CompanyGuideLineId) {
  await companyGuideLineModel.deleteOne({ _id: CompanyGuideLineId });
  return;
}
export default { findAll, insert, findById, updateById, removeCompanyGuideLineById };
