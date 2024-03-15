import howDidYouGetPaidModel from "../models/subModels/howDidYouGetPaid.model.js";

async function findAll() {
  return await howDidYouGetPaidModel.find().lean();
}
async function findById(howDidYouGetPaidId) {
  return await howDidYouGetPaidModel.findById(howDidYouGetPaidId).lean();
}
async function findByName(name) {
  return await howDidYouGetPaidModel.find({ name: { $regex: name, $options: "i" } }).lean();
}
async function updateById(howDidYouGetPaidId, updatedHowDidYouGetPaidInfo) {
  return await howDidYouGetPaidModel.findByIdAndUpdate(howDidYouGetPaidId, updatedHowDidYouGetPaidInfo, { new: true, runValidators: true }).lean();
}
async function insert(howDidYouGetPaidInfo) {
  const newHowDidYouGetPaid = new howDidYouGetPaidModel(howDidYouGetPaidInfo);
  await newHowDidYouGetPaid.save();
  return newHowDidYouGetPaid;
}
async function deleteHowDidYouGetPaidById(HowDidYouGetPaidId) {
  await howDidYouGetPaidModel.deleteOne({ _id: HowDidYouGetPaidId });
  return;
}
export default { findAll, insert, findById, findByName, updateById, deleteHowDidYouGetPaidById };
