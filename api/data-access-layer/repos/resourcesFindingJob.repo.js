import resourcesFindingJobModel from "../models/subModels/resourcesFindingJob.model.js";

async function findAll() {
  return await resourcesFindingJobModel.find().lean();
}
async function findById(resourcesFindingJobId) {
  return await resourcesFindingJobModel.findById(resourcesFindingJobId).lean();
}
async function findByName(name) {
  return await resourcesFindingJobModel.find({ nameEn: { $regex: name, $options: "i" }, nameAR: { $regex: name, $options: "i" } }).lean();
}
async function updateById(resourcesFindingJobId, updatedResourcesFindingJobInfo) {
  return await resourcesFindingJobModel
    .findByIdAndUpdate(resourcesFindingJobId, updatedResourcesFindingJobInfo, { new: true, runValidators: true })
    .lean();
}
async function insert(resourcesFindingJobInfo) {
  const newResourcesFindingJob = new resourcesFindingJobModel(resourcesFindingJobInfo);
  await newResourcesFindingJob.save();
  return newResourcesFindingJob;
}
async function deleteResourcesFindingJobById(ResourcesFindingJobId) {
  await resourcesFindingJobModel.deleteOne({ _id: ResourcesFindingJobId });
  return;
}
export default { findAll, insert, findById, findByName, updateById, deleteResourcesFindingJobById };
