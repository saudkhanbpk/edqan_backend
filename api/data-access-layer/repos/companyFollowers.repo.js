import companyFollowersModel from "../models/companyFollowers.model.js";

async function findAll() {
  return await companyFollowersModel.find().populate("country").lean();
}
async function findById(companyFollowersId) {
  return await companyFollowersModel.findById(companyFollowersId).populate("country").lean();
}
async function updateById(companyFollowersId, updatedCompanyFollowersInfo) {
  return await companyFollowersModel
    .findByIdAndUpdate(companyFollowersId, updatedCompanyFollowersInfo, { new: true, runValidators: true })
    .populate("country")
    .lean();
}
async function insert(companyFollowersInfo) {
  const newCompanyFollowers = new companyFollowersModel(companyFollowersInfo);
  await newCompanyFollowers.save();
  return newCompanyFollowers;
}
async function removeCompanyFollowersById(CompanyFollowersId) {
  await companyFollowersModel.deleteOne({ _id: CompanyFollowersId });
  return;
}
export default { findAll, insert, findById, updateById, removeCompanyFollowersById };
