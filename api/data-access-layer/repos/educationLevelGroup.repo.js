import educationLevelGroupModel from "../models/educationLevelGroup.model.js";

async function findAll() {
  return await educationLevelGroupModel.find().lean();
}
async function findById(educationLevelGroupId) {
  return await educationLevelGroupModel.findById(educationLevelGroupId).lean();
}
async function findByEducationLevel(educationLevelGroupId) {
  return await educationLevelGroupModel
    .findById(educationLevelGroupId)
    .select("fieldsToValidate name")
    .lean();
}
async function updateById(educationLevelGroupId, updatedEducationLevelGroupInfo) {
  return await educationLevelGroupModel
    .findByIdAndUpdate(educationLevelGroupId, updatedEducationLevelGroupInfo, { new: true, runValidators: true })
    .lean();
}
async function insert(educationLevelGroupInfo) {
  const newEducationLevelGroup = new educationLevelGroupModel(educationLevelGroupInfo);
  await newEducationLevelGroup.save();
  return newEducationLevelGroup;
}
async function removeEducationLevelGroupById(EducationLevelGroupId) {
  await educationLevelGroupModel.deleteOne({ _id: EducationLevelGroupId });
  return;
}
export default { findAll, insert, findById, findByEducationLevel, updateById, removeEducationLevelGroupById };
