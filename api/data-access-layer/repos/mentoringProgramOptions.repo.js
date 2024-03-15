import mentoringProgramOptionModel from "../models/subModels/mentoringProgramOptions.model.js";

async function findAll() {
  return await mentoringProgramOptionModel.find().lean();
}
async function findById(mentoringProgramOptionsId) {
  return await mentoringProgramOptionModel.findById(mentoringProgramOptionsId).lean();
}
async function findByName(name) {
  return await mentoringProgramOptionModel.find({ nameEn: { $regex: name, $options: "i" }, nameAR: { $regex: name, $options: "i" } }).lean();
}
async function updateById(mentoringProgramOptionsId, updatedMentoringProgramOptionsInfo) {
  return await mentoringProgramOptionModel
    .findByIdAndUpdate(mentoringProgramOptionsId, updatedMentoringProgramOptionsInfo, { new: true, runValidators: true })
    .lean();
}
async function insert(mentoringProgramOptionsInfo) {
  const newMentoringProgramOptions = new mentoringProgramOptionModel(mentoringProgramOptionsInfo);
  await newMentoringProgramOptions.save();
  return newMentoringProgramOptions;
}
async function deleteMentoringProgramOptionsById(MentoringProgramOptionsId) {
  await mentoringProgramOptionModel.deleteOne({ _id: MentoringProgramOptionsId });
  return;
}
export default { findAll, insert, findById, updateById, findByName, deleteMentoringProgramOptionsById };
