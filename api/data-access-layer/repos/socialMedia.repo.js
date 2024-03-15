import socialMediaModel from "../models/subModels/socialMedia.model.js";

async function findAll() {
  return await socialMediaModel.find().lean();
}
async function findById(socialMediaId) {
  return await socialMediaModel.findById(socialMediaId).lean();
}
async function findByName(name) {
  return await socialMediaModel.find({ nameEn: { $regex: name, $options: "i" }, nameAR: { $regex: name, $options: "i" } }).lean();
}
async function updateById(socialMediaId, updatedSocialMediaInfo) {
  return await socialMediaModel.findByIdAndUpdate(socialMediaId, updatedSocialMediaInfo, { new: true, runValidators: true }).lean();
}
async function insert(socialMediaInfo) {
  const newSocialMedia = new socialMediaModel(socialMediaInfo);
  await newSocialMedia.save();
  return newSocialMedia;
}
async function deleteSocialMediaById(SocialMediaId) {
  await socialMediaModel.deleteOne({ _id: SocialMediaId });
  return;
}
export default { findAll, insert, findById, findByName, updateById, deleteSocialMediaById };
